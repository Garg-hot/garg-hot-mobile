import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseCongig';
import CommandeService from '../services/CommandeService';

const COLORS = {
  background: '#FFFAF0',
  primary: '#D2691E',
  secondary: '#FF8C00',
  text: '#5A3E1B',
  textSecondary: '#A0522D',
  success: '#4CAF50',
  warning: '#FFA000',
};

interface Props {
  onBack: () => void;
}

interface Plat {
  id: number;
  nom: string;
  prix: number;
  ingredients: { nom: string }[];
  quantite: number;
}

interface Commande {
  commande_id: number;
  createdAt: string;
  id_client: string;
  plats: Plat[];
  statut: number;
}

const OrderStats: React.FC<Props> = ({ onBack }) => {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    loadCommandes();
  }, []);

  const loadCommandes = async () => {
    if (!user) {
      console.log("Pas d'utilisateur connecté");
      return;
    }

    setLoading(true);
    try {
      console.log("Chargement des commandes pour l'utilisateur:", user.uid);
      const data = await CommandeService.getCommandesByClient(user.uid);
      console.log("Données reçues:", data);
      setCommandes(data);
    } catch (error: any) {
      console.error("Erreur lors du chargement des commandes:", error);
      Alert.alert(
        'Erreur',
        'Impossible de charger les commandes. ' + 
        (error.response?.data?.message || error.message || 'Veuillez réessayer plus tard.')
      );
      setCommandes([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: number) => {
    return status === 1 ? 'Payé' : 'Non payé';
  };

  const getStatusStyle = (status: number) => {
    return status === 1 ? styles.statusPaid : styles.statusUnpaid;
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Date inconnue';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return 'Date invalide';
    }
  };

  const calculateTotal = (plats: Plat[]) => {
    if (!plats || !Array.isArray(plats)) return 0;
    return plats.reduce((total, plat) => {
      return total + (plat.prix * plat.quantite);
    }, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Commandes</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Chargement...</Text>
        ) : commandes.length === 0 ? (
          <Text style={styles.emptyText}>Aucune commande</Text>
        ) : (
          commandes.map((commande) => (
            <View key={commande.commande_id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderDate}>
                  {formatDate(commande.createdAt)}
                </Text>
                <Text style={[styles.orderStatus, getStatusStyle(commande.statut)]}>
                  {getStatusText(commande.statut)}
                </Text>
              </View>

              <View style={styles.platsContainer}>
                {Array.isArray(commande.plats) && commande.plats.length > 0 ? (
                  commande.plats.map((plat, index) => (
                    <View key={index} style={styles.platItem}>
                      <View style={styles.platHeader}>
                        <Text style={styles.platName}>
                          {plat.nom || 'Plat inconnu'}
                        </Text>
                        <View style={styles.platDetails}>
                          <Text style={styles.platQuantity}>
                            x{plat.quantite || 1}
                          </Text>
                          <Text style={styles.platPrice}>
                            {plat.prix.toFixed(2)} Ar
                          </Text>
                        </View>
                      </View>
                      {plat.ingredients && plat.ingredients.length > 0 && (
                        <Text style={styles.ingredients}>
                          {plat.ingredients.map(ing => ing.nom).join(', ')}
                        </Text>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>Aucun plat dans cette commande</Text>
                )}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>
                  {calculateTotal(commande.plats).toFixed(2)} Ar
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: 20,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 16,
    color: COLORS.text,
  },
  orderStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusPaid: {
    backgroundColor: COLORS.success + '20',
    color: COLORS.success,
  },
  statusUnpaid: {
    backgroundColor: COLORS.warning + '20',
    color: COLORS.warning,
  },
  platsContainer: {
    marginBottom: 12,
  },
  platItem: {
    flexDirection: 'column',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  platHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  platDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platName: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  platQuantity: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  platPrice: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  ingredients: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default OrderStats;
