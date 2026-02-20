import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 100, // Espace pour la barre de navigation
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  // Header Styles
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
    backgroundColor: '#FFE5D6', // Couleur pêche clair
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    flex: 1,
    marginLeft: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  // Menu Styles
  menuContainer: {
    marginBottom: 30,
  },
  menuButton: {
    backgroundColor: '#9999E6', // Le violet de l'image
    borderRadius: 30, // Très arrondi
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  iconContainer: {
    marginRight: 15,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },

  // Logout Styles
  logoutButton: {
    backgroundColor: '#EF3333', // Rouge vif
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#D90429', // Un rouge plus sombre pour la suppression
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginTop: 15,
  },

  // Bottom Nav Wrapper
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});