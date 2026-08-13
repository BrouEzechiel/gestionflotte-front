// src/api/axiosConfig.ts
import axios from 'axios';

const apiClient = axios.create({
    // AJOUT DE /api DIRECTEMENT DANS LA BASE URL POUR TOUTES LES REQUÊTES
    baseURL: 'https://gestionflotte-back.onrender.com/api',
    withCredentials: true, // C'est cette ligne qui fait que le navigateur gère les cookies automatiquement
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;