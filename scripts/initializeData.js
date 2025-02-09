import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../FirebaseCongig';

// Initialiser Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

// Données d'exemple pour les ingrédients
const ingredients = [
  {
    platId: "ID_DE_VOTRE_PLAT", // Remplacez par l'ID réel du plat
    nom: "Tomate",
    quantite: 2,
    unite: "pièces"
  },
  {
    platId: "ID_DE_VOTRE_PLAT", // Remplacez par l'ID réel du plat
    nom: "Oignon",
    quantite: 1,
    unite: "pièce"
  },
  {
    platId: "ID_DE_VOTRE_PLAT", // Remplacez par l'ID réel du plat
    nom: "Huile d'olive",
    quantite: 2,
    unite: "cuillères à soupe"
  }
];

// Fonction pour ajouter les ingrédients
async function addIngredients() {
  try {
    for (const ingredient of ingredients) {
      await addDoc(collection(db, 'plat_ingredients'), ingredient);
      console.log('Ingrédient ajouté:', ingredient.nom);
    }
    console.log('Tous les ingrédients ont été ajoutés avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'ajout des ingrédients:', error);
  }
}

// Exécuter la fonction
addIngredients();
