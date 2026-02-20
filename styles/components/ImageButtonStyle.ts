import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightOrange,
    padding: 5,
    width: 200,
    height: 50,
    borderRadius: 30,
    //alignSelf: "flex-start",
    justifyContent: 'center',
  },
  icon: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
});
