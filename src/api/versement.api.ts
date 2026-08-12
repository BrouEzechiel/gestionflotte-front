import apiClient from './axiosConfig';
import { VersementResponse, VersementRequest } from '../types/versement.type';

export const versementApi = {
    // 1. Enregistrer un versement
    enregistrer: async (data: VersementRequest): Promise<VersementResponse> => {
        const response = await apiClient.post('/versements', data);
        return response.data;
    },

    // 2. Lister les versements
    lister: async (chauffeurId?: number, dateDebut?: string, dateFin?: string): Promise<VersementResponse[]> => {
        const response = await apiClient.get('/versements', {
            params: { chauffeurId, dateDebut, dateFin }
        });
        return response.data;
    }
};