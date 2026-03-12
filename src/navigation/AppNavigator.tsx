import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { DiscoveryScreen } from '../screens/DiscoveryScreen';
import { MapScreen } from '../screens/MapScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName: any = 'help-circle';
          
          if (route.name === 'Découverte') {
            iconName = 'compass'; // Icône plus stylée que 'list'
          } else if (route.name === 'Carte') {
            iconName = 'map';
          } else if (route.name === 'Mon Profil') {
            iconName = 'person-circle'; // Icône plus stylée
          }
          
          return <Ionicons name={iconName} size={size + 2} color={color} />; // Icônes un peu plus grandes
        },
        tabBarActiveTintColor: '#e17055', // La même couleur orange moderne
        tabBarInactiveTintColor: '#b2bec3',
        
        // --- Le style "Premium" commence ici ---
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0, // Enlève l'ombre moche sous le header sur Android
          shadowOpacity: 0, // Enlève l'ombre sur iOS
          borderBottomWidth: 1,
          borderBottomColor: '#f1f2f6'
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#2d3436',
          fontSize: 20
        },
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12
        }
      })}
    >
      <Tab.Screen name="Découverte" component={DiscoveryScreen} />
      <Tab.Screen name="Carte" component={MapScreen} />
      <Tab.Screen name="Mon Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};