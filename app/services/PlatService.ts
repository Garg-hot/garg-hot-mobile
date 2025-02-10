import axios from 'axios';
import { Alert } from 'react-native';

export interface Plat {
  id: number;
  nom: string;
  slug: string;
  description?: string;
  duration?: number;
  categorie?: {
    id: number;
    nom: string;
    slug: string;
  };
  ingredients: {
    id: number;
    nom: string;
  }[];
  prix: string;
  image: string;
}

const API_URL = 'https://garg-hot-web.onrender.com/api';

// Création d'une instance axios avec la configuration appropriée
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Ajout d'un intercepteur pour gérer les erreurs
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('Erreur Axios:', {
      message: error.message,
      config: error.config,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Cache pour les plats
let platsCache: Plat[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

export const platService = {
  async getAllPlats(): Promise<Plat[]> {
    // Vérifier si le cache est valide
    const now = Date.now();
    if (platsCache && (now - lastFetchTime < CACHE_DURATION)) {
      return platsCache;
    }

    try {
      const response = await axiosInstance.get('/plat', {
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      platsCache = response.data;
      lastFetchTime = now;
      return platsCache;
    } catch (error) {
      console.error('Erreur lors de la récupération des plats:', error);
      // Si le cache existe, retourner le cache même s'il est expiré en cas d'erreur
      if (platsCache) {
        return platsCache;
      }
      throw error;
    }
  },

  getPlatById: async (id: number): Promise<Plat | null> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/plat/${id}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response
        ? `Erreur ${error.response.status}: ${JSON.stringify(error.response.data)}`
        : `Erreur réseau: ${error.message}`;

      Alert.alert('Erreur', errorMessage);
      return null;
    }
  },

  createPlat: async (platData: Partial<Plat>): Promise<Plat | null> => {
    try {
      const response = await axiosInstance.post(`${API_URL}/plat`, platData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response
        ? `Erreur ${error.response.status}: ${JSON.stringify(error.response.data)}`
        : `Erreur réseau: ${error.message}`;

      Alert.alert('Erreur', errorMessage);
      return null;
    }
  },

  updatePlat: async (id: number, platData: Partial<Plat>): Promise<Plat | null> => {
    try {
      const response = await axiosInstance.put(`${API_URL}/plat/${id}`, platData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response
        ? `Erreur ${error.response.status}: ${JSON.stringify(error.response.data)}`
        : `Erreur réseau: ${error.message}`;

      Alert.alert('Erreur', errorMessage);
      return null;
    }
  },

  deletePlat: async (id: number): Promise<boolean> => {
    try {
      await axiosInstance.delete(`${API_URL}/plat/${id}`);
      return true;
    } catch (error: any) {
      const errorMessage = error.response
        ? `Erreur ${error.response.status}: ${JSON.stringify(error.response.data)}`
        : `Erreur réseau: ${error.message}`;

      Alert.alert('Erreur', errorMessage);
      return false;
    }
  }
};