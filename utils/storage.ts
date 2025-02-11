import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box } from '../types/box';

const BOXES_KEY = '@boxes';
const ACTIVE_BOX_ID_KEY = '@activeBoxId';

export const storage = {
  async saveBox(box: Box): Promise<void> {
    try {
      const boxes = await this.getBoxes();
      const existingIndex = boxes.findIndex(b => b.id === box.id);
      
      if (existingIndex >= 0) {
        boxes[existingIndex] = box;
      } else {
        boxes.push(box);
      }
      
      await AsyncStorage.setItem(BOXES_KEY, JSON.stringify(boxes));
    } catch (error) {
      console.error('Error saving box:', error);
      throw error;
    }
  },

  async getBoxes(): Promise<Box[]> {
    try {
      const boxesJson = await AsyncStorage.getItem(BOXES_KEY);
      return boxesJson ? JSON.parse(boxesJson) : [];
    } catch (error) {
      console.error('Error getting boxes:', error);
      throw error;
    }
  },

  async getActiveBoxes(): Promise<Box[]> {
    try {
      const boxes = await this.getBoxes();
      return boxes.filter(box => box.status === 'active');
    } catch (error) {
      console.error('Error getting active boxes:', error);
      throw error;
    }
  },

  async deleteBox(id: string): Promise<void> {
    try {
      const boxes = await this.getBoxes();
      const filteredBoxes = boxes.filter(box => box.id !== id);
      await AsyncStorage.setItem(BOXES_KEY, JSON.stringify(filteredBoxes));
      
      // If this was the active box, clear the active box ID
      const activeBoxId = await this.getActiveBoxId();
      if (activeBoxId === id) {
        await this.setActiveBoxId(null);
      }
    } catch (error) {
      console.error('Error deleting box:', error);
      throw error;
    }
  },

  async setActiveBoxId(id: string | null): Promise<void> {
    try {
      if (id) {
        await AsyncStorage.setItem(ACTIVE_BOX_ID_KEY, id);
      } else {
        await AsyncStorage.removeItem(ACTIVE_BOX_ID_KEY);
      }
    } catch (error) {
      console.error('Error setting active box:', error);
      throw error;
    }
  },

  async getActiveBoxId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ACTIVE_BOX_ID_KEY);
    } catch (error) {
      console.error('Error getting active box:', error);
      throw error;
    }
  },

  async getActiveBox(): Promise<Box | null> {
    try {
      const activeBoxId = await this.getActiveBoxId();
      if (!activeBoxId) return null;
      
      const boxes = await this.getBoxes();
      return boxes.find(box => box.id === activeBoxId) || null;
    } catch (error) {
      console.error('Error getting active box:', error);
      throw error;
    }
  }
};
