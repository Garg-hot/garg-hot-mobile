/**
 * Configuration Firebase pour l'application
 * Contient les clés et paramètres nécessaires pour l'initialisation de Firebase
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Configuration Firebase
 * Remplacez ces valeurs par vos propres clés de configuration Firebase
 * @see https://firebase.google.com/docs/web/setup
 */
const firebaseConfig = {
  apiKey: "AIzaSyDU9C3qhe0oDmBaXgOrgdJh1KYhKFXUpwk",
  authDomain: "fir-tuto-88228.firebaseapp.com",
  projectId: "fir-tuto-88228",
  storageBucket: "fir-tuto-88228.firebasestorage.app",
  messagingSenderId: "719226226986",
  appId: "1:719226226986:web:ddaa9825aa4504cf807653"
};

// Initialisation de l'application Firebase
console.log('Initialisation de Firebase...');
const FIREBASE_APP = initializeApp(firebaseConfig);

/**
 * Instance d'authentification Firebase
 * Utilisée pour toutes les opérations d'authentification (connexion, inscription, etc.)
 */
console.log('Initialisation de Firebase Auth...');
export const FIREBASE_AUTH = Platform.select({
  web: () => {
    const auth = getAuth(FIREBASE_APP);
    setPersistence(auth, browserLocalPersistence);
    return auth;
  },
  default: () => initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  })
})();

/**
 * Instance Firestore
 * Utilisée pour toutes les opérations de base de données
 */
console.log('Initialisation de Firestore...');
export const FIREBASE_DB = getFirestore(FIREBASE_APP);