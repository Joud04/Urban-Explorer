import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { LieuCulturel } from '../types';

// 🇫🇷 Petit bonus pour impressionner le prof : On met le calendrier en Français !
LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

export const PlaceDetailsScreen: React.FC<{ route: any }> = ({ route }) => {
  // 1. On récupère les données du lieu cliqué depuis la route de navigation
  const { lieu } = route.params as { lieu: LieuCulturel };
  
  // 2. Le state pour stocker la date sélectionnée (ex: "2024-05-12")
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <ScrollView style={styles.container}>
      {/* En-tête avec l'image et les infos du lieu */}
      <Image source={{ uri: 'https://picsum.photos/400/200' }} style={styles.headerImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{lieu.nom_usuel}</Text>
        <Text style={styles.address}>{lieu.adresse}</Text>
      </View>

      <Text style={styles.subtitle}>📅 Planifiez votre visite :</Text>

      {/* 3. Le Calendrier Natif */}
      <Calendar
        // Événement déclenché quand on clique sur un jour
        onDayPress={(day: any) => {
          setSelectedDate(day.dateString); // On sauvegarde la date au format YYYY-MM-DD
        }}
        // On marque le jour sélectionné avec un fond de couleur (orange)
        markedDates={{
          [selectedDate || '']: { selected: true, selectedColor: '#e67e22' }
        }}
        theme={{
          todayTextColor: '#e67e22',
          arrowColor: '#e67e22',
        }}
      />

      {/* 4. Le message de confirmation (Affiché uniquement SI une date est choisie) */}
      {selectedDate && (
        <View style={styles.confirmationBox}>
          <Text style={styles.confirmationText}>
            ✅ Visite au {lieu.nom_usuel} planifiée le {selectedDate}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  headerImage: { width: '100%', height: 150 },
  infoContainer: { padding: 15, backgroundColor: '#fff', marginBottom: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  address: { fontSize: 14, color: '#7f8c8d' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 15, marginBottom: 10, color: '#2c3e50' },
  confirmationBox: { 
    marginTop: 20, 
    marginBottom: 40,
    padding: 15, 
    backgroundColor: '#d4edda', 
    borderColor: '#c3e6cb',
    borderWidth: 1,
    borderRadius: 8, 
    marginHorizontal: 15 
  },
  confirmationText: { 
    color: '#155724', 
    fontWeight: 'bold', 
    textAlign: 'center',
    fontSize: 14
  }
});