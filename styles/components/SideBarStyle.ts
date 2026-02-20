import { StyleSheet, Dimensions  } from "react-native";
import { Colors } from "@/constants/colors";
import { useWindowDimensions } from "react-native";

export const getStyles = (screenWidth: number) => {

  return StyleSheet.create({

    burgerButton: {
      position: "absolute",
      top: 20,
      left: 20,
      zIndex: 1000,
      padding: 10,
      backgroundColor: Colors.purpleBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.white,
    },

    burger: {
      fontSize: 22, 
      color: Colors.white ,
    },

    sidebar: {
      width: "20%",
      height: "100%",
      minWidth: 280,
      backgroundColor: Colors.purpleBackground,
      paddingLeft: 20,
      paddingVertical: 10,
      justifyContent: "space-between",
    },

    reducedSideBar: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 999,
      elevation: 10,
    },

    titleRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    logo: {
      width: 80,
      height: 80,
      marginRight: 10,
      marginLeft: 0,
    },

    title: {
      fontSize:
        screenWidth > 1200 ? 26 :
        screenWidth > 800  ? 22 :
                            18,
      fontWeight: "600",
      color: Colors.white,
    },

    profileRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 20,
      marginTop: 10,
      marginLeft: 10,
    },

    userName: {
      fontSize: 18,
      color: "white",
      fontWeight: "500",
    },

    sectionTitle: {
      color: Colors.lavender,
      fontWeight: "bold",
      marginBottom: 10,
      marginTop: 20,
      marginLeft: 15,
    },

    button: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingLeft: 14,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
    },

    activeButton: {
      backgroundColor: Colors.brightOrange,
    },

    buttonIcon: {
      width: 22,
      height: 22,
      marginRight: 10,
      marginLeft: 20,
    },

    buttonLabel: {
      color: Colors.white,
      fontSize: 16,
    },
  });
};
