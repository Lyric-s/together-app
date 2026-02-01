import * as React from "react";
import { View, StyleSheet} from "react-native";
import { Text } from '@/components/ThemedText';
import { Colors } from "../constants/colors";

// -------- component C13 Category Label
type Props = {
  text: string;
  backgroundColor: string;      
};

export default function CategoryLabel({
  text,
  backgroundColor,
}: Props) {
  return (
    <View
      style={[styles.container, { backgroundColor }]}
    >
      <Text style={[styles.text]} numberOfLines={1} ellipsizeMode="tail">
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    margin: 10,
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: Colors.black, 
    fontSize: 14,
    fontWeight: "600",
  },
});
