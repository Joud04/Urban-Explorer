import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Animated, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProfileScreen: React.FC = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  
  // Le state pour stocker les visites planifiées
  const [visits, setVisits] = useState<any[]>([]);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadSavedPhoto();
    loadSavedVisits(); // Appel de la fonction au chargement

    // L'animation infinie de pulsation (Pulse) du bouton
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

  // La fonction pour récupérer les dates du calendrier
  const loadSavedVisits = async () => {
    try {
      const savedDates = await AsyncStorage.getItem('@saved_dates');
      if (savedDates) {
        const parsed = JSON.parse(savedDates);
        // On transforme l'objet dictionnaire en tableau pour la FlatList
        const visitsArray = Object.entries(parsed).map(([lieu, date]) => ({
          lieu,
          date
        }));
        setVisits(visitsArray);
      }
    } catch (error) {
      console.error("Erreur chargement visites", error);
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission requise", "Vous devez autoriser l'accès à la caméra.");
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

      <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 30 }}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Prendre un Selfie</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* L'affichage des visites planifiées */}
      <View style={styles.visitsContainer}>
        <Text style={styles.sectionTitle}>📅 Mes visites planifiées</Text>

        {visits.length === 0 ? (
          <Text style={styles.emptyText}>Aucune visite planifiée pour le moment.</Text>
        ) : (
          <FlatList
            data={visits}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.visitCard}>
                <Text style={styles.visitLieu}>{item.lieu}</Text>
                <Text style={styles.visitDate}>Le {item.date}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Modification ici : paddingTop au lieu de justifyContent center, pour laisser de la place à la liste
  container: { flex: 1, alignItems: 'center', backgroundColor: '#f5f6fa', paddingTop: 60 },
  title: { fontSize: 32, fontWeight: '900', color: '#2d3436', marginBottom: 30, letterSpacing: 1 },
  
  avatarContainer: { 
    marginBottom: 30, 
    shadowColor: '#e17055', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 15, 
    elevation: 10 
  },
  avatar: { width: 150, height: 150, borderRadius: 75, borderWidth: 4, borderColor: '#fff' },
  placeholder: { 
    width: 150, height: 150, borderRadius: 75, 
    backgroundColor: '#dfe6e9', 
    justifyContent: 'center', alignItems: 'center', 
    borderWidth: 4, borderColor: '#fff' 
  },
  placeholderText: { fontSize: 40, marginBottom: 5 },
  placeholderSubText: { color: '#636e72', fontWeight: 'bold', fontSize: 14 },
  
  button: { 
    backgroundColor: '#e17055', 
    paddingVertical: 14, 
    paddingHorizontal: 30, 
    borderRadius: 30, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },

  // Styles Premium pour la section des visites
  visitsContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 15,
    alignSelf: 'flex-start'
  },
  emptyText: {
    color: '#b2bec3',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16
  },
  visitCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#e17055' // Petite barre orange sur le côté pour le style !
  },
  visitLieu: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2d3436',
    marginBottom: 5
  },
  visitDate: {
    color: '#e17055',
    fontWeight: '600',
    fontSize: 14
  }
});