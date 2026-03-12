import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

import { Calendar, LocaleConfig } from 'react-native-calendars';
import * as Location from 'expo-location';

import { LieuCard } from '../components/LieuCard';
import { LieuCulturel } from '../types';

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier','Février','Mars','Avril','Mai','Juin',
    'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
  ],
  monthNamesShort: [
    'Janv.','Févr.','Mars','Avril','Mai','Juin',
    'Juil.','Août','Sept.','Oct.','Nov.','Déc.'
  ],
  dayNames: [
    'Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'
  ],
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
  today: "Aujourd'hui"
};

LocaleConfig.defaultLocale = 'fr';

export const DiscoveryScreen: React.FC = () => {

  const [lieux, setLieux] = useState<LieuCulturel[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLieu, setSelectedLieu] = useState<LieuCulturel | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [userLocation, setUserLocation] = useState<any>(null);

  useEffect(() => {
    fetchLieux();
    getUserLocation();
  }, []);

  const getUserLocation = async () => {

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
  };

  const fetchLieux = async () => {

    try {

      const response = await fetch(
        'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=30'
      );

      const json = await response.json();

      const lieuxAdaptes: LieuCulturel[] = json.results.map((item: any) => ({

        nom_usuel: item.title || "Événement culturel",

        adresse: item.address_name
          ? `${item.address_name}, ${item.address_street}`
          : item.address_street || "Adresse non précisée",

        coordonnees_geo: {
          lat: item.lat_lon ? item.lat_lon.lat : 48.8566,
          lon: item.lat_lon ? item.lat_lon.lon : 2.3522
        }

      }));

      setLieux(lieuxAdaptes);

    } catch (error) {

      Alert.alert('Erreur', 'Impossible de contacter le serveur.');

    } finally {

      setLoading(false);

    }

  };

  const getDistanceKm = (lat1:any, lon1:any, lat2:any, lon2:any) => {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI/180) *
      Math.cos(lat2 * Math.PI/180) *
      Math.sin(dLon/2) *
      Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const getDistanceText = (distanceKm:any) => {

    const rounded = distanceKm.toFixed(1);

    return `à ~${rounded} km d'ici`;
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

      <FlatList

        data={lieux}

        keyExtractor={(item, index) => index.toString()}

        renderItem={({ item }) => {

          let distanceText;

          if (userLocation) {

            const distance = getDistanceKm(
              userLocation.latitude,
              userLocation.longitude,
              item.coordonnees_geo.lat,
              item.coordonnees_geo.lon
            );

            distanceText = getDistanceText(distance);
          }

          return (
            <LieuCard
              lieu={item}
              distanceText={distanceText}
              onPressDetails={() => {
                setSelectedLieu(item);
                setSelectedDate(null);
              }}
            />
          );

        }}

        contentContainerStyle={{
          paddingBottom: 30,
          paddingTop: 10
        }}

      />

      <Modal
        visible={selectedLieu !== null}
        animationType="slide"
        onRequestClose={() => setSelectedLieu(null)}
      >

        {selectedLieu && (

          <ScrollView style={styles.modalContainer}>

            <Image
              source={{ uri: 'https://picsum.photos/400/200' }}
              style={styles.headerImage}
            />

            <View style={styles.infoContainer}>
              <Text style={styles.modalTitle}>{selectedLieu.nom_usuel}</Text>
              <Text style={styles.address}>{selectedLieu.adresse}</Text>
            </View>

            <Text style={styles.subtitle}>📅 Planifiez votre visite :</Text>

            <Calendar
              onDayPress={(day: any) => setSelectedDate(day.dateString)}
              markedDates={{
                [selectedDate || '']: { selected: true, selectedColor: '#e67e22' }
              }}
              theme={{
                todayTextColor: '#e67e22',
                arrowColor: '#e67e22'
              }}
            />

            {selectedDate && (
              <View style={styles.confirmationBox}>
                <Text style={styles.confirmationText}>
                  ✅ Visite au {selectedLieu.nom_usuel} planifiée le {selectedDate}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedLieu(null)}
            >
              <Text style={styles.closeButtonText}>
                Retour à la liste
              </Text>
            </TouchableOpacity>

          </ScrollView>

        )}

      </Modal>

    </View>

  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f1f3f6"
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "#f1f3f6"
  },

  headerImage: {
    width: "100%",
    height: 180
  },

  infoContainer: {
    padding: 18,
    backgroundColor: "#fff",
    marginBottom: 15
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 6
  },

  address: {
    fontSize: 14,
    color: "#7f8c8d"
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginBottom: 10,
    color: "#2c3e50"
  },

  confirmationBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 15
  },

  confirmationText: {
    color: "#155724",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14
  },

  closeButton: {
    backgroundColor: "#34495e",
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: "center"
  },

  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }

});