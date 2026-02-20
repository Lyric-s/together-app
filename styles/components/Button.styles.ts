import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export default StyleSheet.create({
    button: {
        marginTop: 10,
        alignSelf: 'center',
        width: '60%',
        maxWidth: 260,
        minWidth: 150,
        height: 50,
        borderRadius: 30,
        backgroundColor: Colors.orange,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: '500',
    },
});