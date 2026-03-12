import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { LieuCulturel } from '../types';

export const MapScreen: React.FC = () => {

  const [lieux, setLieux] = useState<LieuCulturel[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<any>(null);

  useEffect(() => {
    fetchLieux();
    getUserLocation();
  }, []);

  // 📍 Récupérer la position de l'utilisateur
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert("Permission refusée", "Impossible d'obtenir votre position.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

    } catch (error) {
      Alert.alert("Erreur", "Impossible de récupérer votre position.");
    }
  };

  // 📡 Récupérer les lieux depuis l'API Paris
  const fetchLieux = async () => {
    try {
      const response = await fetch(
        'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=30'
      );

      const json = await response.json();

      if (json.results && json.results.length > 0) {

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
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de charger les repères sur la carte.');
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

      <MapView
        style={styles.map}
        showsUserLocation={true}
        initialRegion={{
          latitude: userLocation ? userLocation.latitude : 48.8566,
          longitude: userLocation ? userLocation.longitude : 2.3522,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >

        {/* 📍 Marker utilisateur */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude
            }}
            title="Vous êtes ici"
            pinColor="blue"
          />
        )}

        {/* 📍 Markers des lieux culturels */}
        {lieux.map((lieu, index) => {

          if (
            !lieu.coordonnees_geo ||
            !lieu.coordonnees_geo.lat ||
            !lieu.coordonnees_geo.lon
          ) {
            return null;
          }

          return (
            <Marker
              key={index}
              coordinate={{
                latitude: lieu.coordonnees_geo.lat,
                longitude: lieu.coordonnees_geo.lon,
              }}
              title={lieu.nom_usuel}
              description={lieu.adresse}
            />
          );
        })}

      </MapView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  map: {
    width: '100%',
    height: '100%'
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});