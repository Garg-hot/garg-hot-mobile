import React, { useEffect, useState } from 'react'; 
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseCongig';

const COLORS = {
  background: '#FFFAF0', // Fond crème pour un effet chaleureux
  primary: '#D2691E', // Marron clair pour rappeler la cuisson
  secondary: '#FF8C00', // Orange feu
  text: '#5A3E1B', // Marron foncé pour le texte
  textSecondary: '#A0522D', // Marron plus clair
  inputBackground: '#FFF5E1', // Beige clair pour les champs de saisie
};

interface OrderItem {
  platId: string;
  nom: string;
  prix: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  status: 'en_cours' | 'pret' | 'vendu';
  total: number;
  userId: string;
}

interface Props {
  onBack: () => void;
}

const OrderStats: React.FC<Props> = ({ onBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (!user) return;

    try {
      const ordersRef = collection(FIREBASE_DB, 'commandes');
      const q = query(ordersRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const ordersData: Order[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date || new Date().toISOString(),
      } as Order));

      // Trier les commandes par date (plus récentes en premier)
      ordersData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Erreur', 'Impossible de charger les commandes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: 'pret' | 'vendu') => {
    try {
      const orderRef = doc(FIREBASE_DB, 'commandes', orderId);
      await updateDoc(orderRef, {
        status: newStatus
      });

      // Mettre à jour l'état local
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'en_cours':
        return styles.statusEnCours;
      case 'pret':
        return styles.statusPret;
      case 'vendu':
        return styles.statusVendu;
      default:
        return {};
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'en_cours':
        return 'En cours';
      case 'pret':
        return 'Prêt';
      case 'vendu':
        return 'Vendu';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Commandes</Text>
      </View>

      <ScrollView style={styles.content}>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
              <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
                <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
              </View>
            </View>

            {order.items.map((item, index) => (
              <View key={index} style={styles.orderItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.nom}</Text>
                  <Text style={styles.itemQuantity}>×{item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  {(item.prix * item.quantity).toFixed(2)} €
                </Text>
              </View>
            ))}

            <View style={styles.orderFooter}>
              <Text style={styles.totalText}>Total: {order.total.toFixed(2)} €</Text>
              {order.status === 'en_cours' && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleStatusUpdate(order.id, 'pret')}
                >
                  <Text style={styles.actionButtonText}>Marquer prêt</Text>
                </TouchableOpacity>
              )}
              {order.status === 'pret' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonVendu]}
                  onPress={() => handleStatusUpdate(order.id, 'vendu')}
                >
                  <Text style={styles.actionButtonText}>Marquer vendu</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusEnCours: {
    backgroundColor: COLORS.secondary,
  },
  statusPret: {
    backgroundColor: '#2ecc71',
  },
  statusVendu: {
    backgroundColor: '#95a5a6',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemQuantity: {
    marginLeft: 8,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  orderFooter: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  actionButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonVendu: {
    backgroundColor: '#95a5a6',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OrderStats;
