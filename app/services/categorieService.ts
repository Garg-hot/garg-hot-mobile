import axios from 'axios';
import { Alert } from 'react-native';

export interface Categorie {
  id: number;
  nom: string;
  slug?: string;
}

const API_URL = 'https://garg-hot-web.onrender.com/api';

// Création d'une instance axios avec la configuration appropriée
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Augmentation du timeout à 30 secondes
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

// Cache pour les catégories
let categoriesCache: Categorie[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

export const categorieService = {
  getAllCategories: async (): Promise<Categorie[]> => {
    // Vérifier si le cache est valide
    const now = Date.now();
    if (categoriesCache && (now - lastFetchTime < CACHE_DURATION)) {
      return categoriesCache;
    }

    try {
      const response = await axiosInstance.get('/categorie');
      categoriesCache = Array.isArray(response.data) ? response.data : [];
      lastFetchTime = now;
      return categoriesCache;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des catégories:', error);
      // Si le cache existe, retourner le cache même s'il est expiré en cas d'erreur
      if (categoriesCache) {
        return categoriesCache;
      }
      // Si pas de cache, retourner un tableau vide
      return [];
    }
  },

  getCategorieById: async (id: number): Promise<Categorie | null> => {
    try {
      if (!id || typeof id !== 'number') {
        console.error('ID de catégorie invalide:', id);
        return null;
      }
      const response = await axiosInstance.get(`/categorie/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error);
      return null;
    }
  }
};
