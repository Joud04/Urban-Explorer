// src/screens/DiscoveryScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { LieuCard } from '../components/LieuCard';
import { LieuCulturel } from '../types';

export const DiscoveryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [lieux, setLieux] = useState<LieuCulturel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLieux();
  }, []);

const fetchLieux = async () => {
    try {
      console.log("📡 Appel de la nouvelle API de Paris en cours...");
      
      // 👉 NOUVELLE URL OFFICIELLE
      const response = await fetch('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=30');
      const json = await response.json();
      
      if (json.results && json.results.length > 0) {
        // 🔄 TRADUCTION : On adapte les champs de l'API à TON interface LieuCulturel
        const lieuxAdaptes: LieuCulturel[] = json.results.map((item: any) => ({
          nom_usuel: item.title || "Événement culturel",
          adresse: item.address_name ? `${item.address_name}, ${item.address_street}` : item.address_street || "Adresse non précisée",
          coordonnees_geo: {
            lat: item.lat_lon ? item.lat_lon.lat : 48.8566,
            lon: item.lat_lon ? item.lat_lon.lon : 2.3522
          }
        }));
        
        setLieux(lieuxAdaptes);
        console.log("✅ Données récupérées et formatées avec succès !");
      } else {
        console.log("⚠️ Le serveur a répondu, mais le tableau est vide.");
      }
      
    } catch (error) {
      console.error("❌ Erreur réseau :", error);
      Alert.alert('Erreur', 'Impossible de contacter le serveur de Paris.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e67e22" />
        <Text style={{ marginTop: 10 }}>Chargement des lieux...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={lieux}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <LieuCard 
            lieu={item} 
            onPressDetails={() => navigation.navigate('PlaceDetails', { lieu: item })} 
          />
        )}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        // 👉 NOUVEAU : Si la liste est vide, on affiche ce message au lieu du vide absolu
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun lieu culturel trouvé.</Text>
            <Text style={styles.emptySubText}>Vérifie le terminal de ton PC (là où ton serveur tourne) pour voir l'erreur de l'API.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { padding: 20, alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#e74c3c' },
  emptySubText: { fontSize: 14, color: '#7f8c8d', textAlign: 'center', marginTop: 10 }
});