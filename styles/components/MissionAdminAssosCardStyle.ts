import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  card: {
    // width: isLargeScreen?"30%":"100%",
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginVertical: 12,
    marginHorizontal: 12,
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    width: 350,
  },

  imageContainer: {
    borderRadius: 12,
    width: "95%",
    height: 150,
    alignSelf: 'center',
    marginTop: 10,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginTop: 5,
    position: 'relative',
  },

  textContainer: {
    flex: 1,
    paddingRight: 20,
    paddingLeft: 5,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
  },

  association: {
    fontSize: 14,
    color: Colors.black,
    marginTop: 2,
  },

  date: {
    fontSize: 13,
    color: Colors.black,
    marginTop: 4,
  },

  detailButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: Colors.brightOrange,
    paddingVertical: 12,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },

  detailButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
});
