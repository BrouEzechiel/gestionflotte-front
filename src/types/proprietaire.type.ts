// src/types/proprietaire.type.ts

export interface ProprietaireRequest {
    nom: string;
    prenoms: string;
    telephone: string;
}

export interface ProprietaireResponse {
    id: number;
    nom: string;
    prenoms: string;
    telephone: string;
}

export interface EtatProprietaireResponse {
    idProprietaire: number;
    nom: string;
    prenoms: string;
    totalVersements: number;
    totalDepenses: number;
    gainNet: number;
}