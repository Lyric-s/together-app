import { StyleSheet } from 'react-native';
import { Colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },

  // ===== STYLES MOBILE =====
  headerMobile: {
    backgroundColor: Colors.white,
    padding: 10,
  },
  logoContainer: {
    alignItems: 'center',
  },
  cardWrapper: {
    marginBottom: 16,
  },
  sectionMobile: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.brightOrange,
  },
  ctaSectionMobile: {
    backgroundColor: Colors.veryLightOrange,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.brightOrange,
  },
  ctaSectionLavender: {
    backgroundColor: Colors.white,
    borderColor: Colors.lavender,
  },
  ctaTitleMobile: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaDescriptionMobile: {
    fontSize: 14,
    color: Colors.grayPlaceholder,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    color: Colors.brightOrange,
  },
  ctaButtonMobile: {
    backgroundColor: Colors.brightOrange,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaButtonLavender: {
    backgroundColor: Colors.inputBackground,
  },
  ctaButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.darkerWhite,
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 24,
    opacity: 0.5,
  },
  navIconActive: {
    fontSize: 24,
    color: Colors.brightOrange,
  },

  // ===== STYLES WEB =====
  sectionWeb: {
    padding: 40,
  },
  sectionTitleWeb: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 24,
  },
  missionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  missionCardWeb: {
    width: 300,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  missionImageWeb: {
    width: '100%',
    height: 180,
  },
  categoryBadgeWeb: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.brightOrange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryTextWeb: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  missionTitleWeb: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
  },
  missionDateWeb: {
    fontSize: 14,
    color: Colors.grayPlaceholder,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  participantsIcon: {
    fontSize: 16,
  },
  participantsText: {
    fontSize: 14,
    color: Colors.grayPlaceholder,
  },
  detailLink: {
    color: Colors.brightOrange,
    fontSize: 14,
    fontWeight: '600',
  },
  ctaSectionWeb: {
    backgroundColor: Colors.veryLightOrange,
    padding: 60,
    marginHorizontal: 40,
    marginBottom: 40,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.brightOrange,
    alignItems: 'center',
  },
  ctaTitleWeb: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 16,
    textAlign: 'center',
    maxWidth: 700,
  },
  ctaDescriptionWeb: {
    fontSize: 16,
    color: Colors.grayPlaceholder,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
    maxWidth: 700,
  },
  ctaButtonWeb: {
    backgroundColor: Colors.brightOrange,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  ctaButtonBlueWeb: {
    backgroundColor: Colors.inputBackground,
  },
  ctaButtonTextWeb: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});