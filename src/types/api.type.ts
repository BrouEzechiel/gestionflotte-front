// src/types/api.type.ts

export interface ErreurResponse {
    timestamp: string;
    status: number;
    erreur: string;
    message: string;
    // Map<String, String> en Java se traduit par Record<string, string> en TypeScript
    // Le "?" indique que ce champ est optionnel (puisque vous avez un constructeur Java sans ce champ)
    details?: Record<string, string>;
}