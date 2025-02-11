import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Link, useRouter } from 'expo-router';
import { Box } from '../../types/box';
import { storage } from '../../utils/storage';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function BoxesScreen() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const router = useRouter();

  const loadBoxes = useCallback(async () => {
    const allBoxes = await storage.getBoxes();
    const currentActiveBoxId = await storage.getActiveBoxId();
    const filteredBoxes = allBoxes
      .filter(box => showCompleted || box.status !== 'completed')
      .sort((a, b) => a.name.localeCompare(b.name));
    setBoxes(filteredBoxes);
    setActiveBoxId(currentActiveBoxId);

    // If there are no active boxes and we're not showing completed, redirect to new box creation
    if (filteredBoxes.length === 0 && !showCompleted && allBoxes.some(box => box.status !== 'completed')) {
      router.push('/new-box');
    }
  }, [router, showCompleted]);

  useEffect(() => {
    loadBoxes();
  }, [loadBoxes]);

  const handleDeleteBox = async (box: Box) => {
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
              const isActive = box.id === activeBoxId;
              await storage.deleteBox(box.id);
              
              if (isActive) {
                // If we deleted the active box, go back to the box list
                router.push('/');
              } else {
                // Otherwise just refresh the list
                loadBoxes();
              }
            } catch (error) {
              console.error('Error deleting box:', error);
              Alert.alert('Error', 'Failed to delete box. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderRightActions = (box: Box) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteBox(box)}
      >
        <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
      </TouchableOpacity>
    );
  };

  const renderLeftActions = (box: Box) => {
    return (
      <TouchableOpacity
        style={styles.completeButton}
        onPress={async () => {
          try {
            const updatedBox = {
              ...box,
              status: box.status === 'completed' ? 'active' as const : 'completed' as const
            };
            await storage.saveBox(updatedBox);
            loadBoxes();
          } catch (error) {
            console.error('Error updating box status:', error);
            Alert.alert('Error', 'Failed to update box status');
          }
        }}
      >
        <ThemedText style={styles.completeButtonText}>
          {box.status === 'completed' ? 'Reactivate' : 'Complete'}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  if (boxes.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Welcome to Part Finder</ThemedText>
        <ThemedText style={styles.description}>
          Let's get started by creating your first box
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <ThemedText style={styles.title}>Your Boxes</ThemedText>
          <Link href="/new-box" asChild>
            <TouchableOpacity style={styles.addButton}>
              <ThemedText style={styles.addButtonText}>Add Box</ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <FlatList
        ListFooterComponent={() => (
          <TouchableOpacity
            style={styles.showCompletedButton}
            onPress={() => setShowCompleted(!showCompleted)}
          >
            <ThemedText style={styles.showCompletedText}>
              {showCompleted ? '← Back to Active Boxes' : 'Show Completed Boxes'}
            </ThemedText>
          </TouchableOpacity>
        )}
        data={boxes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => renderRightActions(item)}
            renderLeftActions={() => renderLeftActions(item)}
            overshootRight={false}
            overshootLeft={false}
          >
            <Link
              href={`/(box)/${item.id}`}
              asChild
              onPress={async () => {
                await storage.setActiveBoxId(item.id);
                const updatedBox = {
                  ...item,
                  lastAccessed: new Date(),
                };
                await storage.saveBox(updatedBox);
                loadBoxes();
              }}
            >
              <TouchableOpacity
                style={[
                  styles.boxCard,
                  activeBoxId === item.id && styles.activeBoxCard,
                ]}
              >
                <ThemedText style={styles.boxName}>{item.name}</ThemedText>
                {item.status === 'completed' && (
                  <ThemedText style={styles.completedText}>
                    Completed
                  </ThemedText>
                )}
              </TouchableOpacity>
            </Link>
          </Swipeable>
        )}
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  showCompletedButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  showCompletedText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 32,
  },
  list: {
    gap: 12,
  },
  boxCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  activeBoxCard: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 2,
  },
  boxName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  completedText: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '500',
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
});
