import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  card: {
    width: 350,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 5,
    marginHorizontal: 5,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    overflow: "hidden",
  },

  imageContainer: {
    width: "100%",
    height: 140,
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  categoryLabel: {
    position: "absolute",
  },

  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },

  heartIcon: {
    width: 32,
    height: 32,
  },

  content: {
    padding: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  association: {
    fontSize: 14,
    color: Colors.black,
  },

  date: {
    fontSize: 14,
    marginTop: 4,
    color: Colors.black,
  },

  city: {
    marginTop: 3,
    fontSize: 14,
    color: Colors.black,
  },

  peopleContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  peopleIcon: {
    width: 32,
    height: 32,
  },

  peopleText: {
    fontWeight: "600",
    fontSize: 14,
  },
});