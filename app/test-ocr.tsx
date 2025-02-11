import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { detectPartNumbers, detectSprueLetter } from '../utils/ocr';
import { testSprue } from './(box)/sprue/test-data';
import type { Sprue } from '../types/box';

import { Stack, useRouter } from 'expo-router';

export default function TestOCRScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [detectedParts, setDetectedParts] = useState<{ number: number; location: { x: number; y: number } }[]>([]);
  const [detectedLetter, setDetectedLetter] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      processImage(result.assets[0].uri);
    }
  };

  const processImage = async (uri: string) => {
    setIsProcessing(true);
    try {
      const [parts, letter] = await Promise.all([
        detectPartNumbers(uri),
        detectSprueLetter(uri),
      ]);

      setDetectedParts(parts);
      setDetectedLetter(letter);

      if (parts.length === 0 && !letter) {
        Alert.alert(
          'No Results',
          'No part numbers or sprue letter were detected in this image. Try another image or adjust the image to ensure numbers are clearly visible.'
        );
      }
    } catch (error) {
      console.error('OCR Error:', error);
      Alert.alert('Error', 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const useTestData = () => {
    setImageUri(testSprue.imageUri);
    setDetectedParts(testSprue.parts.map((p: { number: string; locations: { x: number; y: number }[] }) => 
      ({ number: parseInt(p.number), location: p.locations[0] })
    ));
    setDetectedLetter(testSprue.letter);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={pickImage}
              disabled={isProcessing}
            >
              <ThemedText style={styles.buttonText}>
                {isProcessing ? 'Processing...' : 'Pick Image'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={useTestData}
              disabled={isProcessing}
            >
              <ThemedText style={styles.buttonText}>
                Use Test Data
              </ThemedText>
            </TouchableOpacity>
          </View>

          {imageUri && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="contain"
              />
              {detectedParts.map((part, index) => (
                <View
                  key={`${part.number}-${index}`}
                  style={[
                    styles.marker,
                    {
                      left: `${part.location.x * 100}%`,
                      top: `${part.location.y * 100}%`,
                    },
                  ]}
                >
                  <ThemedText style={styles.markerText}>
                    {part.number}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}

          {(detectedParts.length > 0 || detectedLetter) && (
            <View style={styles.results}>
              <ThemedText style={styles.resultsTitle}>Results:</ThemedText>
              {detectedLetter && (
                <ThemedText style={styles.resultText}>
                  Sprue Letter: {detectedLetter}
                </ThemedText>
              )}
              <ThemedText style={styles.resultText}>
                Detected Parts ({detectedParts.length}):
              </ThemedText>
              {detectedParts.map((part, index) => (
                <ThemedText key={index} style={styles.resultText}>
                  Part {part.number}
                </ThemedText>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 4/3,
    backgroundColor: '#000',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  marker: {
    position: 'absolute',
    width: 32,
    height: 32,
    backgroundColor: 'rgba(33, 150, 243, 0.8)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  markerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  results: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 8,
  },
});
