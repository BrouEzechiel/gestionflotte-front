// src/api/dashboard.api.ts
import apiClient from './axiosConfig';
import { KpiJournalierResponse, DashboardStatsResponse } from '../types/dashboard.type';
import { ChauffeurDetteResponse } from '../types/chauffeur.type';

export const dashboardApi = {
    // 1. Obtenir les KPIs
    getKpis: async (date?: string): Promise<KpiJournalierResponse> => {
        const response = await apiClient.get('/dashboard/kpi', { params: { date } });
        return response.data;
    },

    // 2. Obtenir les alertes de dettes
    getAlertesDettes: async (): Promise<ChauffeurDetteResponse[]> => {
        const response = await apiClient.get('/dashboard/alertes-dettes');
        return response.data;
    },

    // 3. Obtenir la rentabilité sur une période
    getRentabilite: async (debut: string, fin: string): Promise<number> => {
        const response = await apiClient.get('/dashboard/rentabilite', { params: { debut, fin } });
        return response.data;
    },

    getStatsGenerales: async (): Promise<DashboardStatsResponse> => {
        const response = await apiClient.get('/dashboard/stats-generales');
        return response.data;
    },

    // 5. Télécharger le rapport CSV
    exportCsv: async (debut: string, fin: string): Promise<void> => {
        const response = await apiClient.get('/dashboard/export-csv', {
            params: { debut, fin },
            responseType: 'blob', // Indispensable pour télécharger un fichier
        });

        // Création d'un lien invisible pour forcer le téléchargement dans le navigateur
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `rapport_versements_${debut}_au_${fin}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};