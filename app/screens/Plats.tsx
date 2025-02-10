import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseCongig';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { categorieService, Categorie } from '../services/categorieService';
import { platService, Plat } from '../services/PlatService';
import CommandeService, { CommandeRequest, PlatCommande } from '../services/CommandeService';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartStorage = {
  async addItem(userId: string, item: any) {
    const cartKey = `cart-${userId}`;
    const storedCart = await AsyncStorage.getItem(cartKey);
    const cart = storedCart ? JSON.parse(storedCart) : [];

    const existingItem = cart.find((i: any) => i.platId === item.platId);
    if (existingItem) {
      throw new Error('Item already in cart');
    }

    cart.push(item);
    await AsyncStorage.setItem(cartKey, JSON.stringify(cart));
  },
};

const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - 60) / 2;

const COLORS = {
  background: '#FFFAF0',
  primary: '#D2691E',
  secondary: '#FF8C00',
  text: '#5A3E1B',
  textSecondary: '#A0522D',
  inputBackground: '#FFF5E1',
};

interface Props {
  onPlatSelect: (plat: Plat) => void;
  onCartPress: () => void;
  onStatsPress: () => void;
}

const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
};

const Plats: React.FC<Props> = ({ onPlatSelect, onCartPress, onStatsPress }) => {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [selectedCategorie, setSelectedCategorie] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [currentCommande, setCurrentCommande] = useState<CommandeRequest | null>(null);
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([loadPlats(), loadCategories()]);
      } catch (error) {
        console.error('Erreur de chargement:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const loadPlats = async () => {
    try {
      setLoading(true);
      const platsData = await platService.getAllPlats();
      setPlats(platsData);
    } catch (error) {
      console.error('Erreur lors du chargement des plats:', error);
      Alert.alert('Erreur', 'Impossible de charger les plats');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const categoriesData = await categorieService.getAllCategories();
      if (categoriesData.length > 0) {
        setCategories([{ id: -1, nom: 'Tous' }, ...categoriesData]);
      } else {
        setCategories([{ id: -1, nom: 'Tous' }]);
      }
    } catch (error) {
      setCategories([{ id: -1, nom: 'Tous' }]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Erreur', 'Impossible de se déconnecter');
    }
  };

  const addToCart = async (plat: Plat, event: any) => {
    event.stopPropagation();
    
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour ajouter au panier');
      return;
    }

    try {
      await CartStorage.addItem(user.uid, {
        id: generateId(),
        platId: plat.id,
        nom: plat.nom,
        prix: parseFloat(plat.prix), 
        quantity: 1,
        image: plat.image
      });

      Alert.alert('Succès', 'Plat ajouté au panier');
    } catch (error) {
      if (error instanceof Error && error.message === 'Item already in cart') {
        Alert.alert('Info', 'Ce plat est déjà dans votre panier');
      } else {
        console.error('Erreur d\'ajout au panier:', error);
        Alert.alert('Erreur', 'Impossible d\'ajouter au panier');
      }
    }
  };

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const filteredPlats = plats.filter(plat => {
    const normalizedSearch = normalizeText(searchQuery);
    const normalizedName = normalizeText(plat.nom);
    const matchesSearch = normalizedName.includes(normalizedSearch);
    const matchesCategorie = selectedCategorie === null || 
                           selectedCategorie === -1 || 
                           plat.categorie?.id === selectedCategorie;
    return matchesSearch && matchesCategorie;
  });

  const renderPlat = ({ item }: { item: Plat }) => (
    <TouchableOpacity
      onPress={() => onPlatSelect(item)}
      style={styles.platItem}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.platImage}
        resizeMode="cover"
      />
      <View style={styles.platInfo}>
        <Text style={styles.platName}>{item.nom}</Text>
        <Text style={styles.platPrice}>
          {item.prix ? `${item.prix} Ar` : 'Prix non disponible'}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={(e) => addToCart(item, e)}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Noana?</Text>
          <Text style={styles.subtitle}>Order & Eat.</Text>
        </View>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un plat..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={onStatsPress} style={styles.iconButton}>
              <Ionicons name="stats-chart" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onCartPress} style={styles.iconButton}>
              <Ionicons name="cart" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Affichage des catégories */}
      <View style={styles.categoriesContainer}>
        {loadingCategories ? (
          <ActivityIndicator size="small" color={COLORS.primary} style={styles.categoryLoader} />
        ) : (
          <FlatList
            horizontal
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.categoryItem,
                  (selectedCategorie === item.id || (item.id === -1 && selectedCategorie === null)) && 
                  styles.categoryItemSelected
                ]}
                onPress={() => setSelectedCategorie(item.id === -1 ? null : item.id)}
              >
                <Text style={[
                  styles.categoryText,
                  (selectedCategorie === item.id || (item.id === -1 && selectedCategorie === null)) && 
                  styles.categoryTextSelected
                ]}>
                  {item.nom}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        )}
      </View>

      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Nos Plats</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          key="grid"
          data={filteredPlats}
          renderItem={renderPlat}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.platsList}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 24,
    color: COLORS.text,
    marginTop: 5,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: COLORS.background,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: COLORS.text,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  categoryLoader: {
    padding: 10,
  },
  categoriesList: {
    paddingVertical: 5,
  },
  categoryItem: {
    backgroundColor: COLORS.inputBackground,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  categoryItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.text,
  },
  categoryTextSelected: {
    color: '#fff',
  },
  sectionTitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  platsList: {
    padding: 15,
  },
  row: {
    justifyContent: 'space-between',
  },
  platItem: {
    width: cardWidth,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  platImage: {
    width: '100%',
    height: cardWidth,
    backgroundColor: COLORS.background,
  },
  platInfo: {
    padding: 12,
  },
  platName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: COLORS.text,
  },
  platPrice: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  addButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});

export default Plats;