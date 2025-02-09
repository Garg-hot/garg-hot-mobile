import React, { useEffect, useState } from 'react'; 
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseCongig';

const COLORS = {
  background: '#FFFAF0', // Fond crème pour un effet chaleureux
  primary: '#D2691E', // Marron clair pour rappeler la cuisson
  secondary: '#FF8C00', // Orange feu
  text: '#5A3E1B', // Marron foncé pour le texte
  textSecondary: '#A0522D', // Marron plus clair
  inputBackground: '#FFF5E1', // Beige clair pour les champs de saisie
};

interface CartItem {
  id: string;
  platId: string;
  nom: string;
  prix: number;
  quantity: number;
  image?: string;
}

interface Props {
  onBack: () => void;
}

const Cart: React.FC<Props> = ({ onBack }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    if (!user) return;

    try {
      const cartRef = collection(FIREBASE_DB, 'panier');
      const q = query(cartRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CartItem[];

      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart:', error);
      Alert.alert('Erreur', 'Impossible de charger le panier');
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await deleteDoc(doc(FIREBASE_DB, 'panier', itemId));
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      Alert.alert('Succès', 'Article retiré du panier');
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Erreur', 'Impossible de retirer l\'article');
    }
  };

  const updateQuantity = (itemId: string, increment: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + increment),
            }
          : item
      )
    );
  };

  const placeOrder = async () => {
    if (!user || cartItems.length === 0) return;

    try {
      const orderTotal = cartItems.reduce(
        (total, item) => total + item.prix * item.quantity,
        0
      );

      // Créer la commande
      const orderRef = collection(FIREBASE_DB, 'commandes');
      await addDoc(orderRef, {
        userId: user.uid,
        items: cartItems.map(item => ({
          platId: item.platId,
          nom: item.nom,
          prix: item.prix,
          quantity: item.quantity
        })),
        total: orderTotal,
        status: 'en_cours',
        date: new Date().toISOString()
      });

      // Vider le panier
      for (const item of cartItems) {
        await deleteDoc(doc(FIREBASE_DB, 'panier', item.id));
      }

      setCartItems([]);
      Alert.alert('Succès', 'Commande passée avec succès');
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Erreur', 'Impossible de passer la commande');
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.prix * item.quantity, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Panier</Text>
      </View>

      <ScrollView style={styles.content}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <View style={styles.imageContainer}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>🍽️</Text>
                </View>
              )}
            </View>

            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.nom}</Text>
              <Text style={styles.itemPrice}>{item.prix.toFixed(2)} €</Text>

              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, -1)}
                  style={[styles.quantityButton, item.quantity === 1 && styles.quantityButtonDisabled]}
                  disabled={item.quantity === 1}
                >
                  <Text style={[styles.quantityButtonText, item.quantity === 1 && styles.quantityButtonTextDisabled]}>-</Text>
                </TouchableOpacity>
                
                <View style={styles.quantityValue}>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, 1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.id)}
              >
                <Text style={styles.removeButtonText}>Retirer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {cartItems.length > 0 ? (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPrice}>{getTotal().toFixed(2)} €</Text>
          </View>

          <TouchableOpacity
            style={styles.orderButton}
            onPress={placeOrder}
          >
            <Text style={styles.orderButtonText}>
              Commander • {getTotal().toFixed(2)} €
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>Votre panier est vide</Text>
        </View>
      )}
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
    padding: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.primary, // Marron clair
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 15,
    color: COLORS.text, // Marron foncé
  },
  content: {
    flex: 1,
    padding: 15,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.inputBackground, // Beige clair
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    fontSize: 32,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: COLORS.text, // Marron foncé
  },
  itemPrice: {
    fontSize: 16,
    color: COLORS.primary, // Marron clair
    fontWeight: '600',
    marginBottom: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary, // Orange feu
    borderRadius: 15,
  },
  quantityButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  quantityButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  quantityButtonTextDisabled: {
    color: '#999',
  },
  quantityValue: {
    width: 40,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#d32f2f', // Red for remove button
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    color: COLORS.text, // Marron foncé
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary, // Marron clair
  },
  orderButton: {
    backgroundColor: COLORS.primary, // Orange feu
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  orderButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyCart: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyCartText: {
    fontSize: 18,
    color: COLORS.textSecondary, // Marron plus clair
  },
});

export default Cart;
