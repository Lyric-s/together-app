import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: Colors.white,
  },
  mainText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 100,
    marginBottom: 20,
    color: Colors.black,
  },
});