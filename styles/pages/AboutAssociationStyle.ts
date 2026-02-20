import { Colors } from '@/constants/colors';
import {Platform, StyleSheet} from 'react-native'

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.black,
    flexShrink: 1,
  },

  
  scrollContent: {
    paddingBottom: 40,
  },

  // WEB
  scrollContentWeb: {
    width: "100%",
  },

  container: {
    flex: 1,
    padding: 16,

    ...(Platform.OS === 'web' && {
      width: '100%',
      maxWidth: 900,
    }),
  },

  content: {
    marginTop: 20,
    gap: 16,
  },

  card: {
    backgroundColor: Colors.orange,
    borderRadius: 12,
    padding: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.black,
  },

  text: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.black,
  },

  infoText: {
    fontSize: 16,
    marginBottom: 6,
    color: Colors.black,
  },

  label: {
    fontWeight: '600',
  },
});