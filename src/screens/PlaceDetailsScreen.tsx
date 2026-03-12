import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const PlaceDetailsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détails du Lieu</Text>
      <Text>Ici on mettra le calendrier plus tard !</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f8ff' },
  title: { fontSize: 24, fontWeight: 'bold' },
});