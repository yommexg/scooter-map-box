import MapboxGL, {
  Camera,
  CircleLayer,
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
      <ShapeSource
        id="scooters"
        cluster
        shape={featureCollection(points)}
        onPress={(e) => console.log(JSON.stringify(e, null, 2))}>
        <SymbolLayer
          id="clusters-count"
          sourceLayerID="scooters"
          filter={['has', 'point_count']}
          style={{
            textField: '{point_count_abbreviated}',
            textSize: 12,
            textColor: '#FFFFFF',
            textPitchAlignment: 'map',
          }}
          existing={true}
        />
        <CircleLayer
          id="clusters"
          belowLayerID="clusters-count"
          filter={['has', 'point_count']}
          style={{
            circlePitchAlignment: 'map',
            circleColor: '#42E100',
            circleRadius: 20,
            circleStrokeWidth: 2,
            circleStrokeColor: 'white',
          }}
        />

        <SymbolLayer
          id="scooter-icons"
          filter={['!', ['has', 'point_count']]}
          style={{
            iconImage: 'pin',
            iconSize: 0.4,
            iconAllowOverlap: true,
            iconAnchor: 'bottom',
          }}
        />
        <Images images={{ pin }} />
      </ShapeSource>
    </MapView>
  );
}
