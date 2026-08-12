// src/types/chauffeur.type.ts

import { AffectationResponse } from './affectation.type.ts';

export enum StatutChauffeur {
    ACTIF = 'ACTIF',
    SUSPENDU = 'SUSPENDU',
    CONGE = 'CONGE'
}

export interface ChauffeurRequest {
    nom: string;
    prenoms: string;
    telephone: string;
    numeroPermis: string;
    adresse: string;
}

export interface ChauffeurResponse {
    id: number;
    nom: string;
    prenoms: string;
    telephone: string;
    numeroPermis: string;
    adresse: string;
    statut: StatutChauffeur;
    dateEnregistrement: string; // Les dates (LocalDateTime) arrivent généralement sous forme de chaîne de caractères (string) en JSON
}

export interface FicheChauffeurResponse {
    id: number;
    nomComplet: string;
    telephone: string;
    numeroPermis: string;
    statut: StatutChauffeur;
    soldeFinancier: number; // BigDecimal est généralement manipulé en tant que "number" en JavaScript/TypeScript
    historiqueVehicules: AffectationResponse[];
}

export interface ChauffeurDetteResponse {
    idChauffeur: number;
    nomComplet: string;
    telephone: string;
    montantTotalDette: number;
}