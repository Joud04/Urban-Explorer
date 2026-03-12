import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProfileScreen: React.FC = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadSavedPhoto();

    // L'animation infinie de pulsation (Pulse)
    const pulse = Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
    ]);
    Animated.loop(pulse).start();
  }, [scaleAnim]);

  const loadSavedPhoto = async () => {
    try {
      const savedPhoto = await AsyncStorage.getItem('@profile_photo');
      if (savedPhoto !== null) {
        setPhotoUri(savedPhoto);
      }
    } catch (error) {
      console.error("Erreur de chargement de la photo", error);
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission requise", "Vous devez autoriser l'accès à la caméra pour prendre un selfie.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setPhotoUri(uri);
        await AsyncStorage.setItem('@profile_photo', uri);
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue avec la caméra.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>

      <View style={styles.avatarContainer}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>📸</Text>
            <Text style={styles.placeholderSubText}>Pas de photo</Text>
          </View>
        )}
      </View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Prendre un Selfie</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f6fa' },
  title: { fontSize: 32, fontWeight: '900', color: '#2d3436', marginBottom: 50, letterSpacing: 1 },
  
  avatarContainer: { 
    marginBottom: 40, 
    shadowColor: '#e17055', // Ombre colorée !
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 15, 
    elevation: 10 
  },
  avatar: { 
    width: 180, 
    height: 180, 
    borderRadius: 90, 
    borderWidth: 4, 
    borderColor: '#fff' 
  },
  placeholder: { 
    width: 180, height: 180, borderRadius: 90, 
    backgroundColor: '#dfe6e9', 
    justifyContent: 'center', alignItems: 'center', 
    borderWidth: 4, borderColor: '#fff' 
  },
  placeholderText: { fontSize: 40, marginBottom: 5 },
  placeholderSubText: { color: '#636e72', fontWeight: 'bold', fontSize: 16 },
  
  button: { 
    backgroundColor: '#e17055', 
    paddingVertical: 16, 
    paddingHorizontal: 32, 
    borderRadius: 30, // Bouton très arrondi
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }
});