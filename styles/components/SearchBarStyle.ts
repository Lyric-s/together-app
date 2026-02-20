import { StyleSheet, Platform } from "react-native";
import { Colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 10,
    gap: 10,
    zIndex: 1000,
    
    // Shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    
    maxWidth: '100%',
    width: '100%',
    alignSelf: 'center',
    marginVertical: 15,
  },

  input: {
    backgroundColor: Colors.grayToWhite,
    borderRadius: 20,
    height: 45,
    paddingHorizontal: 15,
    fontSize: 14,
    color: Colors.black,
    borderWidth: 0,
    
    flexGrow: 1,
    minWidth: 140,
  },

  flexContainer: {
    flexGrow: 1, // Prend l'espace disponible
    minWidth: 180, // Si l'écran est trop petit (< 180px dispo), ça passe à la ligne
    position: 'relative', // Nécessaire pour positionner la liste en absolu par rapport à ce champ
    zIndex: 2000, // Doit être plus haut que les voisins pour que la liste passe dessus
  },

  pickerContainer: {
    padding: 0,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 0,
    flexGrow: 1,
    minWidth: 140,
    alignItems: 'center'
  },

  picker: {
    width: '90%',
    height: '100%',
    color: Colors.black,
    backgroundColor: 'transparent',
    borderWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        border: 'none',
        cursor: 'pointer',
      } as any
    })
  },

  resetButton: {
    padding: 8,
    backgroundColor: Colors.whiteLittleGray,
    borderRadius: 20,
    marginRight: 10,
  },
  resetText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.gray,
  },
  searchIcon: {
    width: 28,
    height: 28,
    tintColor: Colors.orange,
  },
  suggestionsContainer: {
  position: 'absolute',
  top: '100%', // Just below the input
  marginTop: 5,
  left: 0,
  right: 0,
  backgroundColor: 'white',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: Colors.grayToWhite,
  zIndex: 9999, // Important for overlay
  maxHeight: 200,
  ...Platform.select({
    ios: {
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3.84,
    },
    android: {
      elevation: 10,
    },
  }),
},
suggestionItem: {
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#F0F0F0',
},
suggestionText: {
  color: Colors.black,
  fontSize: 14,
},
});