// src/api/auth.api.ts
import apiClient from './axiosConfig';
import {
    AuthenticationRequest,
    AuthenticationResponse,
    RegisterRequest,
    TokenRefreshRequest
} from '../types/auth.type';

export const authApi = {
    /**
     * Connecte l'utilisateur
     * Le backend renverra les cookies accessToken et refreshToken automatiquement
     */
    login: async (data: AuthenticationRequest): Promise<AuthenticationResponse> => {
        // RETRAIT DU SLASH INITIAL POUR RESPECTER LE BASE_URL (/api)
        const response = await apiClient.post<AuthenticationResponse>('auth/login', data);
        return response.data;
    },

    /**
     * Inscrit un nouvel utilisateur (Admin ou Caissier)
     */
    register: async (data: RegisterRequest): Promise<AuthenticationResponse> => {
        const response = await apiClient.post<AuthenticationResponse>('auth/register', data);
        return response.data;
    },

    /**
     * Rafraîchit le token d'accès
     */
    refreshToken: async (data: TokenRefreshRequest): Promise<AuthenticationResponse> => {
        const response = await apiClient.post<AuthenticationResponse>('auth/refresh', data);
        return response.data;
    },

    /**
     * Déconnecte l'utilisateur en demandant au backend de supprimer les cookies
     */
    logout: async (): Promise<void> => {
        await apiClient.post('auth/logout');
    }
};