import axios from 'axios';

const API_URL = 'https://garg-hot-web.onrender.com/api';

// Format exact pour une vente
export interface Vente {
  id: number;
  date: string;
  montant: number;
  id_plat: number;
  quantite: number;
}

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
  /*error => {
    console.error('Erreur Axios:', {
      message: error.message,
      config: error.config,
      response: error.response?.data
    });
    return Promise.reject(error);
  }*/
);

const VenteService = {
  // Récupérer toutes les ventes
  getAllVentes: async (): Promise<Vente[]> => {
    try {
      const response = await axiosInstance.get('/vente/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      //console.error('Erreur lors de la récupération des ventes:', error);
      return [];
    }
  },

  // Récupérer une vente spécifique
  getVenteById: async (id: number): Promise<Vente | null> => {
    try {
      const response = await axiosInstance.get(`/vente/${id}`);
      return response.data;
    } catch (error) {
      //console.error(`Erreur lors de la récupération de la vente ID ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les ventes d'un plat spécifique
  getVentesByPlat: async (platId: number): Promise<Vente[]> => {
    try {
      const response = await axiosInstance.get(`/vente/plat/${platId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      //console.error('Erreur lors de la récupération des ventes du plat:', error);
      return [];
    }
  },

  // Récupérer les ventes par date
  getVentesByDate: async (date: string): Promise<Vente[]> => {
    try {
      const response = await axiosInstance.get(`/vente/date/${date}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      //console.error('Erreur lors de la récupération des ventes par date:', error);
      return [];
    }
  },

  // Tester la disponibilité des endpoints
  testEndpoints: async (): Promise<void> => {
    try {
      await axiosInstance.get('/vente/');
      //console.log('Endpoint /vente disponible');
    } catch (error) {
      //console.error('Erreur lors du test des endpoints:', error);
    }
  }
};

export default VenteService;
