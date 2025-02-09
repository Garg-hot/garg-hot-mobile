import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar,
  ImageBackground,
  Image, // Importez le composant Image pour afficher le logo
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseCongig';

const COLORS = {
  background: '#FFFAF0', // Fond crème pour un effet chaleureux
  primary: '#D2691E', // Marron clair pour rappeler la cuisson
  secondary: '#FF8C00', // Orange feu
  text: '#5A3E1B', // Marron foncé pour le texte
  textSecondary: '#A0522D', // Marron plus clair
  inputBackground: '#FFF5E1', // Beige clair pour les champs de saisie
};

interface Props {
  onRegisterPress: () => void;
  onLoginSuccess: () => void;
  onBackToWelcome: () => void;
}

const Login: React.FC<Props> = ({ onRegisterPress, onLoginSuccess, onBackToWelcome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful:", response.user.uid);
      onLoginSuccess();
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      let errorMessage = 'Une erreur est survenue lors de la connexion';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Adresse email invalide';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Ce compte a été désactivé';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Aucun compte trouvé avec cette adresse email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mot de passe incorrect';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Email ou mot de passe incorrect';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives de connexion. Veuillez réessayer plus tard.';
          break;
      }
      
      Alert.alert('Erreur', errorMessage);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../sary/fond.jpg')} // Remplacez par le chemin de votre image de fond
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.2 }} // Diminuez l'opacité de l'image de fond
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          {/* Logo en haut à gauche */}
          <Image
            source={require('../../sary/icon.png')} // Remplacez par le chemin de votre logo
            style={styles.logo}
            resizeMode="contain"
          />

          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBackToWelcome}
          >
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>
              {"Andao"}{"\n"}{"Hikaly e!"}
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor={COLORS.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
            
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.registerLink}
              onPress={onRegisterPress}
            >
              <Text style={styles.registerText}>Pas de compte? Inscrivez-vous</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute', // Position absolue pour placer le logo
    top: 10, // Ajustez la position verticale
    left: 10, // Ajustez la position horizontale
    width: 150, // Ajustez la largeur du logo
    height: 100, // Ajustez la hauteur du logo
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 38,
  },
  signInText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: COLORS.text,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 3,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    alignItems: 'center',
    borderRadius: 3,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
    left: 270,
    top: 20,
  },
});

export default Login;