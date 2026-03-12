import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Modal, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
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
  const [savedDates, setSavedDates] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLieux();
    loadSavedDates();
  }, []);

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

  const handleDateSelection = async (date: string) => {
    if (!selectedLieu) return;
    try {
      const newSavedDates = { ...savedDates, [selectedLieu.nom_usuel]: date };
      setSavedDates(newSavedDates);
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

  const filteredLieux = lieux.filter(lieu => 
    lieu.nom_usuel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e17055" />
      </View>
    );
  }

  const currentDateForLieu = selectedLieu ? savedDates[selectedLieu.nom_usuel] : null;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Rechercher un événement..."
          placeholderTextColor="#b2bec3"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filteredLieux}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <LieuCard lieu={item} onPressDetails={() => setSelectedLieu(item)} />
        )}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucun événement ne correspond à "{searchQuery}"</Text>
        }
      />

      <Modal visible={selectedLieu !== null} animationType="slide" onRequestClose={() => setSelectedLieu(null)}>
        {selectedLieu && (
          <ScrollView style={styles.modalContainer} bounces={false}>
            <Image source={{ uri: 'https://picsum.photos/400/200' }} style={styles.headerImage} />
            <View style={styles.infoContainer}>
              <Text style={styles.modalTitle}>{selectedLieu.nom_usuel}</Text>
              <Text style={styles.address}>📍 {selectedLieu.adresse}</Text>
            </View>

            <View style={styles.calendarWrapper}>
              <Text style={styles.subtitle}>📅 Planifiez votre visite</Text>
              <Calendar
                style={styles.calendar}
                onDayPress={(day: any) => handleDateSelection(day.dateString)}
                markedDates={{
                  [currentDateForLieu || '']: { selected: true, selectedColor: '#e17055', selectedTextColor: '#fff' }
                }}
                theme={{ 
                  todayTextColor: '#e17055', 
                  arrowColor: '#e17055',
                  textMonthFontWeight: 'bold',
                }}
              />
            </View>

            {currentDateForLieu && (
              <View style={styles.confirmationBox}>
                <Text style={styles.confirmationText}>
                  ✅ Visite prévue le {currentDateForLieu}
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
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  searchInput: {
    backgroundColor: '#f1f2f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2d3436',
  },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#b2bec3', fontStyle: 'italic' },
  
  // Styles de la Modal
  modalContainer: { flex: 1, backgroundColor: '#f5f6fa' },
  headerImage: { width: '100%', height: 220 },
  infoContainer: { 
    padding: 20, 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    marginTop: -20, // Effet de chevauchement sur l'image
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5
  },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#2d3436', marginBottom: 8 },
  address: { fontSize: 15, color: '#636e72', lineHeight: 22 },
  
  calendarWrapper: { marginTop: 15, marginHorizontal: 16 },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#2d3436' },
  calendar: { borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  
  confirmationBox: { marginTop: 25, padding: 16, backgroundColor: '#e8f5e9', borderRadius: 12, marginHorizontal: 16, borderWidth: 1, borderColor: '#c8e6c9' },
  confirmationText: { color: '#2e7d32', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
  
  closeButton: { backgroundColor: '#2d3436', padding: 16, borderRadius: 16, margin: 20, alignItems: 'center', marginBottom: 50 },
  closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase' }
});