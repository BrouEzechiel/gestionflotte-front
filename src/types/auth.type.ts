// src/types/auth.type.ts

export enum RoleUtilisateur {
    ADMINISTRATEUR = 'ADMINISTRATEUR',
    CAISSIER = 'CAISSIER'
}

export interface AuthenticationRequest {
    identifiant: string;
    motDePasse: string;
}

export interface RegisterRequest {
    identifiant: string;
    motDePasse: string;
    role: RoleUtilisateur;
}

export interface TokenRefreshRequest {
    refreshToken: string;
}

export interface AuthenticationResponse {
    accessToken: string;
    refreshToken: string;
    role: string;
    nom: string;    // <-- À rajouter
    prenom: string; // <-- À rajouter
}