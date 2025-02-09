import { FIREBASE_DB } from '../../FirebaseCongig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export interface Commande {
    id: string;
    userId: string;
    plats: {
        platId: number;
        nom: string;
        quantite: number;
        prix: number;
    }[];
    total: number;
    status: 'en cours' | 'terminée' | 'annulée';
    dateCommande: Date;
}

export const ajouterCommande = async (userId: string, plats: Commande['plats']) => {
    try {
        const total = plats.reduce((sum, plat) => sum + (plat.prix * plat.quantite), 0);
        const nouvelleCommande: Omit<Commande, 'id'> = {
            userId,
            plats,
            total,
            status: 'en cours',
            dateCommande: new Date()
        };

        const docRef = await addDoc(collection(FIREBASE_DB, 'commandes'), nouvelleCommande);
        return { id: docRef.id, ...nouvelleCommande };
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la commande:', error);
        throw error;
    }
};

export const getCommandesUtilisateur = async (userId: string) => {
    try {
        const commandesRef = collection(FIREBASE_DB, 'commandes');
        const q = query(commandesRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dateCommande: doc.data().dateCommande.toDate()
        })) as Commande[];
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        throw error;
    }
};
