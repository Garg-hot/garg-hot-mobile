import { collection, addDoc, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../FirebaseCongig';

// Structure des données pour plat_ingredients
interface PlatIngredient {
    id_plat: string;
    id_ingredient: string;
    quantite: number;
}

// Données initiales pour plat_ingredients
const initialPlatIngredients: Omit<PlatIngredient, 'id'>[] = [
    {
        id_plat: "plat1", // Remplacez par l'ID réel de votre plat
        id_ingredient: "ingredient1", // Remplacez par l'ID réel de votre ingrédient
        quantite: 2
    },
    // Ajoutez d'autres relations plat-ingrédient ici
];

// Fonction pour initialiser la collection plat_ingredients
const initPlatIngredients = async () => {
    try {
        // Récupérer d'abord les plats existants
        const platsSnapshot = await getDocs(collection(FIREBASE_DB, 'plats'));
        const plats = platsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Récupérer les ingrédients existants
        const ingredientsSnapshot = await getDocs(collection(FIREBASE_DB, 'ingredients'));
        const ingredients = ingredientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Créer la collection plat_ingredients
        const platIngredientsRef = collection(FIREBASE_DB, 'plat_ingredients');

        // Pour chaque plat, ajouter quelques ingrédients
        for (const plat of plats) {
            // Sélectionner aléatoirement 2-3 ingrédients pour chaque plat
            const selectedIngredients = ingredients
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 2) + 2);

            // Ajouter les relations plat-ingrédient
            for (const ingredient of selectedIngredients) {
                const platIngredient = {
                    id_plat: plat.id,
                    id_ingredient: ingredient.id,
                    quantite: Math.floor(Math.random() * 5) + 1 // Quantité aléatoire entre 1 et 5
                };

                await addDoc(platIngredientsRef, platIngredient);
                console.log(`Ajouté: Plat ${plat.id} - Ingrédient ${ingredient.id}`);
            }
        }

        console.log('Initialisation de plat_ingredients terminée avec succès!');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de plat_ingredients:', error);
    }
};

// Exécuter l'initialisation
initPlatIngredients();
