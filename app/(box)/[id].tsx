import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { storage } from '../../utils/storage';
import type { Box } from '../../types/box';

export default function BoxDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [box, setBox] = useState<Box | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadBox();
  }, [id]);

  const loadBox = async () => {
    try {
      const boxes = await storage.getBoxes();
      const foundBox = boxes.find(b => b.id === id);
      setBox(foundBox || null);
    } catch (error) {
      console.error('Error loading box:', error);
      Alert.alert('Error', 'Failed to load box details');
      router.back();
    }
  };

  if (!box) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>

        <View style={styles.sprueList}>
          {box.sprues.length === 0 ? (
            <View style={styles.emptySprues}>
              <ThemedText style={styles.emptyText}>
                No sprues added yet
              </ThemedText>
              <Link href="/camera" asChild>
                <TouchableOpacity style={styles.addButton}>
                <ThemedText style={styles.addButtonText}>
                  Add First Sprue
                </ThemedText>
                </TouchableOpacity>
              </Link>
            </View>
          ) : (
            box.sprues.map((sprue) => (
              <Link
                key={sprue.id}
                href={{
                  pathname: '/(box)/sprue/[id]',
                  params: { id: sprue.id, boxId: box.id }
                }}
                asChild
              >
                <TouchableOpacity style={styles.sprueCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: sprue.imageUri }}
                    style={styles.sprueImage}
                    resizeMode="cover"
                  />
                  {sprue.parts.map((part) => (
                    <View
                      key={`${part.number}-${part.locations[0].x}-${part.locations[0].y}`}
                      style={[
                        styles.partMarker,
                        {
                          left: `${part.locations[0].x * 100}%`,
                          top: `${part.locations[0].y * 100}%`,
                        },
                      ]}
                    >
                      <ThemedText style={styles.partNumber}>
                        {part.number}
                      </ThemedText>
                    </View>
                  ))}
                </View>
                <View style={styles.sprueInfo}>
                  <ThemedText style={styles.sprueTitle}>
                    {sprue.letter ? `Sprue ${sprue.letter}` : 'Unnamed Sprue'}
                  </ThemedText>
                  <ThemedText style={styles.sprueDetails}>
                    {sprue.parts.length} part{sprue.parts.length !== 1 ? 's' : ''} detected
                  </ThemedText>
                </View>
                </TouchableOpacity>
              </Link>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      {box.sprues.length > 0 && (
        <Link href="/camera" asChild>
          <TouchableOpacity style={styles.fab}>
          <MaterialIcons name="add-a-photo" size={24} color="#fff" />
          </TouchableOpacity>
        </Link>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  container: {
    flex: 1,
  },
  emptySprues: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    opacity: 0.7,
  },
  addButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  sprueList: {
    padding: 16,
    gap: 16,
  },
  sprueCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 90,
    backgroundColor: '#000',
  },
  sprueImage: {
    width: '100%',
    height: '100%',
  },
  partMarker: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: 'rgba(33, 150, 243, 0.8)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  partNumber: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sprueInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  sprueTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sprueDetails: {
    fontSize: 14,
    opacity: 0.7,
  },
});
