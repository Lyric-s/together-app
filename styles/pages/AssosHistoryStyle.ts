import { Colors } from '@/constants/colors';
import {
  StyleSheet,
} from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkerWhite,
  },

  container: {
    flex: 1,
    padding: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: '600',
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
