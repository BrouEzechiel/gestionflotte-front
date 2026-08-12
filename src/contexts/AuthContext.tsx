import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/api/auth.api';
import { AuthenticationRequest, RoleUtilisateur } from '@/types/auth.type';

// 1. On crée un petit type pour les infos de l'utilisateur
export interface UserData {
    nom: string;
    prenom: string;
    role: RoleUtilisateur;
}

interface AuthContextType {
    isAuthenticated: boolean;
    userRole: RoleUtilisateur | null;
    user: UserData | null; // <-- Nouvel ajout
    login: (data: AuthenticationRequest) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<RoleUtilisateur | null>(null);
    const [user, setUser] = useState<UserData | null>(null); // <-- Nouvel ajout
    const [loading, setLoading] = useState<boolean>(true);

    // Vérifier si l'utilisateur est déjà connecté au chargement de l'app
    useEffect(() => {
        const checkAuth = () => {
            const authStatus = localStorage.getItem('isAuthenticated') === 'true';
            const savedRole = localStorage.getItem('userRole') as RoleUtilisateur;
            const savedNom = localStorage.getItem('userNom');
            const savedPrenom = localStorage.getItem('userPrenom');

            if (authStatus && savedRole) {
                setIsAuthenticated(true);
                setUserRole(savedRole);

                // Si on a le nom et prénom en mémoire, on recrée l'objet user
                if (savedNom && savedPrenom) {
                    setUser({ nom: savedNom, prenom: savedPrenom, role: savedRole });
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (data: AuthenticationRequest) => {
        try {
            const response = await authApi.login(data);

            // Mise à jour de l'état
            setIsAuthenticated(true);
            setUserRole(response.role as RoleUtilisateur);

            // On sauvegarde l'objet user complet
            setUser({
                nom: response.nom,
                prenom: response.prenom,
                role: response.role as RoleUtilisateur
            });

            // On garde une trace légère pour le rafraîchissement de page
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', response.role);

            // On sauvegarde aussi les infos perso
            if (response.nom) localStorage.setItem('userNom', response.nom);
            if (response.prenom) localStorage.setItem('userPrenom', response.prenom);

        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } finally {
            setIsAuthenticated(false);
            setUserRole(null);
            setUser(null); // <-- On vide l'utilisateur

            // On nettoie tout le localStorage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userNom');
            localStorage.removeItem('userPrenom');
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};