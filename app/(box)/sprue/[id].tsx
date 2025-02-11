import { useEffect, useState } from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { storage } from '../../../utils/storage';
import type { Box, Sprue } from '../../../types/box';

export default function SprueDetailScreen() {
  const { id, boxId } = useLocalSearchParams<{ id: string; boxId: string }>();
  const [sprue, setSprue] = useState<Sprue | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadSprue();
  }, [id, boxId]);

  const loadSprue = async () => {
    try {
      const boxes = await storage.getBoxes();
      const box = boxes.find(b => b.id === boxId);
      if (!box) {
        throw new Error('Box not found');
      }
      
      const foundSprue = box.sprues.find(s => s.id === id);
      setSprue(foundSprue || null);
    } catch (error) {
      console.error('Error loading sprue:', error);
      router.back();
    }
  };

  if (!sprue) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: sprue.imageUri }}
            style={styles.sprueImage}
            resizeMode="contain"
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

        <View style={styles.details}>
          <ThemedText style={styles.title}>
            {sprue.letter ? `Sprue ${sprue.letter}` : 'Unnamed Sprue'}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {sprue.parts.length} part{sprue.parts.length !== 1 ? 's' : ''} detected
          </ThemedText>

          <View style={styles.partsList}>
            <ThemedText style={styles.sectionTitle}>Parts</ThemedText>
            {sprue.parts.map((part) => (
              <View
                key={`${part.number}-list`}
                style={styles.partItem}
              >
                <ThemedText style={styles.partItemNumber}>
                  Part {part.number}
                </ThemedText>
                <ThemedText style={styles.partItemLocations}>
                  {part.locations.length} location{part.locations.length !== 1 ? 's' : ''}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 4/3,
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
  details: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 24,
  },
  partsList: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  partItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  partItemNumber: {
    fontSize: 16,
    fontWeight: '500',
  },
  partItemLocations: {
    fontSize: 14,
    opacity: 0.7,
  },
});
