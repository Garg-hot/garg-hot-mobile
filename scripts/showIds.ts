import { FIREBASE_DB } from '../FirebaseCongig';
import { collection, getDocs } from 'firebase/firestore';

const showIds = async () => {
    try {
        console.log('=== PLATS ===');
        const platsSnapshot = await getDocs(collection(FIREBASE_DB, 'plats'));
        platsSnapshot.forEach(doc => {
            console.log(`ID: ${doc.id} - Nom: ${doc.data().nom}`);
        });

        console.log('\n=== INGREDIENTS ===');
        const ingredientsSnapshot = await getDocs(collection(FIREBASE_DB, 'ingredients'));
        ingredientsSnapshot.forEach(doc => {
            console.log(`ID: ${doc.id} - Nom: ${doc.data().nom}`);
        });
    } catch (error) {
        console.error('Erreur:', error);
    }
};

showIds();
