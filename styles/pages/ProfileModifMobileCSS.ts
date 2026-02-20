import { Colors } from "@/constants/colors";
import {StyleSheet,} from "react-native";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  /* HEADER */
  headerMobile: {
      backgroundColor: Colors.white,
      padding: 10,
  },
  logoContainer: {
      alignItems: 'center',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  editIcon: {
    width: 34,
    height: 34,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.black,
    marginLeft: 10,
    backgroundColor: Colors.lavender,
    padding: 15, 
    borderRadius : 10,
  },
  backBtn: {
    marginRight: 15,
    padding: 5,
  },
  title: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  /* FORM */
  form: {
    width: "100%",
    marginTop: 30,
    gap: 15,
  },
  inputContainer: {
    backgroundColor: Colors.violet,
    borderRadius: 12,
    padding: 12,
  },
  label: {
    fontSize: 12,
    color: Colors.white,
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    color: Colors.white,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  
  /* BUTTONS */
  editButtons: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  formContainer: {
    alignItems: "center",
  },
  buttonContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
});


