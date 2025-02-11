import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { storage } from '../../utils/storage';
import { detectPartNumbers, detectSprueLetter } from '../../utils/ocr';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    checkActiveBox();
  }, []);

  const checkActiveBox = async () => {
    const activeBox = await storage.getActiveBox();
    if (!activeBox) {
      Alert.alert(
        'No Active Box',
        'Please select or create a box before capturing sprues.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/'),
          },
        ]
      );
      return;
    }
    setIsReady(true);
  };

  if (hasPermission === null) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Requesting camera permission...</ThemedText>
      </ThemedView>
    );
  }

  if (hasPermission === false) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.text}>
          We need camera permission to capture sprue images.
        </ThemedText>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
          }}
        >
          <ThemedText style={styles.buttonText}>Grant Permission</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (!isReady) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  const takePicture = async () => {
    try {
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;

      // Show processing indicator
      Alert.alert('Processing', 'Analyzing sprue image...');

      // Process the image (perspective correction would go here in the future)
      const processedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [
          { resize: { width: 1200 } }, // Standardize size while maintaining aspect ratio
        ],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      // Get active box
      const activeBox = await storage.getActiveBox();
      if (!activeBox) {
        Alert.alert('Error', 'No active box found');
        return;
      }

      try {
        // Detect parts and sprue letter using OCR
        const [detectedParts, sprueLetter] = await Promise.all([
          detectPartNumbers(processedImage.uri),
          detectSprueLetter(processedImage.uri),
        ]);

        // Add the sprue to the active box
        const newSprue = {
          id: Date.now().toString(),
          imageUri: processedImage.uri,
          letter: sprueLetter || undefined,
          parts: detectedParts.map(({ number, location }) => ({
            number,
            locations: [location],
          })),
        };

        const updatedBox = {
          ...activeBox,
          sprues: [...activeBox.sprues, newSprue],
        };

        await storage.saveBox(updatedBox);

        // Show detection results
        const partsCount = detectedParts.length;
        const letterInfo = sprueLetter ? ` as Sprue ${sprueLetter}` : '';
        Alert.alert(
          'Success',
          `Image captured${letterInfo}. Found ${partsCount} part number${partsCount !== 1 ? 's' : ''}. Would you like to capture another?`,
          [
            {
              text: 'Yes',
              style: 'default',
            },
            {
              text: 'No',
              onPress: () => router.push('/'),
              style: 'cancel',
            },
          ]
        );
      } catch (ocrError) {
        console.error('OCR Error:', ocrError);
        Alert.alert(
          'Warning',
          'Image saved but part detection failed. You may need to manually add part numbers.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.instructions}>
          Tap the button below to take a picture of your sprue.
          Make sure the sprue is well-lit and all part numbers are clearly visible.
        </ThemedText>

        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => {
            // @ts-ignore - Expo Router type issue
            router.push('/test-ocr');
          }}
        >
          <ThemedText style={styles.testButtonText}>
            Test OCR
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
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
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2196f3',
  },
  testButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 20,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
