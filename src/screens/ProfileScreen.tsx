import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const ProfileScreen: React.FC = () => {
  // 1. Le State pour stocker le lien (URI) de la photo prise
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // 2. La fonction qui gère les permissions et la capture
  const takePhoto = async () => {
    try {
      // ÉTAPE A : Demander la permission à l'utilisateur
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("Permission requise", "Vous devez autoriser l'accès à la caméra pour prendre un selfie.");
        return;
      }

      // ÉTAPE B : Ouvrir l'appareil photo du téléphone
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true, // Permet de recadrer la photo
        aspect: [1, 1],      // Force un recadrage carré (parfait pour un avatar)
        quality: 0.5,        // Compresse un peu l'image pour ne pas surcharger la mémoire
      });

      // ÉTAPE C : Si l'utilisateur a pris la photo (et n'a pas annulé)
      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri); // On sauvegarde l'image dans le State
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue avec la caméra.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>

      {/* 3. L'affichage de l'Avatar */}
      <View style={styles.avatarContainer}>
        {photoUri ? (
          // Si une photo existe, on l'affiche avec le composant Image
          <Image source={{ uri: photoUri }} style={styles.avatar} />
        ) : (
          // Sinon, on affiche un rond gris par défaut
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Pas de photo</Text>
          </View>
        )}
      </View>

      {/* 4. Le bouton pour déclencher la fonction */}
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Prendre un Selfie 📸</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f8f9fa' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#2c3e50',
    marginBottom: 40 
  },
  avatarContainer: {
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  avatar: { 
    width: 150, 
    height: 150, 
    borderRadius: 75, // La moitié de la taille pour faire un cercle parfait
    borderWidth: 3,
    borderColor: '#e67e22'
  },
  placeholder: {
    width: 150, 
    height: 150, 
    borderRadius: 75,
    backgroundColor: '#bdc3c7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#95a5a6'
  },
  placeholderText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#e67e22',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});