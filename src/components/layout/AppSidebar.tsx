import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    Truck,
    Banknote,
    Link2,
    Receipt,
    LogOut,
    ChevronLeft,
    Menu,
    UserSquare, // <-- NOUVEL IMPORT
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// 1. Importation du logo
import logoFlotte from '@/assets/logo.jpeg';

const navItems = [
    { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['ADMINISTRATEUR', 'CAISSIER'] },
    { path: '/chauffeurs', label: 'Chauffeurs', icon: Users, roles: ['ADMINISTRATEUR'] },
    { path: '/vehicules', label: 'Véhicules', icon: Truck, roles: ['ADMINISTRATEUR'] },
    { path: '/proprietaires', label: 'Propriétaires', icon: UserSquare, roles: ['ADMINISTRATEUR'] }, // <-- NOUVELLE ROUTE
    { path: '/versements', label: 'Versements', icon: Banknote, roles: ['ADMINISTRATEUR', 'CAISSIER'] },
    { path: '/affectations', label: 'Affectations', icon: Link2, roles: ['ADMINISTRATEUR'] },
    { path: '/depenses', label: 'Dépenses', icon: Receipt, roles: ['ADMINISTRATEUR'] },
] as const;

export const AppSidebar = () => {
    const { userRole, logout, user } = useAuth();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const filteredNav = navItems.filter(item => userRole && (item.roles as readonly string[]).includes(userRole));

    useEffect(() => {
        if (window.innerWidth < 1024) {
            setCollapsed(true);
        }
    }, [location.pathname]);

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="fixed top-4 left-4 z-50 rounded-lg bg-card border p-2 shadow-md lg:hidden"
            >
                <Menu className="h-5 w-5 text-foreground" />
            </button>

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 border-r shadow-sm",
                    "bg-card text-card-foreground",
                    collapsed ? "w-[70px]" : "w-64",
                    "max-lg:translate-x-[-100%] lg:translate-x-0",
                    !collapsed && "max-lg:translate-x-0"
                )}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between px-4 border-b">
                    {!collapsed && (
                        // 2. Remplacement du texte/icône par l'image du logo
                        <div className="flex items-center">
                            <img
                                src={logoFlotte}
                                alt="Logo FlotteGo"
                                className="h-12 w-auto object-contain rounded"
                            />
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden rounded-md p-1 hover:bg-accent hover:text-accent-foreground lg:block"
                    >
                        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
                    {filteredNav.map(item => {
                        const active = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                    active
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User / Logout */}
                <div className="border-t p-3">
                    {!collapsed && (
                        <div className="mb-2 px-3">
                            <p className="text-sm font-semibold text-foreground capitalize">
                                {user ? `${user.prenom} ${user.nom}` : 'Mon Compte'}
                            </p>
                            <p className="text-xs text-muted-foreground">{userRole}</p>
                        </div>
                    )}
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>Déconnexion</span>}
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {!collapsed && (
                <div
                    className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setCollapsed(true)}
                />
            )}
        </>
    );
};