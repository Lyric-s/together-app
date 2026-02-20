import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    // padding: 10,
  },

  /** TOP BAR */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  input: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
  },

  iconButton: {
    padding: 6,
  },

  icon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },

  /** FILTER TAGS */
  activeFiltersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },

  filterTag: {
    backgroundColor: Colors.lightOrange,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    margin: 3,
  },

  filterText: {
    color: Colors.black,
  },

  /** FILTER PANEL */
  filtersPanel: {
    marginTop: 10,
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  filterTitle: {
    fontWeight: "bold",
    marginTop: 10,
  },

  filterInput: {
    backgroundColor: Colors.darkerWhite,
    borderRadius: 8,
    padding: 8,
    marginTop: 5,
  },

  cityList: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginTop: 5,
  },

  cityItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Colors.white,
  },

  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },

  categoryButton: {
    backgroundColor: Colors.darkerWhite,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    margin: 4,
  },

  categoryButtonSelected: {
    backgroundColor: Colors.brightOrange,
  },

  categoryText: {
    color: Colors.black,
  },

  datePickerButton: {
    marginTop: 5,
    backgroundColor: Colors.darkerWhite,
    padding: 10,
    borderRadius: 10,
  },

  datePickerText: {
    color: Colors.black,
  },

  resetButton: {
    marginTop: 15,
    backgroundColor: Colors.brightOrange,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  resetButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },

});
