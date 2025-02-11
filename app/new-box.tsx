import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { storage } from '../utils/storage';
import { Box } from '../types/box';

export default function NewBoxScreen() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Reset name when component mounts
  useEffect(() => {
    setName('');
  }, []);

  const handleCreate = async () => {
    setError(''); // Clear any previous errors
    if (!name.trim()) {
      setError('Please enter a box name');
      return;
    }

    try {
      const newBox: Box = {
        id: Date.now().toString(), // Simple ID generation
        name: name.trim(),
        status: 'active',
        createdAt: new Date(),
        lastAccessed: new Date(),
        sprues: [],
      };

      await storage.saveBox(newBox);
      await storage.setActiveBoxId(newBox.id);
      
      // Navigate back to the boxes list
      router.push('/');
    } catch (err) {
      setError('Failed to create box. Please try again.');
      console.error('Error creating box:', err);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Create New Box</ThemedText>
        
        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Box Name</ThemedText>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError(''); // Clear error when user types
            }}
            placeholder="Enter box name"
            placeholderTextColor="#999"
            autoFocus
          />
          {error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.createButton, !name.trim() && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={!name.trim()}
          >
            <ThemedText style={styles.createButtonText}>Create Box</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorText: {
    color: '#f44336',
    marginTop: 8,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  createButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#2196f3',
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#90caf9',
  },
  createButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
