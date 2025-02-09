// Importations (inchangées)
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseCongig';
import LoadingPage from './app/screens/LoadingPage'; // Import correct
import Welcome from './app/screens/Welcome';
import Login from './app/screens/Login';
import Register from './app/screens/Register';
import Plats from './app/screens/Plats';
import Cart from './app/screens/Cart';
import PlatDetails from './app/screens/PlatDetails';
import OrderStats from './app/screens/OrderStats';

type Screen = 'welcome' | 'login' | 'register' | 'plats' | 'cart' | 'platDetails' | 'orderStats';

interface SelectedPlat {
  id: string;
  nom: string;
  prix: number;
  image: string | null;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedPlat, setSelectedPlat] = useState<SelectedPlat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const forceLogout = async () => {
      try {
        await signOut(FIREBASE_AUTH);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };
    forceLogout();

    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setIsAuthenticated(!!user);
      setLoading(false); // Arrête le chargement après vérification
      if (!user) {
        setCurrentScreen('welcome');
      } else {
        setCurrentScreen('plats');
      }
    });

    return unsubscribe;
  }, []);

  // Fonction appelée lorsque le chargement est terminé
  const handleLoadingFinish = () => {
    setLoading(false);
  };

  // Afficher la page de chargement
  if (loading) {
    return <LoadingPage onFinish={handleLoadingFinish} />;
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        {currentScreen === 'welcome' ? (
          <Welcome onGetStarted={() => setCurrentScreen('login')} />
        ) : currentScreen === 'register' ? (
          <Register
            onBack={() => setCurrentScreen('login')}
            onRegisterSuccess={() => {
              setCurrentScreen('plats');
            }}
          />
        ) : (
          <Login
            onRegisterPress={() => setCurrentScreen('register')}
            onLoginSuccess={() => {
              setCurrentScreen('plats');
            }}
            onBackToWelcome={() => setCurrentScreen('welcome')}
          />
        )}
      </View>
    );
  }

  const handlePlatSelect = (plat: SelectedPlat) => {
    setSelectedPlat(plat);
    setCurrentScreen('platDetails');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {currentScreen === 'plats' && (
        <Plats
          onPlatSelect={handlePlatSelect}
          onCartPress={() => setCurrentScreen('cart')}
          onStatsPress={() => setCurrentScreen('orderStats')}
        />
      )}
      {currentScreen === 'cart' && (
        <Cart
          onBack={() => setCurrentScreen('plats')}
        />
      )}
      {currentScreen === 'platDetails' && selectedPlat && (
        <PlatDetails
          platId={selectedPlat.id}
          platNom={selectedPlat.nom}
          prix={selectedPlat.prix}
          onBack={() => setCurrentScreen('plats')}
        />
      )}
      {currentScreen === 'orderStats' && (
        <OrderStats
          onBack={() => setCurrentScreen('plats')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight || 0,
  },
});