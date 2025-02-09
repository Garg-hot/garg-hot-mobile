import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string;
  platId: string;
  nom: string;
  prix: number;
  quantity: number;
  image?: string;
}

const CART_STORAGE_KEY = 'cart_items';

export const CartStorage = {
  async getItems(userId: string): Promise<CartItem[]> {
    try {
      const key = `${CART_STORAGE_KEY}_${userId}`;
      const items = await AsyncStorage.getItem(key);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  },

  async addItem(userId: string, item: CartItem): Promise<void> {
    try {
      const key = `${CART_STORAGE_KEY}_${userId}`;
      const currentItems = await this.getItems(userId);
      
      // Vérifier si l'item existe déjà
      const exists = currentItems.some(i => i.platId === item.platId);
      if (exists) {
        throw new Error('Item already in cart');
      }

      const newItems = [...currentItems, item];
      await AsyncStorage.setItem(key, JSON.stringify(newItems));
    } catch (error) {
      console.error('Error adding cart item:', error);
      throw error;
    }
  },

  async removeItem(userId: string, itemId: string): Promise<void> {
    try {
      const key = `${CART_STORAGE_KEY}_${userId}`;
      const currentItems = await this.getItems(userId);
      const newItems = currentItems.filter(item => item.id !== itemId);
      await AsyncStorage.setItem(key, JSON.stringify(newItems));
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  },

  async updateItemQuantity(userId: string, itemId: string, quantity: number): Promise<void> {
    try {
      const key = `${CART_STORAGE_KEY}_${userId}`;
      const currentItems = await this.getItems(userId);
      const newItems = currentItems.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      await AsyncStorage.setItem(key, JSON.stringify(newItems));
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  async clearCart(userId: string): Promise<void> {
    try {
      const key = `${CART_STORAGE_KEY}_${userId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};
