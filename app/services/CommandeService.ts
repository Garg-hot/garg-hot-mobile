import axios from 'axios';
import { Alert } from 'react-native';

// Format exact pour un plat dans la commande
export interface PlatCommande {
  id: number;
  quantite: number;
}

// Format exact pour la requête de commande
export interface CommandeRequest {
  statut: number;
  id_client: string;
  plats: PlatCommande[];
}

const API_URL = 'https://garg-hot-web.onrender.com/api';

// Création d'une instance axios avec la configuration appropriée
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Ajout d'un intercepteur pour gérer les erreurs
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    /*console.error('Erreur Axios:', {
      message: error.message,
      config: error.config,
      response: error.response?.data
    });*/
    return Promise.reject(error);
  }
);

const CommandeService = {
  // Créer une nouvelle commande avec des plats
  createCommande: async (commandeRequest: CommandeRequest): Promise<any> => {
    try {
      // D'abord, on vérifie si l'endpoint de base existe
      const response = await axiosInstance.post('/commandes/', commandeRequest);
      return response.data;
    } catch (error) {
      //console.error('Erreur lors de la création de la commande:', error);
      //Alert.alert('Erreur', 'Impossible de créer la commande');
      throw error;
    }
  },

  // Mettre à jour une commande existante
  updateCommande: async (id: string, commandeRequest: CommandeRequest): Promise<any> => {
    try {
      const response = await axiosInstance.put(`/commandes/${id}`, commandeRequest);
      return response.data;
    } catch (error) {
      //console.error('Erreur lors de la mise à jour de la commande:', error);
      //Alert.alert('Erreur', 'Impossible de mettre à jour la commande');
      throw error;
    }
  },

  // Récupérer toutes les commandes d'un client
  getCommandesByClient: async (clientId: string): Promise<any[]> => {
    try {
      const response = await axiosInstance.get(`/commandes/utilisateur/${clientId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      //console.error('Erreur lors de la récupération des commandes:', error);
      //Alert.alert('Erreur', 'Impossible de récupérer les commandes');
      return [];
    }
  },

  // Récupérer une commande spécifique
  getCommandeById: async (id: string): Promise<any> => {
    try {
      const response = await axiosInstance.get(`/commandes/${id}`);
      return response.data;
    } catch (error) {
      //console.error(`Erreur lors de la récupération de la commande ID ${id}:`, error);
      //Alert.alert('Erreur', 'Impossible de récupérer la commande');
      throw error;
    }
  },

  // Tester la disponibilité des endpoints
  testEndpoints: async (): Promise<void> => {
    try {
      // Test de l'endpoint de base
      await axiosInstance.get('/commandes/');
      console.log('Endpoint /commandes disponible');
    } catch (error) {
      console.error('Erreur lors du test des endpoints:', error);
    }
  }
};

export default CommandeService;