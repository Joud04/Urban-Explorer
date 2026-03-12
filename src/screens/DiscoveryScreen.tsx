import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { LieuCard } from '../components/LieuCard';
import { LieuCulturel } from '../types';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

export const DiscoveryScreen: React.FC = () => {
  const [lieux, setLieux] = useState<LieuCulturel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLieu, setSelectedLieu] = useState<LieuCulturel | null>(null);
  
  //  NOUVEAU STATE : Un dictionnaire qui stocke toutes nos dates sauvegardées
  const [savedDates, setSavedDates] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchLieux();
    loadSavedDates(); //  On charge les dates au démarrage
  }, []);

  //  Fonction pour récupérer les dates depuis le disque dur
  const loadSavedDates = async () => {
    try {
      const datesString = await AsyncStorage.getItem('@saved_dates');
      if (datesString !== null) {
        setSavedDates(JSON.parse(datesString));
      }
    } catch (error) {
      console.error("Erreur de chargement des dates", error);
    }
  };

  //  Fonction pour sauvegarder une nouvelle date
  const handleDateSelection = async (date: string) => {
    if (!selectedLieu) return;
    
    try {
      // On copie l'ancien dictionnaire et on ajoute/modifie la date pour ce lieu
      const newSavedDates = { ...savedDates, [selectedLieu.nom_usuel]: date };
      setSavedDates(newSavedDates); // Met à jour l'écran
      
      // On sauvegarde le nouveau dictionnaire complet dans le disque dur
      await AsyncStorage.setItem('@saved_dates', JSON.stringify(newSavedDates));
    } catch (error) {
      console.error("Erreur de sauvegarde", error);
    }
  };

  const fetchLieux = async () => {
    try {
      const response = await fetch('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=30');
      const json = await response.json();
      if (json.results && json.results.length > 0) {
        const lieuxAdaptes: LieuCulturel[] = json.results.map((item: any) => ({
          nom_usuel: item.title || "Événement culturel",
          adresse: item.address_name ? `${item.address_name}, ${item.address_street}` : item.address_street || "Adresse non précisée",
          coordonnees_geo: { lat: item.lat_lon ? item.lat_lon.lat : 48.8566, lon: item.lat_lon ? item.lat_lon.lon : 2.3522 }
        }));
        setLieux(lieuxAdaptes);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de contacter le serveur de Paris.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e67e22" />
      </View>
    );
  }

  //On cherche la date actuelle pour le lieu sélectionné
  const currentDateForLieu = selectedLieu ? savedDates[selectedLieu.nom_usuel] : null;

  return (
    <View style={styles.container}>
      <FlatList
        data={lieux}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <LieuCard lieu={item} onPressDetails={() => setSelectedLieu(item)} />
        )}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
      />

      <Modal visible={selectedLieu !== null} animationType="slide" onRequestClose={() => setSelectedLieu(null)}>
        {selectedLieu && (
          <ScrollView style={styles.modalContainer}>
            <Image source={{ uri: 'https://picsum.photos/400/200' }} style={styles.headerImage} />
            <View style={styles.infoContainer}>
              <Text style={styles.modalTitle}>{selectedLieu.nom_usuel}</Text>
              <Text style={styles.address}>{selectedLieu.adresse}</Text>
            </View>

            <Text style={styles.subtitle}>📅 Planifiez votre visite :</Text>

            <Calendar
              onDayPress={(day: any) => handleDateSelection(day.dateString)} //  Appel de notre fonction de sauvegarde
              markedDates={{
                [currentDateForLieu || '']: { selected: true, selectedColor: '#e67e22' } //  Affiche la date sauvegardée
              }}
              theme={{ todayTextColor: '#e67e22', arrowColor: '#e67e22' }}
            />

            {currentDateForLieu && (
              <View style={styles.confirmationBox}>
                <Text style={styles.confirmationText}>
                  ✅ Visite au {selectedLieu.nom_usuel} planifiée le {currentDateForLieu}
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedLieu(null)}>
              <Text style={styles.closeButtonText}>Retour à la liste</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { flex: 1, backgroundColor: '#f8f9fa' },
  headerImage: { width: '100%', height: 150 },
  infoContainer: { padding: 15, backgroundColor: '#fff', marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  address: { fontSize: 14, color: '#7f8c8d' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 15, marginBottom: 10, color: '#2c3e50' },
  confirmationBox: { marginTop: 20, padding: 15, backgroundColor: '#d4edda', borderColor: '#c3e6cb', borderWidth: 1, borderRadius: 8, marginHorizontal: 15 },
  confirmationText: { color: '#155724', fontWeight: 'bold', textAlign: 'center', fontSize: 14 },
  closeButton: { backgroundColor: '#34495e', padding: 15, borderRadius: 8, margin: 20, alignItems: 'center' },
  closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});