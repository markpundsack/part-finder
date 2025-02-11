import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [loaded, error] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          headerShown: false,
          headerBackVisible: false
        }}
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            title: 'Part Finder'
          }} 
        />
        <Stack.Screen 
          name="(box)" 
          options={{ 
            headerShown: false
          }} 
        />
      <Stack.Screen
        name="new-box"
        options={{
          title: 'New Box',
          presentation: 'modal',
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => router.back()}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="test-ocr"
        options={{
          title: 'Test OCR',
          presentation: 'modal',
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => router.back()}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          ),
        }}
      />
      </Stack>
    </GestureHandlerRootView>
  );
}
