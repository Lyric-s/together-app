import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors'

export const styles =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.black,
        marginBottom: 10,
    },
    label: {
        fontWeight: "600",
        marginTop: 10,
        marginBottom: 10,
        color: Colors.black,
    },
    text: {
        fontSize: 14,
        marginBottom: 20,
        color: Colors.grayText,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
        marginTop: 10,
        borderRadius: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.whiteLittleGray,
        borderRadius: 8,
        padding: 8,
        marginTop: 5,
        marginBottom: 20,
        fontSize: 14,
        width: '100%',
    },
    dropDownStyle: {
        backgroundColor: Colors.white,  // fond gris clair pour la liste déroulante
        borderRadius: 8,
    },
    placeholderStyle: {
        fontSize: 14,
        color: Colors.grayPlaceholder,
    },
    labelStyle: {
        fontSize: 14,
        color: Colors.black,
    },
    button: {
        backgroundColor: Colors.orange,
        padding: 8,
        marginTop: 20,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 10,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    buttonAction: {
        backgroundColor: Colors.orange,
        padding: 15,
        marginTop: 20,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 10,
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.darkerWhite
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "90%",
        maxHeight: '80%' 
    },
    icon: {
        width: 28,
        height: 28,
        marginRight: 8,
    },
    searchBar: {
        height: 40,
        borderColor: Colors.whiteLittleGray,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 14,
        marginTop: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    benevoleText: {
        fontSize: 16,
    },
    croixCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        marginLeft: 50,
        borderColor: Colors.violet,
        justifyContent: 'center',
        alignItems: 'center',
    },
    croixText: {
        fontSize: 20,
        lineHeight: 18,
        color: Colors.violet,
    },
    separator: {
        height: 0.5,
        backgroundColor: Colors.gray,
    },
});