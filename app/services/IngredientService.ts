import axios from 'axios';
import { Alert } from 'react-native';

export interface Ingredient {
  id: number;
  nom: string;
  quantite: number;
  unite: string;
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

// Cache pour les ingrédients
let ingredientsCache: Ingredient[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

export const ingredientService = {
  /**
   * Récupère tous les ingrédients
   */
  getAllIngredients: async (): Promise<Ingredient[]> => {
    // Vérifier si le cache est valide
    const now = Date.now();
    if (ingredientsCache && (now - lastFetchTime < CACHE_DURATION)) {
      return ingredientsCache;
    }

    try {
      const response = await axiosInstance.get('/ingredient');
      ingredientsCache = Array.isArray(response.data) ? response.data : [];
      lastFetchTime = now;
      return ingredientsCache;
    } catch (error) {
      console.error('Erreur lors de la récupération des ingrédients:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les ingrédients');
      return [];
    }
  },

  /**
   * Récupère un ingrédient par son ID
   * @param {number} id 
   */
  getIngredientById: async (id: number): Promise<Ingredient | null> => {
    try {
      const response = await axiosInstance.get(`/ingredient/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'ingrédient ID ${id}:`, error);
      Alert.alert('Erreur', 'Impossible de récupérer l\'ingrédient');
      return null;
    }
  },

  /**
   * Crée un nouvel ingrédient
   * @param {Omit<Ingredient, 'id'>} ingredient 
   */
  createIngredient: async (ingredient: Omit<Ingredient, 'id'>): Promise<Ingredient | null> => {
    try {
      const response = await axiosInstance.post('/ingredient', ingredient);
      ingredientsCache = null; // Invalider le cache
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'ingrédient:', error);
      Alert.alert('Erreur', 'Impossible de créer l\'ingrédient');
      return null;
    }
  },

  /**
   * Met à jour un ingrédient
   * @param {number} id 
   * @param {Partial<Ingredient>} ingredient 
   */
  updateIngredient: async (id: number, ingredient: Partial<Ingredient>): Promise<Ingredient | null> => {
    try {
      const response = await axiosInstance.put(`/ingredient/edit/${id}`, ingredient);
      ingredientsCache = null; // Invalider le cache
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'ingrédient:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour l\'ingrédient');
      return null;
    }
  },

  /**
   * Supprime un ingrédient par ID
   * @param {number} id 
   */
  deleteIngredient: async (id: number): Promise<boolean> => {
    try {
      await axiosInstance.delete(`/ingredient/${id}`);
      ingredientsCache = null; // Invalider le cache
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'ingrédient:', error);
      Alert.alert('Erreur', 'Impossible de supprimer l\'ingrédient');
      return false;
    }
  }
};