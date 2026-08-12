// src/types/versement.type.ts

export enum StatutVersement {
    SOLDE = 'SOLDE',
    RELIQUAT = 'RELIQUAT',
    AVANCE = 'AVANCE'
}

export interface VersementRequest {
    idAffectation: number; // Long converti en number
    montantVerse: number;  // BigDecimal converti en number
}

export interface VersementResponse {
    id: number;
    dateVersement: string; // LocalDate est généralement transmis sous forme de chaîne ("YYYY-MM-DD")
    montantVerse: number;
    ecart: number;
    statut: StatutVersement;
    idAffectation: number | null; // Peut être null selon le constructeur Java
    idReliquatRegle: number | null; // Peut être null si aucun reliquat n'est réglé
    nomChauffeur: string | null; // Peut être null selon le constructeur Java
    marqueVehicule: string | null; // Peut être null selon le constructeur Java
}