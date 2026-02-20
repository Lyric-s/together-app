import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  headerMobile: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoContainer: {
    width: 50, height: 50,
    borderRadius: 25, backgroundColor: Colors.white,
    justifyContent: 'center', alignItems: 'center',
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: Platform.OS === 'web' ? 'left' : 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: Colors.black,
  },
  emptyText: {
    color: 'gray',
    fontStyle: 'italic',
  },
});