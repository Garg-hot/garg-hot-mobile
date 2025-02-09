import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export interface PlatIngredient {
    id_plat: string;
    id_ingredient: string;
    quantite: number;
}

const COLLECTION_NAME = 'plat_ingredients';

export const addPlatIngredient = async (platIngredient: Omit<PlatIngredient, 'id'>) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), platIngredient);
        return docRef.id;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du plat_ingredient:', error);
        throw error;
    }
};

export const getPlatIngredients = async (platId: string) => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('id_plat', '==', platId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erreur lors de la récupération des ingrédients du plat:', error);
        throw error;
    }
};

export const updatePlatIngredient = async (id: string, updates: Partial<PlatIngredient>) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, updates);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du plat_ingredient:', error);
        throw error;
    }
};

export const deletePlatIngredient = async (id: string) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Erreur lors de la suppression du plat_ingredient:', error);
        throw error;
    }
};
