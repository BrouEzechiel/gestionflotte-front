// src/api/proprietaire.api.ts
import apiClient from './axiosConfig';
import { ProprietaireRequest, ProprietaireResponse, EtatProprietaireResponse } from '../types/proprietaire.type';

export const proprietaireApi = {
    // 1. Ajouter un propriétaire
    ajouter: async (data: ProprietaireRequest): Promise<ProprietaireResponse> => {
        const response = await apiClient.post('/proprietaires', data);
        return response.data;
    },

    // 2. Lister les propriétaires (infos de base)
    lister: async (): Promise<ProprietaireResponse[]> => {
        const response = await apiClient.get('/proprietaires');
        return response.data;
    },

    // 3. Obtenir les états financiers (pour affichage dans l'application si besoin)
    obtenirEtats: async (): Promise<EtatProprietaireResponse[]> => {
        const response = await apiClient.get('/proprietaires/etats');
        return response.data;
    },

    // 4. Télécharger l'export Excel
    exportExcel: async (): Promise<void> => {
        const response = await apiClient.get('/proprietaires/etats/export/excel', {
            responseType: 'blob', // Important pour les fichiers binaires
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'etats_financiers_proprietaires.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    // 5. Télécharger l'export PDF
    exportPdf: async (): Promise<void> => {
        const response = await apiClient.get('/proprietaires/etats/export/pdf', {
            responseType: 'blob', // Important pour les fichiers binaires
        });

        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'etats_financiers_proprietaires.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};