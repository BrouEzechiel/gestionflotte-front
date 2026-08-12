export enum TypeDepense {
    REPARATION = 'REPARATION',
    ENTRETIEN = 'ENTRETIEN',
    ASSURANCE = 'ASSURANCE',
    IMPOT = 'IMPOT',
    VISITE_TECHNIQUE = 'VISITE_TECHNIQUE',
    AUTRE = 'AUTRE'
}

export interface DepenseRequest {
    idVehicule: number;
    montant: number;
    description: string;
    typeDepense: TypeDepense;
    dateDepense?: string; // Optionnel, le backend mettra la date du jour si c'est vide
}

export interface DepenseResponse {
    id: number;
    dateDepense: string;
    montant: number;
    description: string;
    typeDepense: TypeDepense;
    idVehicule: number;
    immatriculationVehicule: string;
}