import MapboxGL, {
  Camera,
  Images,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import React, { useEffect, useState } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { featureCollection, point } from '@turf/helpers';
import pin from '~/assets/pin.png';
import scooters from '~/data/scooter.json';

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAP_ACCESS_PUBLIC_TOKEN!);

export default function Map() {
  const points = scooters.map((scooter) => point([scooter.long, scooter.lat]));

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
      <ShapeSource id="scooters" shape={featureCollection(points)}>
        <SymbolLayer
          id="scooter-icons"
          style={{
            iconImage: 'pin',
            iconSize: 0.4,
            iconAllowOverlap: true,
          }}
        />
        <Images images={{ pin }} />
      </ShapeSource>
    </MapView>
  );
}
