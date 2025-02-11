import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { storage } from '../../utils/storage';
import type { Box, Sprue } from '../../types/box';

type SearchResult = {
  sprueLetter?: string;
  sprueId: string;
  imageUri: string;
  partNumber: number;
  locations: { x: number; y: number }[];
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBox, setActiveBox] = useState<Box | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadActiveBox();
  }, []);

  const loadActiveBox = async () => {
    const box = await storage.getActiveBox();
    setActiveBox(box);
  };

  const handleSearch = () => {
    if (!activeBox || !searchQuery.trim()) return;

    setIsSearching(true);
    const query = searchQuery.trim();
    const searchResults: SearchResult[] = [];

    // Parse the query to handle letter prefixes (e.g., "A12" or just "12")
    const match = query.match(/^([A-Za-z])?(\d+)$/);
    if (!match) {
      setIsSearching(false);
      return;
    }

    const [, letterPrefix, numberStr] = match;
    const searchNumber = parseInt(numberStr, 10);

    activeBox.sprues.forEach((sprue) => {
      // If a letter prefix was provided, only search the matching sprue
      if (letterPrefix && sprue.letter && sprue.letter.toLowerCase() !== letterPrefix.toLowerCase()) {
        return;
      }

      sprue.parts.forEach((part) => {
        if (part.number === searchNumber) {
          searchResults.push({
            sprueLetter: sprue.letter,
            sprueId: sprue.id,
            imageUri: sprue.imageUri,
            partNumber: part.number,
            locations: part.locations,
          });
        }
      });
    });

    setResults(searchResults);
    setIsSearching(false);
  };

  if (!activeBox) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.message}>
          Please select or create a box first
        </ThemedText>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/')}
        >
          <ThemedText style={styles.buttonText}>Go to Boxes</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          placeholder="Enter part number (e.g., A12 or 12)"
          placeholderTextColor="#999"
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={isSearching}
        >
          <ThemedText style={styles.searchButtonText}>
            {isSearching ? 'Searching...' : 'Search'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.sprueId}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <ThemedText style={styles.resultTitle}>
                  Part {item.sprueLetter ? `${item.sprueLetter}${item.partNumber}` : item.partNumber}
                </ThemedText>
                <ThemedText style={styles.resultSubtitle}>
                  Found on sprue {item.sprueLetter || 'Unknown'}
                </ThemedText>
              </View>
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => {
                  if (!activeBox) return;
                  router.push(`/box/sprue/${item.sprueId}?boxId=${activeBox.id}`);
                }}
              >
                <Image
                  source={{ uri: item.imageUri }}
                  style={styles.sprueImage}
                  resizeMode="contain"
                />
                {item.locations.map((location, index) => (
                  <View
                    key={`${item.partNumber}-${location.x}-${location.y}-${index}`}
                    style={[
                      styles.partMarker,
                      {
                        left: `${location.x * 100}%`,
                        top: `${location.y * 100}%`,
                      },
                    ]}
                  >
                    <ThemedText style={styles.partNumber}>
                      {item.partNumber}
                    </ThemedText>
                  </View>
                ))}
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.resultsList}
        />
      ) : searchQuery.trim() ? (
        <View style={styles.noResults}>
          <ThemedText style={styles.message}>
            No parts found matching "{searchQuery}"
          </ThemedText>
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchButton: {
    backgroundColor: '#2196f3',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  resultsList: {
    gap: 16,
  },
  resultCard: {
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
  resultHeader: {
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  imageContainer: {
    aspectRatio: 4/3,
    backgroundColor: '#000',
  },
  sprueImage: {
    width: '100%',
    height: '100%',
  },
  partMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    backgroundColor: 'rgba(33, 150, 243, 0.8)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  partNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
