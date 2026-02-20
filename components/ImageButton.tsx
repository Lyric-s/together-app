import { TouchableOpacity, Image, Text, ViewStyle, ImageStyle } from "react-native";
import { styles } from "@/styles/components/ImageButtonStyle";

//  -------------- Component C16
interface CustomButtonProps {
  image: any;           
  onPress?: () => void; 
  style?: ViewStyle;
  styleIcon?: ImageStyle;
}

export default function CustomButton({ image, onPress, style, styleIcon }: CustomButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Image source={image} style={[styles.icon, styleIcon]} />
      {<Text style={styles.label}></Text>}
    </TouchableOpacity>
  );
}

