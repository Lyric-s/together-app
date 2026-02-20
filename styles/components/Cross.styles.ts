import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export default StyleSheet.create({
    container: {
        position: 'absolute',
        top: 24,
        left: 24,
        zIndex: 20,
    },

    button: {
        padding: 6,
    },

    icon: {
        width: 24,
        height: 24,
        tintColor: Colors.violet, // identique à ton design actuel
    },
});
