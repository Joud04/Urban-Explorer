import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LieuCulturel } from '../types';

interface LieuCardProps {
  lieu: LieuCulturel;
  onPressDetails: () => void;
  distanceText?: string;
}

export const LieuCard: React.FC<LieuCardProps> = ({ lieu, onPressDetails, distanceText }) => {
  return (
    <View style={styles.card}>

      <Image
        source={{ uri: 'https://picsum.photos/400' }}
        style={styles.image}
      />

      <View style={styles.content}>

        <Text style={styles.title}>
          {lieu.nom_usuel}
        </Text>

        <Text style={styles.address}>
          📍 {lieu.adresse}
        </Text>

        {distanceText && (
          <Text style={styles.distance}>
            🚶 {distanceText}
          </Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={onPressDetails}
        >
          <Text style={styles.buttonText}>
            Voir les détails
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 16,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    elevation: 5
  },

  image: {
    width: "100%",
    height: 160
  },

  content: {
    padding: 16
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 6
  },

  address: {
    fontSize: 13,
    color: "#7f8c8d",
    marginBottom: 6
  },

  distance: {
    fontSize: 13,
    color: "#e67e22",
    fontWeight: "600",
    marginBottom: 12
  },

  button: {
    backgroundColor: "#e67e22",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }

});