// src/api/axiosConfig.ts
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // C'est cette ligne qui fait que le navigateur gère les cookies automatiquement
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;