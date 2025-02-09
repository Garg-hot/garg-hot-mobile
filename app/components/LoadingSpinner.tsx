import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Chargement...' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.spinner} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#42b983',
    borderTopColor: 'transparent',
    animation: 'spin 1s linear infinite',
  },
  text: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
});

export default LoadingSpinner;
