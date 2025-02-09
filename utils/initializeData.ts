import { collection, addDoc, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../FirebaseCongig';

// Données des ingrédients
const ingredients = [
  { id: 1, nom: 'Tomate' },
  { id: 2, nom: 'Fromage' },
  { id: 3, nom: 'Poulet' },
  { id: 4, nom: 'Pâte' }
];

// Données des plats
const plats = [
  { 
    id: 1,
    nom: 'Pizza Margherita',
    tps_cuisson: 15,
    prix: 10.5,
    ingredients: [
      { id_ingredient: 1, quantite: 2 }, // 2 Tomates
      { id_ingredient: 2, quantite: 1 }  // 1 Fromage
    ]
  },
  {
    id: 2,
    nom: 'Poulet Rôti',
    tps_cuisson: 45,
    prix: 12.0,
    ingredients: [
      { id_ingredient: 3, quantite: 3 }  // 3 Poulets
    ]
  },
  {
    id: 3,
    nom: 'Lasagne',
    tps_cuisson: 30,
    prix: 9.5,
    ingredients: [
      { id_ingredient: 4, quantite: 1 }, // 1 Pâte
      { id_ingredient: 1, quantite: 1 }  // 1 Tomate
    ]
  }
];

const checkIfDataExists = async () => {
  const platsRef = collection(FIREBASE_DB, 'plats');
  const platsSnapshot = await getDocs(platsRef);
  return !platsSnapshot.empty;
};

export const initializeDatabase = async () => {
  try {
    console.log('Vérification de l\'existence des données...');
    const dataExists = await checkIfDataExists();
    
    if (dataExists) {
      console.log('Les données existent déjà dans Firestore');
      return;
    }

    console.log('Début de l\'initialisation de la base de données...');

    // Initialiser les ingrédients
    console.log('Initialisation des ingrédients...');
    const ingredientsRef = collection(FIREBASE_DB, 'ingredients');
    for (const ingredient of ingredients) {
      await setDoc(doc(ingredientsRef, ingredient.id.toString()), {
        nom: ingredient.nom
      });
      console.log(`Ingrédient ajouté: ${ingredient.nom}`);
    }

    // Initialiser les plats
    console.log('Initialisation des plats...');
    const platsRef = collection(FIREBASE_DB, 'plats');
    for (const plat of plats) {
      await setDoc(doc(platsRef, plat.id.toString()), {
        nom: plat.nom,
        tps_cuisson: plat.tps_cuisson,
        prix: plat.prix
      });
      console.log(`Plat ajouté: ${plat.nom}`);

      // Créer une sous-collection pour les ingrédients de chaque plat
      const platIngredientsRef = collection(FIREBASE_DB, `plats/${plat.id}/ingredients`);
      for (const ingredient of plat.ingredients) {
        await addDoc(platIngredientsRef, {
          id_ingredient: ingredient.id_ingredient,
          quantite: ingredient.quantite
        });
      }
    }

    console.log('Base de données initialisée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error; // Propager l'erreur pour la gérer dans App.tsx
  }
};
