import { Text, View, TouchableOpacity, Image } from "react-native";
import { styles } from '@/styles/pages/ChangeMissionCSS'
import { useNavigation } from '@react-navigation/native'

// -------- component C12 BackButton
type Props = {
  name_page: string;     
};

export default function BackButton({
  name_page,
}: Props) {
    const navigation = useNavigation();

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row'}}>
                <Image
                    source={require('@/assets/images/back.png')}
                    style={styles.icon}
                />
                <Text style={ [styles.title, {marginLeft: -10}]}>{name_page}</Text>
            </TouchableOpacity>
        </View>
    );
}