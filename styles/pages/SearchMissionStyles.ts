import { Colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingTop: 14,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.black,
  },

  pageSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: Colors.grayPlaceholder,
    marginBottom: 12,
  },

  searchRow: {
    width: "100%",
    marginBottom: 10,
  },

  locationBanner: {
    width: "100%",
    backgroundColor: "#FFF3E6",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  locationDot: {
    color: Colors.orange,
    fontSize: 12,
  },

  locationText: {
    color: Colors.black,
    fontSize: 12.5,
  },

  locationChange: {
    color: Colors.orange,
    fontWeight: "700",
    fontSize: 12.5,
    marginLeft: 4,
  },

  listContainer: {
    paddingBottom: 30,
  },

  sectionHeaderRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  sectionIcon: {
    fontSize: 18,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.black,
  },

  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  sortLabel: {
    fontSize: 12.5,
    color: Colors.grayPlaceholder,
  },

  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },

  sortButtonText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: Colors.black,
  },

  sortChevron: {
    fontSize: 11,
    color: Colors.grayPlaceholder,
  },

  nearGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 10,
  },

  pagination: {
    marginTop: 16,
    paddingVertical: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  paginationArrow: {
    fontSize: 16,
    color: Colors.black,
  },

  paginationText: {
    fontSize: 12.5,
    color: Colors.grayPlaceholder,
  },
});
