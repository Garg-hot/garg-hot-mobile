import axios from 'axios';
import { Alert } from 'react-native';

const API_URL = 'https://garg-hot-web.onrender.com/api';

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

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs globalement
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Log de l'erreur désactivé pour le moment
    return Promise.reject(error);
  }
);

const CommandeService = {
  // Créer une nouvelle commande avec des plats
  createCommande: async (commandeRequest: CommandeRequest): Promise<any> => {
    try {
      const response = await axiosInstance.post('/commandes', commandeRequest);
      console.log("Réponse création commande:", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour le statut d'une commande
  updateCommandeStatus: async (commandeId: number, status: number): Promise<any> => {
    try {
      const response = await axiosInstance.put(`/commandes/${commandeId}`, { statut: status });
      console.log("Réponse mise à jour commande:", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer toutes les commandes
  getAllCommandes: async (): Promise<any[]> => {
    try {
      const response = await axiosInstance.get('/commandes');
      console.log("Réponse récupération commandes:", response.data);
      return response.data;
    } catch (error) {
      return [];
    }
  },

  // Récupérer toutes les commandes d'un client
  getCommandesByClient: async (clientId: string): Promise<any[]> => {
    try {
      // Récupérer toutes les commandes
      const response = await axiosInstance.get('/commandes');
      console.log("Réponse commandes:", response.data);
      
      // Obtenir les prix fixes des plats
      const prixPlats: { [key: number]: number } = {
        1: 10000, // Sandwich Parisienne
        7: 25000, // Pizza Margheritta
        11: 10000, // Soupe Chinoise
        // Ajoutez d'autres plats ici
      };
      
      // Filtrer les commandes pour ce client
      const commandes = response.data.filter((commande: any) => 
        commande.id_client === clientId
      );

      // Pour chaque commande, ajouter les prix des plats
      const commandesAvecPrix = commandes.map((commande: any) => {
        const platsAvecPrix = (commande.plats || []).map((plat: any) => ({
          ...plat,
          nom: plat.nom_plat,
          prix: prixPlats[plat.id] || 0,
          ingredients: plat.ingredients,
          quantite: 1
        }));

        return {
          ...commande,
          plats: platsAvecPrix
        };
      });
      
      console.log("Commandes finales avec prix:", commandesAvecPrix);
      return commandesAvecPrix;
    } catch (error) {
      console.error("Erreur globale:", error.response?.data || error.message);
      throw error;
    }
  },

  // Récupérer une commande spécifique
  getCommandeById: async (id: number): Promise<any> => {
    try {
      console.log("Récupération commande avec ID:", id);
      const response = await axiosInstance.get(`/commandes/${id}`);
      console.log("Réponse récupération commande:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la commande ID ${id}:`, error);
      throw error;
    }
  },

  // Supprimer une commande
  deleteCommande: async (id: number): Promise<any> => {
    try {
      console.log("Suppression commande avec ID:", id);
      const response = await axiosInstance.delete(`/commandes/${id}`);
      console.log("Réponse suppression commande:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la commande ID ${id}:`, error);
      throw error;
    }
  },

  // Tester la disponibilité des endpoints
  testEndpoints: async (): Promise<void> => {
    try {
      console.log("Test des endpoints");
      await axiosInstance.get('/commandes/');
      console.log('Endpoint /commandes disponible');
    } catch (error) {
      console.error('Erreur lors du test des endpoints:', error);
    }
  }
};

export default CommandeService;