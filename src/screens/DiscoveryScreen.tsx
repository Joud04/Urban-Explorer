import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export const DiscoveryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Écran Découverte</Text>
      <Text>Liste des lieux culturels à venir...</Text>
      {/* Bouton pour tester le Bonus du Stack Navigator */}
      <Button 
        title="Aller aux détails (Bonus)" 
        onPress={() => navigation.navigate('PlaceDetails')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});