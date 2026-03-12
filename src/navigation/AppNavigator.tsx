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
            iconName = 'list';
          } else if (route.name === 'Carte') {
            iconName = 'map';
          } else if (route.name === 'Mon Profil') {
            iconName = 'person';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e67e22',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Découverte" component={DiscoveryScreen} />
      <Tab.Screen name="Carte" component={MapScreen} />
      <Tab.Screen name="Mon Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};