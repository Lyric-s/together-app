// styles/pages/LanguageAccessibility.styles.ts
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
  },
  
  // --- Header (Identique à PageReglages) ---
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

  // --- Titre de la page ---
  pageTitle: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
  },

  // --- Formulaire ---
  formContainer: {
    gap: 25, // Espacement vertical entre les éléments
  },
  fieldGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    fontWeight: '400',
  },
  
  // Styles pour les Pickers (Menus déroulants)
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    backgroundColor: '#FFF',
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: 50,
  },

  // Contrôle Taille du texte
  textSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  sizeButton: {
    padding: 5,
  },
  sizeIndicator: {
    flex: 1,
    height: 4,
    backgroundColor: '#FF6B35', // Barre orange
    borderRadius: 2,
  },

  // Checkbox Thème sombre
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  checkboxContainer: {
    padding: 5,
  },

  // Wrapper pour la barre de nav
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});