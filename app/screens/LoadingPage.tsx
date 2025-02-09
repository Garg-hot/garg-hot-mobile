import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const LoadingPage: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish(); // Appelle la fonction pour signaler la fin du chargement
        }, 3000); // 3000 ms = 3 secondes

        return () => clearTimeout(timer); // Nettoyage du timer
    }, [onFinish]);

    return (
        <View style={styles.container}>
            <Image source={require('../../sary/Feu.png')} style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFAF0',
    },
    image: {
        width: 300, // Ajustez la taille selon vos besoins
        height: 200,
        resizeMode: 'contain',
    },
});

export default LoadingPage;