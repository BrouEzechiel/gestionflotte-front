import apiClient from './axiosConfig';
import { AffectationResponse, AffectationRequest } from '../types/affectation.type';

export const affectationApi = {
    // Créer une nouvelle affectation
    creer: async (data: AffectationRequest): Promise<AffectationResponse> => {
        const response = await apiClient.post('/affectations', data);
        return response.data;
    },

    // Lister les affectations (La route qu'on vient d'ajouter)
    lister: async (): Promise<AffectationResponse[]> => {
        const response = await apiClient.get('/affectations');
        return response.data;
    },

    // Clôturer une affectation
    cloturer: async (id: number): Promise<AffectationResponse> => {
        const response = await apiClient.patch(`/affectations/${id}/cloturer`);
        return response.data;
    }
};