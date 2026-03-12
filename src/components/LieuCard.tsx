import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LieuCulturel } from '../types';

interface LieuCardProps {
  lieu: LieuCulturel;
  onPressDetails: () => void; // Fonction déclenchée quand on clique sur "Voir plus"
}

export const LieuCard: React.FC<LieuCardProps> = ({ lieu, onPressDetails }) => {
  return (
    <View style={styles.card}>
      {/* L'image aléatoire demandée par le sujet */}
      <Image 
        source={{ uri: 'https://picsum.photos/200' }} 
        style={styles.image} 
      />
      
      <View style={styles.infoContainer}>
        {/* Le titre et l'adresse */}
        <Text style={styles.title} numberOfLines={2}>{lieu.nom_usuel}</Text>
        <Text style={styles.address} numberOfLines={2}>{lieu.adresse}</Text>
        
        {/* Le bouton "Voir plus" */}
        <TouchableOpacity style={styles.button} onPress={onPressDetails}>
          <Text style={styles.buttonText}>Voir plus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Ombre sur Android
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2c3e50',
  },
  address: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#e67e22',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});