import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../FirebaseCongig';
import { Plat, CartItem } from './types';

// Service partagé pour les opérations Firebase
export const FirebaseService = {
  // Plats
  async getPlats(): Promise<Plat[]> {
    const platsRef = collection(FIREBASE_DB, 'plats');
    const snapshot = await getDocs(platsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Plat));
  },

  // Panier
  async saveCartItem(userId: string, item: CartItem) {
    const cartRef = collection(FIREBASE_DB, `users/${userId}/cart`);
    return addDoc(cartRef, item);
  },

  async updateCartItem(userId: string, itemId: string, updates: Partial<CartItem>) {
    const itemRef = doc(FIREBASE_DB, `users/${userId}/cart/${itemId}`);
    return updateDoc(itemRef, updates);
  },

  async removeCartItem(userId: string, itemId: string) {
    const itemRef = doc(FIREBASE_DB, `users/${userId}/cart/${itemId}`);
    return deleteDoc(itemRef);
  }
}
