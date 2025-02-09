import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../FirebaseCongig';

// Initialiser Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

// Fonction pour obtenir les IDs des plats
async function getPlatsIds() {
  try {
    const platsRef = collection(db, 'plats');
    const querySnapshot = await getDocs(platsRef);
    
    querySnapshot.forEach((doc) => {
      console.log('ID du plat:', doc.id, 'Nom:', doc.data().nom);
    });
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Exécuter la fonction
getPlatsIds();
