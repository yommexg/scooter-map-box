import MapboxGL, {
  Camera,
  CircleLayer,
  Images,
  LineLayer,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import { useEffect, useState } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { featureCollection, point } from '@turf/helpers';
//@ts-ignore
import pin from '~/assets/pin.png';
import scooters from '~/data/scooter.json';
import routeResponse from '~/data/route.json';
import { getDirections } from '~/services/direction';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAP_ACCESS_PUBLIC_TOKEN!);

export default function Map() {
  const [direction, setDirection] = useState();
  const [userLatiude, setUserLatiude] = useState<number>();
  const [userLong, setUserLong] = useState<number>();

  const points = scooters.map((scooter) => point([scooter.long, scooter.lat]));
  const directionCoordinate = direction?.routes[0].geometry.coordinates;

  const onPointPress = async (event: OnPressEvent) => {
    const newDirection = await getDirections(
      [userLong, userLatiude],
      [event.coordinates.longitude, event.coordinates.latitude]
    );
    setDirection(newDirection);
  };

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

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLatiude(location.coords.latitude);
      setUserLong(location.coords.longitude);

      // Log the latitude and longitude to the console
      console.log('Current location:', location.coords.latitude, location.coords.longitude);
    };

    // Start location tracking when the component mounts
    requestLocationPermission();
  }, []);

  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation followZoomLevel={10} />
      <LocationPuck puckBearing="course" puckBearingEnabled={true} pulsing={{ isEnabled: true }} />
      <ShapeSource id="scooters" cluster shape={featureCollection(points)} onPress={onPointPress}>
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
      {directionCoordinate && (
        <ShapeSource
          id="routeSource"
          lineMetrics
          shape={{
            properties: {},
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: directionCoordinate,
            },
          }}>
          <LineLayer
            id="exampleLineLayer"
            style={{
              lineColor: '#42E100',
              lineCap: 'round',
              lineJoin: 'round',
              lineWidth: 7,
              // lineDasharray: [0, 4, 3],
            }}
          />
        </ShapeSource>
      )}
    </MapView>
  );
}
