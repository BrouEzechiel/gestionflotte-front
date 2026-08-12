// src/types/utilisateur.type.ts

// On importe le rôle que nous avions déjà défini dans auth.type.ts
import { RoleUtilisateur } from './auth.type';

export interface UtilisateurResponse {
    id: number;
    identifiant: string;
    dateCreation: string; // LocalDateTime est converti en chaîne (string)
    role: RoleUtilisateur;
}