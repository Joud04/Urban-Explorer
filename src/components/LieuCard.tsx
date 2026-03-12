import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { LieuCulturel } from '../types';

interface LieuCardProps {
  lieu: LieuCulturel;
  onPressDetails: () => void;
  distanceText?: string;
}

export const LieuCard: React.FC<LieuCardProps> = ({ lieu, onPressDetails, distanceText }) => {
  // L'animation de fondu au montage
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <Image
        source={{ uri: 'https://picsum.photos/400' }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {lieu.nom_usuel}
        </Text>

        <Text style={styles.address} numberOfLines={2}>
          📍 {lieu.adresse}
        </Text>

        {distanceText && (
          <Text style={styles.distance}>
            🚶 {distanceText}
          </Text>
        )}

        <TouchableOpacity style={styles.button} onPress={onPressDetails}>
          <Text style={styles.buttonText}>Voir les détails</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 20, // Plus de rondeur
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 }, // Ombre plus douce
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6
  },
  image: {
    width: "100%",
    height: 160
  },
  content: {
    padding: 18
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2d3436",
    marginBottom: 8
  },
  address: {
    fontSize: 14,
    color: "#636e72",
    marginBottom: 8,
    lineHeight: 20
  },
  distance: {
    fontSize: 14,
    color: "#e17055",
    fontWeight: "700",
    marginBottom: 12
  },
  button: {
    backgroundColor: "#e17055", // Une couleur plus chaleureuse
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    textTransform: 'uppercase', // Look plus moderne
    letterSpacing: 0.5
  }
});