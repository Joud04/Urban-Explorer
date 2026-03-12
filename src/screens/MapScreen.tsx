import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// On importe MapView et Marker
import MapView, { Marker } from 'react-native-maps'; 
import { LieuCulturel } from '../types';

export const MapScreen: React.FC = () => {
  const [lieux, setLieux] = useState<LieuCulturel[]>([]);
  const [loading, setLoading] = useState(true);

  // On récupère les données au chargement de la carte
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
      {/* 🗺️ La Carte Plein Écran */}
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 48.8566, // Centré sur Paris comme demandé
          longitude: 2.3522, // Centré sur Paris comme demandé
          latitudeDelta: 0.08, // Niveau de zoom (plus le chiffre est petit, plus on zoome)
          longitudeDelta: 0.08,
        }}
      >
        {/* 📍 On boucle sur les lieux pour placer les marqueurs */}
        {lieux.map((lieu, index) => {
          // Sécurité : on vérifie que le lieu a bien des coordonnées valides
          if (!lieu.coordonnees_geo || !lieu.coordonnees_geo.lat || !lieu.coordonnees_geo.lon) {
            return null;
          }

          return (
            <Marker
              key={index}
              coordinate={{
                latitude: lieu.coordonnees_geo.lat,
                longitude: lieu.coordonnees_geo.lon,
              }}
              // La propriété title permet d'afficher le nom au clic natif !
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