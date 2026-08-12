import apiClient from './axiosConfig';
import { ChauffeurResponse, ChauffeurRequest, StatutChauffeur, FicheChauffeurResponse } from '../types/chauffeur.type';

export const chauffeurApi = {
    // 1. Enregistrer un nouveau chauffeur
    enregistrer: async (data: ChauffeurRequest): Promise<ChauffeurResponse> => {
        const response = await apiClient.post('/chauffeurs', data);
        return response.data;
    },

    // 2. Lister tous les chauffeurs
    lister: async (): Promise<ChauffeurResponse[]> => {
        const response = await apiClient.get('/chauffeurs');
        return response.data;
    },

    // 3. Consulter la fiche complète
    consulterFiche: async (id: number): Promise<FicheChauffeurResponse> => {
        const response = await apiClient.get(`/chauffeurs/${id}`);
        return response.data;
    },

    // 4. Modifier les informations
    modifier: async (id: number, data: ChauffeurRequest): Promise<ChauffeurResponse> => {
        const response = await apiClient.put(`/chauffeurs/${id}`, data);
        return response.data;
    },

    // 5. Changer uniquement le statut
    changerStatut: async (id: number, nouveauStatut: StatutChauffeur): Promise<ChauffeurResponse> => {
        const response = await apiClient.patch(`/chauffeurs/${id}/statut`, null, {
            params: { nouveauStatut }
        });
        return response.data;
    }
};