import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { storage } from '../../utils/storage';
import type { Box } from '../../types/box';

export default function BoxLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [box, setBox] = useState<Box | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      loadBox();
    }
  }, [id]);

  const loadBox = async () => {
    try {
      const boxes = await storage.getBoxes();
      const foundBox = boxes.find(b => b.id === id);
      setBox(foundBox || null);
    } catch (error) {
      console.error('Error loading box:', error);
    }
  };

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: box?.name,
          headerShown: true,
          headerBackTitle: 'Boxes',
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#666" />
            </TouchableOpacity>
          ),
          headerRight: () => box && (
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => {
                if (!box) return;
                Alert.alert(
                  'Box Options',
                  undefined,
                  [
                    {
                      text: box.status === 'completed' ? 'Mark as Active' : 'Mark as Complete',
                      onPress: async () => {
                        try {
                          const updatedBox = {
                            ...box,
                            status: box.status === 'completed' ? 'active' as const : 'completed' as const
                          };
                          await storage.saveBox(updatedBox);
                          router.push('/');
                        } catch (error) {
                          console.error('Error updating box status:', error);
                          Alert.alert('Error', 'Failed to update box status');
                        }
                      },
                    },
                    {
                      text: 'Delete Box',
                      onPress: () => {
                        Alert.alert(
                          'Delete Box',
                          `Are you sure you want to delete "${box.name}"?`,
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                            {
                              text: 'Delete',
                              style: 'destructive',
                              onPress: async () => {
                                try {
                                  const activeBoxId = await storage.getActiveBoxId();
                                  const isActive = box.id === activeBoxId;
                                  await storage.deleteBox(box.id);
                                  router.push('/');
                                } catch (error) {
                                  console.error('Error deleting box:', error);
                                  Alert.alert('Error', 'Failed to delete box. Please try again.');
                                }
                              },
                            },
                          ]
                        );
                      },
                      style: 'destructive',
                    },
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                  ]
                );
              }}
            >
              <MaterialIcons name="more-vert" size={24} color="#666" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="sprue"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
