// src/types/dashboard.type.ts

export interface KpiJournalierResponse {
    recetteAttendueGlobale: number; // BigDecimal devient number
    totalEncaisse: number;
    totalImpayes: number;
    totalDepenses: number; // <-- NOUVEAU
    beneficeNet: number;   // <-- NOUVEAU
}

export interface RecetteJournaliere {
    date: string;
    montant: number;
}

export interface DashboardStatsResponse {
    chauffeursActifs: number;
    vehiculesTotal: number;
    vehiculesEnService: number;
    vehiculesEnPanne: number;
    recettesSur7Jours: RecetteJournaliere[];
}