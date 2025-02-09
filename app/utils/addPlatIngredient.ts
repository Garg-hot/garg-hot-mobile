import { collection, addDoc, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseCongig';

// Fonction pour ajouter une relation plat-ingrédient
export const ajouterPlatIngredient = async (idPlat: string, idIngredient: string, quantite: number) => {
    try {
        const docRef = await addDoc(collection(FIREBASE_DB, 'plat_ingredients'), {
            id_plat: idPlat,
            id_ingredient: idIngredient,
            quantite: quantite
        });
        console.log('Relation plat-ingrédient ajoutée avec succès');
        return docRef.id;
    } catch (error) {
        console.error('Erreur lors de l\'ajout:', error);
        throw error;
    }
};

// Fonction pour obtenir les IDs des plats
export const getPlatsIds = async () => {
    const platsSnapshot = await getDocs(collection(FIREBASE_DB, 'plats'));
    return platsSnapshot.docs.map(doc => ({
        id: doc.id,
        nom: doc.data().nom
    }));
};

// Fonction pour obtenir les IDs des ingrédients
export const getIngredientsIds = async () => {
    const ingredientsSnapshot = await getDocs(collection(FIREBASE_DB, 'ingredients'));
    return ingredientsSnapshot.docs.map(doc => ({
        id: doc.id,
        nom: doc.data().nom
    }));
};
