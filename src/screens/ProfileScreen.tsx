import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProfileScreen: React.FC = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // 👉 1. AU CHARGEMENT : On va chercher la photo sauvegardée
  useEffect(() => {
    loadSavedPhoto();
  }, []);

  const loadSavedPhoto = async () => {
    try {
      const savedPhoto = await AsyncStorage.getItem('@profile_photo');
      if (savedPhoto !== null) {
        setPhotoUri(savedPhoto); // On remet la photo à l'écran !
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

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setPhotoUri(uri);
        
        // 👉 2. A LA CAPTURE : On sauvegarde le lien de la nouvelle photo
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
            <Text style={styles.placeholderText}>Pas de photo</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Prendre un Selfie 📸</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 40 },
  avatarContainer: { marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 8 },
  avatar: { width: 150, height: 150, borderRadius: 75, borderWidth: 3, borderColor: '#e67e22' },
  placeholder: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#bdc3c7', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#95a5a6' },
  placeholderText: { color: '#fff', fontWeight: 'bold' },
  button: { backgroundColor: '#e67e22', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});