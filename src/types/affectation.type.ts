// src/types/affectation.type.ts

export enum StatutAffectation {
    EN_COURS = 'EN_COURS',
    CLOTUREE = 'CLOTUREE'
}

export interface AffectationRequest {
    idChauffeur: number;
    idVehicule: number;
    recetteAttendueJournaliere: number; // BigDecimal est converti en number
    dateDebut?: string; // Optionnel (?) car votre commentaire Java indique "Si l'utilisateur ne l'envoie pas, on prendra la date du jour"
}

export interface AffectationResponse {
    id: number;
    dateDebut: string; // LocalDate arrive sous forme de chaîne (ex: "2023-10-25")
    dateFin: string | null; // Peut être null si l'affectation est toujours EN_COURS
    recetteAttendueJournaliere: number;
    statut: StatutAffectation;
    idChauffeur: number | null; // Typé avec '| null' car le constructeur Java prévoit ce cas de figure
    idVehicule: number | null;  // Typé avec '| null' pour la même raison
}