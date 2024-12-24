import { Stack } from 'expo-router';
import ScooterProvider from '~/providers/ScooterProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScooterProvider>
        <Stack />
      </ScooterProvider>
    </GestureHandlerRootView>
  );
}
