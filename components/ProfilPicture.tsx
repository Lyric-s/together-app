import React from 'react';
import { Image, StyleSheet, View, ImageSourcePropType } from 'react-native';
import { Colors } from "../constants/colors";

// ------------- Component C11
// how to use : <ProfilePicture uri={require('../assets/images/profil-picture.png')} size={120} />

interface ProfilePictureProps {
  source: ImageSourcePropType;
  size?: number;
}

export default function ProfilePicture({ source, size = 100 }: ProfilePictureProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={ source }
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden', 
    backgroundColor: Colors.grayPlaceholder, // fallback if the image doesnt load
  },
});
