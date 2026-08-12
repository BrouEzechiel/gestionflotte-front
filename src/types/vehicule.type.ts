// src/types/vehicule.type.ts

export enum EtatVehicule {
    ACTIF = 'ACTIF',
    EN_PANNE = 'EN_PANNE',
    AU_GARAGE = 'AU_GARAGE',
    VENDU = 'VENDU',
    ARCHIVE = 'ARCHIVE'
}

export interface VehiculeRequest {
    immatriculation: string;
    marque: string;
    modele: string;
    dateMiseEnCirculation: string;
    etat: EtatVehicule;
    idProprietaire: number; // <-- NOUVEAU
}

export interface VehiculeResponse {
    id: number;
    immatriculation: string;
    marque: string;
    modele: string;
    dateMiseEnCirculation: string | null;
    etat: EtatVehicule;
    dateAjout: string | null;
    idProprietaire: number; // <-- NOUVEAU
    nomCompletProprietaire?: string; // <-- NOUVEAU (Si ton backend le renvoie)
}