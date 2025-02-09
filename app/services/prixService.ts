import axios from 'axios';
import { Alert } from 'react-native';

export interface Prix {
  id: number;
  montant: number;
  date: string;
  platId?: number;
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

// Cache pour les prix
let prixCache: Prix[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

export const prixService = {
  /**
   * Récupère tous les prix
   */
  getAllPrix: async (): Promise<Prix[]> => {
    // Vérifier si le cache est valide
    const now = Date.now();
    if (prixCache && (now - lastFetchTime < CACHE_DURATION)) {
      return prixCache;
    }

    try {
      const response = await axiosInstance.get('/prix');
      prixCache = Array.isArray(response.data) ? response.data : [];
      lastFetchTime = now;
      return prixCache;
    } catch (error) {
      console.error('Erreur lors de la récupération des prix:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les prix');
      return [];
    }
  },

  /**
   * Récupère un prix par son ID
   * @param {number} id 
   */
  getPrixById: async (id: number): Promise<Prix | null> => {
    try {
      const response = await axiosInstance.get(`/prix/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du prix ID ${id}:`, error);
      Alert.alert('Erreur', 'Impossible de récupérer le prix');
      return null;
    }
  },

  /**
   * Ajoute un nouveau prix
   * @param {Omit<Prix, 'id'>} prix 
   */
  createPrix: async (prix: Omit<Prix, 'id'>): Promise<Prix | null> => {
    try {
      const response = await axiosInstance.post('/prix', prix);
      prixCache = null; // Invalider le cache
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du prix:', error);
      Alert.alert('Erreur', 'Impossible de créer le prix');
      return null;
    }
  },

  /**
   * Met à jour un prix
   * @param {number} id 
   * @param {Partial<Prix>} prix 
   */
  updatePrix: async (id: number, prix: Partial<Prix>): Promise<Prix | null> => {
    try {
      const response = await axiosInstance.put(`/prix/edit/${id}`, prix);
      prixCache = null; // Invalider le cache
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du prix:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le prix');
      return null;
    }
  },

  /**
   * Supprime un prix par ID
   * @param {number} id 
   */
  deletePrix: async (id: number): Promise<boolean> => {
    try {
      await axiosInstance.delete(`/prix/${id}`);
      prixCache = null; // Invalider le cache
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du prix:', error);
      Alert.alert('Erreur', 'Impossible de supprimer le prix');
      return false;
    }
  }
};