import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 120,
    paddingHorizontal: 20,
    paddingTop: 20,
    flexGrow: 1, // Permet de centrer le contenu si besoin
  },
  
  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gearIcon: {
    marginLeft: 10,
  },
  headerTitleContainer: {
    backgroundColor: '#FFE5D6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    marginLeft: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  // --- Contenu Contact ---
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF0F0', // Fond léger
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  
  // Carte Email
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEE',
    width: '100%',
  },
  contactTextContainer: {
    marginLeft: 15,
  },
  contactLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  // Wrapper nav
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});