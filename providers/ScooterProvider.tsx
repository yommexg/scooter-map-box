import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { getDirections } from '~/services/direction';

const ScooterContext = createContext({});

export default function ScooterProvider({ children }: PropsWithChildren) {
  const [selectedScooter, setSelectedScooter] = useState();
  const [direction, setDirection] = useState();
  const [userLatiude, setUserLatiude] = useState<number>();
  const [userLong, setUserLong] = useState<number>();

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
      // console.log('Current location:', location.coords.latitude, location.coords.longitude);
    };

    // Start location tracking when the component mounts
    requestLocationPermission();

    const fetchDirections = async () => {
      if (selectedScooter) {
        const newDirection = await getDirections(
          [userLong, userLatiude],
          [selectedScooter.long, selectedScooter.lat]
        );
        setDirection(newDirection);
      }
    };
    fetchDirections();
  }, [selectedScooter]);

  return (
    <ScooterContext.Provider
      value={{
        selectedScooter,
        setSelectedScooter,
        direction,
        directionCoordinate: direction?.routes[0]?.geometry?.coordinates,
        routeTime: direction?.routes[0]?.duration,
        routeDistance: direction?.routes[0]?.distance,
      }}>
      {children}
    </ScooterContext.Provider>
  );
}

export const useScooter = () => useContext(ScooterContext);
