import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/colors';

export const styles = StyleSheet.create({
  footer: {
    backgroundColor: Colors.modernGray,
    borderTopWidth: 1,
    borderTopColor: Colors.grayToWhite,
    paddingTop: 20,
    width: '100%',
    alignSelf: 'stretch',
  },
  
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingHorizontal: 40,
    paddingBottom: 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    flexWrap: 'wrap',
    gap: 20,
  },

  contentContainerMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 25,
  },

  section: {
    minWidth: 150,
    alignItems: Platform.OS === 'web' ? 'flex-start' : 'center',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.8,
  },

  linksGroup: {
    gap: 6,
    alignItems: Platform.OS === 'web' ? 'flex-start' : 'center',
  },

  link: {
    fontSize: 13,
    color: Colors.grayText,
    marginBottom: 2,
  },

  linkHover: {
    color: Colors.orange,
    textDecorationLine: 'underline',
  },

  contactText: {
    fontSize: 13,
    color: Colors.grayText,
    marginBottom: 2,
  },

  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: Colors.whiteLittleGray,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.modernMoreGray,
    width: '100%',
  },

  copyright: {
    fontSize: 11,
    color: Colors.grayText,
  },
});