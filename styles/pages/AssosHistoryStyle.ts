import { Colors } from '@/constants/colors';
import {
  StyleSheet,
} from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  container: {
    flex: 1,
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 24,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20, 
  },

  emptyText: {
    fontSize: 16,
    color: Colors.black,
    marginTop: 40,
  },
});
