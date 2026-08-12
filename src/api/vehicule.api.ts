import apiClient from './axiosConfig';
import { VehiculeResponse, VehiculeRequest, EtatVehicule } from '../types/vehicule.type';

export const vehiculeApi = {
    ajouter: async (data: VehiculeRequest): Promise<VehiculeResponse> => {
        const response = await apiClient.post('/vehicules', data);
        return response.data;
    },

    lister: async (etat?: EtatVehicule, marque?: string): Promise<VehiculeResponse[]> => {
        const response = await apiClient.get('/vehicules', {
            params: { etat, marque }
        });
        return response.data;
    },

    changerEtat: async (id: number, nouvelEtat: EtatVehicule): Promise<VehiculeResponse> => {
        const response = await apiClient.patch(`/vehicules/${id}/etat`, null, {
            params: { nouvelEtat }
        });
        return response.data;
    },

    archiver: async (id: number): Promise<string> => {
        const response = await apiClient.delete(`/vehicules/${id}`);
        return response.data;
    }
};