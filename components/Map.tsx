import MapboxGL, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import React, { useEffect, useState } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAP_ACCESS_PUBLIC_TOKEN!);

export default function Map() {
  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      if (Platform.OS === 'android') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
          console.log('Background location permission was denied');
          return;
        }
      }
    };

    // Start location tracking when the component mounts
    requestLocationPermission();
  }, []);

  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation followZoomLevel={10} />
      <LocationPuck puckBearing="course" puckBearingEnabled={true} pulsing={{ isEnabled: true }} />
    </MapView>
  );
}
