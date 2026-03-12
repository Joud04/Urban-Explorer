import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { LieuCard } from '../components/LieuCard';
import { LieuCulturel } from '../types';

// 🇫🇷 Configuration du calendrier en français
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

  // States pour ouvrir la fenêtre (Modal) et stocker la date
  const [selectedLieu, setSelectedLieu] = useState<LieuCulturel | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchLieux();
  }, []);

  const fetchLieux = async () => {
    try {
      const response = await fetch('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=30');
      const json = await response.json();
      
      if (json.results && json.results.length > 0) {
        const lieuxAdaptes: LieuCulturel[] = json.results.map((item: any) => ({
          nom_usuel: item.title || "Événement culturel",
          adresse: item.address_name ? `${item.address_name}, ${item.address_street}` : item.address_street || "Adresse non précisée",
          coordonnees_geo: {
            lat: item.lat_lon ? item.lat_lon.lat : 48.8566,
            lon: item.lat_lon ? item.lat_lon.lon : 2.3522
          }
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

  return (
    <View style={styles.container}>
      {/* 1. LA LISTE DES LIEUX */}
      <FlatList
        data={lieux}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <LieuCard 
            lieu={item} 
            onPressDetails={() => {
              // 👉 C'EST ÇA QUI RÉPARE LE BOUTON : On ouvre la fenêtre Modal !
              setSelectedLieu(item);
              setSelectedDate(null); // On efface l'ancienne date
            }} 
          />
        )}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
      />

      {/* 2. LA FENÊTRE QUI S'OUVRE PAR-DESSUS (Le Calendrier) */}
      <Modal
        visible={selectedLieu !== null}
        animationType="slide"
        onRequestClose={() => setSelectedLieu(null)}
      >
        {selectedLieu && (
          <ScrollView style={styles.modalContainer}>
            <Image source={{ uri: 'https://picsum.photos/400/200' }} style={styles.headerImage} />
            
            <View style={styles.infoContainer}>
              <Text style={styles.modalTitle}>{selectedLieu.nom_usuel}</Text>
              <Text style={styles.address}>{selectedLieu.adresse}</Text>
            </View>

            <Text style={styles.subtitle}>📅 Planifiez votre visite :</Text>

            {/* LE CALENDRIER */}
            <Calendar
              onDayPress={(day: any) => setSelectedDate(day.dateString)}
              markedDates={{
                [selectedDate || '']: { selected: true, selectedColor: '#e67e22' }
              }}
              theme={{ todayTextColor: '#e67e22', arrowColor: '#e67e22' }}
            />

            {/* LE MESSAGE DE CONFIRMATION */}
            {selectedDate && (
              <View style={styles.confirmationBox}>
                <Text style={styles.confirmationText}>
                  ✅ Visite au {selectedLieu.nom_usuel} planifiée le {selectedDate}
                </Text>
              </View>
            )}

            {/* BOUTON FERMER */}
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setSelectedLieu(null)}
            >
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