// styles/pages/LanguageAccessibility.styles.ts
import { Colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.veryLightOrange,
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
    color: Colors.black,
  },

  // --- Titre de la page ---
  pageTitle: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 30,
    color: Colors.black,
  },

  // --- Formulaire ---
  formContainer: {
    gap: 25,
  },
  fieldGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: Colors.black,
    marginBottom: 10,
    fontWeight: '400',
  },
  
  // Styles pour les Pickers (Menus déroulants)
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 4,
    backgroundColor: Colors.white,
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