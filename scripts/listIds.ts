import { FIREBASE_DB } from '../FirebaseCongig';
import { collection, getDocs } from 'firebase/firestore';

async function listerIds() {
    try {
        // Lister les plats
        console.log('Liste des Plats:');
        console.log('---------------');
        const platsSnapshot = await getDocs(collection(FIREBASE_DB, 'plats'));
        platsSnapshot.forEach(doc => {
            console.log(`ID: ${doc.id}, Nom: ${doc.data().nom}`);
        });

        console.log('\nListe des Ingrédients:');
        console.log('--------------------');
        const ingredientsSnapshot = await getDocs(collection(FIREBASE_DB, 'ingredients'));
        ingredientsSnapshot.forEach(doc => {
            console.log(`ID: ${doc.id}, Nom: ${doc.data().nom}`);
        });

    } catch (error) {
        console.error('Erreur:', error);
    }
}

listerIds();
