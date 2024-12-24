import { Image, View, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useScooter } from '~/providers/ScooterProvider';
import { useEffect, useRef } from 'react';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { Button } from './Button';

export default function SelectedScooterSheet() {
  const { selectedScooter, routeDistance, routeTime } = useScooter();

  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (selectedScooter) {
      bottomSheetRef.current?.expand();
    }
  }, [selectedScooter]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={[200]}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: '#414442',
      }}>
      <BottomSheetView
        style={{
          flex: 1,
          flexDirection: 'row',
          padding: 10,
          gap: 10,
        }}>
        <Image source={require('../assets/scooter.png')} style={{ width: 50, height: 50 }} />
        <View style={{ flex: 1, gap: 5 }}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>
            {selectedScooter?.name}
          </Text>
          <Text style={{ color: 'gray', fontSize: 16 }}>
            {selectedScooter?.plate.slice(0, 3)} - {selectedScooter?.plate.slice(3, 6)} · Maddison
            Avenue
          </Text>
        </View>
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <FontAwesome6 name="bolt-lightning" size={18} color="#42E100" />
            {routeDistance && (
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                {(routeDistance / 1000).toFixed(2)} km
              </Text>
            )}
          </View>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <FontAwesome name="clock-o" size={18} color="#42E100" />
            {routeTime && (
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                {(routeTime / 60).toFixed(0)} min
              </Text>
            )}
          </View>
        </View>
      </BottomSheetView>
      <BottomSheetView style={{ paddingBottom: 20, paddingHorizontal: 10 }}>
        <Button title="Start Journey" />
      </BottomSheetView>
    </BottomSheet>
  );
}
