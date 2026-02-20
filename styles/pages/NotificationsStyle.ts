import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120, // Plus d'espace pour laisser défiler le bouton au-dessus de la nav bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
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
    paddingHorizontal: 25,
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
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
    color: '#000',
  },
  section: {
    marginBottom: 35,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: '#000000',
  },
  radioUnselected: {
    backgroundColor: '#D1D1EF',
  },
  radioLabel: {
    fontSize: 15,
    color: '#000',
  },
  // Styles pour le bouton de validation
  validateButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  validateButton: {
    backgroundColor: '#FF6B35', // Orange cohérent avec le header
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  validateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
  }
});