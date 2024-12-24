import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { getDirections } from '~/services/direction';

// Define types for the scooter and direction response
interface Scooter {
  id: number;
  long: number;
  lat: number;
  name: string;
  plate: string;
}

interface Direction {
  routes: {
    geometry: {
      coordinates: [number, number][]; // Array of [longitude, latitude] pairs
    };
    duration: number;
    distance: number;
  }[];
}

interface ScooterContextType {
  selectedScooter: Scooter | null;
  setSelectedScooter: React.Dispatch<React.SetStateAction<Scooter | null>>;
  direction: Direction | null;
  directionCoordinate: [number, number][] | undefined;
  routeTime: number | undefined;
  routeDistance: number | undefined;
}

// Initialize the context with an empty object
const ScooterContext = createContext<ScooterContextType | undefined>(undefined);

export default function ScooterProvider({ children }: PropsWithChildren) {
  // Use appropriate types for state variables
  const [selectedScooter, setSelectedScooter] = useState<Scooter | null>(null);
  const [direction, setDirection] = useState<Direction | null>(null);
  const [userLatitude, setUserLatitude] = useState<number | undefined>(undefined);
  const [userLongitude, setUserLongitude] = useState<number | undefined>(undefined);

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

      setUserLatitude(location.coords.latitude);
      setUserLongitude(location.coords.longitude);
    };

    // Start location tracking when the component mounts
    requestLocationPermission();
  }, []); // Empty dependency array to run only once when the component mounts

  useEffect(() => {
    const fetchDirections = async () => {
      if (selectedScooter && userLongitude !== undefined && userLatitude !== undefined) {
        const newDirection = await getDirections(
          [userLongitude, userLatitude],
          [selectedScooter.long, selectedScooter.lat]
        );
        setDirection(newDirection);
      }
    };
    fetchDirections();
  }, [selectedScooter, userLongitude, userLatitude]); // Depend on `selectedScooter` and location data

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

export const useScooter = (): ScooterContextType => {
  const context = useContext(ScooterContext);
  if (!context) {
    throw new Error('useScooter must be used within a ScooterProvider');
  }
  return context;
};
