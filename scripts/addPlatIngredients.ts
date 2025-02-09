import { FIREBASE_DB } from '../FirebaseCongig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const ajouterPlatIngredient = async () => {
    try {
        // 1. Récupérer le premier plat
        const platsSnapshot = await getDocs(collection(FIREBASE_DB, 'plats'));
        const premierPlat = platsSnapshot.docs[0];

        // 2. Récupérer le premier ingrédient
        const ingredientsSnapshot = await getDocs(collection(FIREBASE_DB, 'ingredients'));
        const premierIngredient = ingredientsSnapshot.docs[0];

        if (!premierPlat || !premierIngredient) {
            console.error('Pas de plats ou d\'ingrédients trouvés');
            return;
        }

        // 3. Créer la relation
        const platIngredientRef = await addDoc(collection(FIREBASE_DB, 'plat_ingredients'), {
            id_plat: premierPlat.id,
            id_ingredient: premierIngredient.id,
            quantite: 2
        });

        console.log('Relation créée avec succès!');
        console.log('ID du plat:', premierPlat.id);
        console.log('Nom du plat:', premierPlat.data().nom);
        console.log('ID de l\'ingrédient:', premierIngredient.id);
        console.log('Nom de l\'ingrédient:', premierIngredient.data().nom);
    } catch (error) {
        console.error('Erreur:', error);
    }
};

// Exécuter la fonction
ajouterPlatIngredient();
