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
  Image,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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
  onBack: () => void;
  onRegisterSuccess: () => void;
}

const Register: React.FC<Props> = ({ onBack, onRegisterSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      onRegisterSuccess(); // Cela va rediriger vers l'écran Plats via App.tsx
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'Une erreur est survenue lors de l\'inscription';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Cette adresse email est déjà utilisée';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Adresse email invalide';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Opération non autorisée';
          break;
        case 'auth/weak-password':
          errorMessage = 'Le mot de passe est trop faible';
          break;
      }
      
      Alert.alert('Erreur', errorMessage);
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
        <Image
            source={require('../../sary/icon.png')} // Remplacez par le chemin de votre logo
            style={styles.logo}
            resizeMode="contain"
          />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Midira{'\n'}Fa mbola tsy noana Ve ?</Text>
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

          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            placeholderTextColor={COLORS.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginLink}
            onPress={onBack}
          >
            <Text style={styles.loginText}>Déjà inscrit ? Connectez-vous</Text>
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
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 38,
  },
  signUpText: {
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
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textDecorationLine: 'underline',
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
  logo: {
    position: 'absolute', // Position absolue pour placer le logo
    top: 10, // Ajustez la position verticale
    left: 10, // Ajustez la position horizontale
    width: 150, // Ajustez la largeur du logo
    height: 100, // Ajustez la hauteur du logo
  },
});

export default Register;
