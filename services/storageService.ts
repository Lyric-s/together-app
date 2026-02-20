import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageService = {
  saveTokens: async (access: string, refresh: string) => {
    try {
      await AsyncStorage.multiSet([
        ['access_token', access],
        ['refresh_token', refresh]
      ]);
    } catch (error) {
      console.error('Failed to save tokens:', error);
      throw error;
    }
  },
  getAccessToken: () => AsyncStorage.getItem('access_token'),
  getRefreshToken: () => AsyncStorage.getItem('refresh_token'),
  
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      throw error;
    }
  },
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      throw error;
    }
  },
  
  clear: async () => {
    try {
      const keys = ['access_token', 'refresh_token', 'cached_user', 'user_type'];
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
      throw error;
    }
  },
};