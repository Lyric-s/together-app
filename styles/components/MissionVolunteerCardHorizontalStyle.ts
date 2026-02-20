import { Colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'stretch', 
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  leftContainer: {
    position: 'relative',
    width: 230,
    height: 130,
    marginRight: 15, 
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  categoryLabelOverlay: {
    position: 'absolute',
    top: -2,
    left: -2,
    zIndex: 1,
  },
  heartButtonOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fond semi-transparent pour le contraste
    borderRadius: 20,
    padding: 5,
  },
  heartIcon: {
    width: 24,
    height: 24,
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentTop: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 5,
  },
  association: {
    fontSize: 13,
    color: Colors.gray,
    marginBottom: 2,
    fontStyle: 'italic',
  },
  date: {
    fontSize: 13,
    color: Colors.black,
    marginBottom: 2,
  },
  city: {
    fontSize: 13,
    color: Colors.black,
  },
  peopleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.orange,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  peopleIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  peopleText: {
    fontWeight: '600',
    fontSize: 14,
    color: Colors.black,
  },
});
