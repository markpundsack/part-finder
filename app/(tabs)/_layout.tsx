import { Tabs } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function TabLayout() {
  const tintColor = useThemeColor({ light: '#2196f3', dark: '#90caf9' }, 'tint');
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarStyle: { backgroundColor },
        headerStyle: { backgroundColor },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Boxes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="package-variant-closed" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Capture',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-a-photo" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="format-list-numbered" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
