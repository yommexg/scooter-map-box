import MapboxGL, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';

import { useScooter } from '~/providers/ScooterProvider';
import LineRoute from './LineRoute';
import ScooterMarkers from './ScooterMarkers';

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAP_ACCESS_PUBLIC_TOKEN!);

export default function Map() {
  const { directionCoordinate } = useScooter();

  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation followZoomLevel={10} />
      <LocationPuck puckBearing="course" puckBearingEnabled={true} pulsing={{ isEnabled: true }} />

      <ScooterMarkers />

      {directionCoordinate && <LineRoute coordinates={directionCoordinate} />}
    </MapView>
  );
}
