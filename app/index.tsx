import { Stack, Link } from 'expo-router';
import Map from '~/components/Map';

// npx create-expo-stack

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <Map />
    </>
  );
}
