import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors'

export const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: Colors.white, },
  mainTitle: { 
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.black, 
    marginBottom: 4 
},

  subtitle: { fontSize: 14, marginBottom: 20 },
  
  card: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 12 },

  label: { fontSize: 15, marginBottom: 6 },

  input: {
    backgroundColor: Colors.darkerWhite,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },

  textArea: { height: 90 },
  row: { flexDirection: "row", gap: 15 },
  half: { flex: 1 },

  pickerContainer: {
    marginBottom: 15,
    width: "20%",
    minWidth: 200,
  },

  picker: {
    height: 40,
    width: "100%",
    borderRadius: 8,
    backgroundColor: Colors.darkerWhite,
  },

  imageButton: {
    width: "20%",
    minWidth: 250,
    backgroundColor: Colors.brightOrange,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },

  imageButtonText: { 
    fontWeight: "600",
    color: Colors.white,
 },

  buttonsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },


  publishButton: {
    backgroundColor: Colors.brightOrange,
    padding: 12,
    borderRadius: 8,
    width: "30%",
  },

  publishText: { textAlign: "center", color: Colors.white, fontWeight: "600" },

  requiredInfo: { marginTop: 10, fontStyle: "italic", fontSize: 12 },
});