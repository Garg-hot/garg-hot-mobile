import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
  StatusBar,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { platService } from '../services/PlatService';

const COLORS = {
  background: '#FFFAF0', // Fond crème pour un effet chaleureux
  primary: '#D2691E', // Marron clair pour rappeler la cuisson
  secondary: '#FF8C00', // Orange feu
  text: '#5A3E1B', // Marron foncé pour le texte
  textSecondary: '#A0522D', // Marron plus clair
  inputBackground: '#FFF5E1', // Beige clair pour les champs de saisie
};

interface Props {
  platId: string;
  onBack: () => void;
}

interface Ingredient {
  id: string;
  nom: string;
  quantite: number;
}

const PlatDetails: React.FC<Props> = ({ platId, onBack }) => {
  const [platNom, setPlatNom] = useState<string>('');
  const [prix, setPrix] = useState<string>('0');
  const [platImage, setPlatImage] = useState<string>('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [platDetails, setPlatDetails] = useState<{
    description: string;
    categorie: string;
    duration: string;
  }>({
    description: '',
    categorie: '',
    duration: ''
  });

  useEffect(() => {
    const loadPlatData = async () => {
      try {
        const plat = await platService.getPlatById(Number(platId));
        if (plat) {
          setPlatNom(plat.nom);
          setPrix(plat.prix.montant);
          setPlatImage(plat.image);
          setIngredients(plat.ingredients.map(ing => ({
            id: String(ing.id),
            nom: ing.nom,
            quantite: 1 // Par défaut si la quantité n'est pas spécifiée
          })));
          setPlatDetails({
            description: plat.description || 'Aucune description disponible',
            categorie: plat.categorie?.nom || 'Catégorie inconnue',
            duration: plat.duration ? `${plat.duration} min` : '30 min'
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement du plat:', error);
        Alert.alert('Erreur', 'Impossible de charger les détails du plat');
        setIsLoading(false);
      }
    };

    loadPlatData();
  }, [platId]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <>
            <Image
              source={{ uri: platImage }}
              style={styles.platImage}
              resizeMode="cover"
            />
            
            <View style={styles.contentContainer}>
              <Text style={styles.platName}>{platNom}</Text>
              <Text style={styles.price}>{prix} Ar</Text>
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={20} color={COLORS.text} />
                  <Text style={styles.detailText}>{platDetails.duration}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="restaurant-outline" size={20} color={COLORS.text} />
                  <Text style={styles.detailText}>{platDetails.categorie}</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{platDetails.description}</Text>

              <Text style={styles.sectionTitle}>Ingrédients</Text>
              <View style={styles.ingredientsContainer}>
                {ingredients.map((ingredient) => (
                  <View key={ingredient.id} style={styles.ingredientItem}>
                    <Ionicons name="leaf-outline" size={16} color={COLORS.text} />
                    <Text style={styles.ingredientText}>{ingredient.nom}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 250, 240, 0.8)',
  },
  platImage: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 250, 240, 0.95)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  platName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    textAlign: 'justify',
  },
  ingredientsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 15,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  ingredientText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.text,
  },
});

export default PlatDetails;
