import apiClient from './axiosConfig';
import { DepenseRequest, DepenseResponse } from '../types/depense.type';

export const depenseApi = {
    // 1. Ajouter une dépense
    ajouter: async (data: DepenseRequest): Promise<DepenseResponse> => {
        const response = await apiClient.post('/depenses', data);
        return response.data;
    },

    // 2. Lister toutes les dépenses
    lister: async (): Promise<DepenseResponse[]> => {
        const response = await apiClient.get('/depenses');
        return response.data;
    }
};