import { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { featureCollection, point } from '@turf/helpers';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';

import scooters from '~/data/scooter.json';
//@ts-ignore
import pin from '~/assets/pin.png';
import { useScooter } from '~/providers/ScooterProvider';

export default function ScooterMarkers() {
  const { setSelectedScooter } = useScooter();
  const points = scooters.map((scooter) => point([scooter.long, scooter.lat], { scooter }));

  const onPointPress = async (event: OnPressEvent) => {
    if (event.features[0].properties?.scooter) {
      setSelectedScooter(event.features[0].properties.scooter);
    }
  };
  return (
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
  );
}
