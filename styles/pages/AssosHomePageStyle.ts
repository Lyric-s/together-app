import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.white,
    padding: 20,
    gap: 20,
  },

  /* COLUMNS */
  leftColumn: {
    width: "35%",
    minWidth: 400,
  },
  rightColumn: {
    width: "65%",
    minWidth: 200,
  },

  /* TITLES */
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 20,
  },
  columnTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 15,
  },

  /* NOTIFICATIONS */
  section: {
    marginBottom: 10,
  },
  notificationCard: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    marginRight: 30,
  },

  notificationText: {
    fontSize: 15,
    color: Colors.black,
  },

  notifInfo: {
    backgroundColor: Colors.lavender,
  },
});
