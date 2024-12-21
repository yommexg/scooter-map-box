import { Stack, Link } from 'expo-router';
import Map from '~/components/Map';

// npx create-expo-stack

export default function Home() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Anime Code Lord Scooter Guide',
          headerTitleAlign: 'center',
          headerTintColor: 'white',
          headerStyle: [{ backgroundColor: '#42E100' }],
        }}
      />
      <Map />
    </>
  );
}
