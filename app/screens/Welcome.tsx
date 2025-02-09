import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Image,
  ImageBackground,
} from 'react-native';

const COLORS = {
  background: '#FFFAF0', // Fond crème pour un effet chaleureux
  primary: '#D2691E', // Marron clair pour rappeler la cuisson
  secondary: '#FF8C00', // Orange feu
  text: '#5A3E1B', // Marron foncé pour le texte
  textSecondary: '#A0522D', // Marron plus clair
  inputBackground: '#FFF5E1', // Beige clair pour les champs de saisie
};

interface Props {
  onGetStarted: () => void;
}

const Welcome: React.FC<Props> = ({ onGetStarted }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 10,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [translateY, rotate]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <Animated.View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../sary/fond.jpg')} // Replace with your background image path
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.2 }} // Reduce the opacity of the background image
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.darkOrange} />
          <View style={styles.content}>
            <Animated.Image
              source={require('../../sary/Feu.png')}
              style={[
                styles.image,
                {
                  transform: [
                    { translateY },
                    { rotate: rotateInterpolate },
                  ],
                },
              ]}
              resizeMode="contain"
            />
            <Image
              source={require('../../sary/Asset 1.png')}
              style={styles.titleImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={onGetStarted}
            >
              <Text style={styles.buttonText}>Commencer</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </Animated.View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 40,
  },
  titleImage: {
    width: 200,
    height: 100,
    marginBottom: 50,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    elevation: 3,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Welcome;
