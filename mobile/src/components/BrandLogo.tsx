import React from 'react';
import { View, Text, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface BrandLogoProps {
  width?: number | string;
  height?: number | string;
  style?: StyleProp<ViewStyle>;
  variant?: 'full' | 'isotype';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  width = 160, 
  height = 140, 
  style,
  variant = 'full'
}) => {
  return (
    <View style={[styles.container, style]}>
      <Image 
        source={require('../../assets/logo_agro_intelligent.png')} 
        style={{ width, height } as any} 
        resizeMode="contain"
      />
      {variant === 'full' && (
        <View style={styles.textContainer}>
          <Text style={styles.title}>Agro Intelligence</Text>
          <Text style={styles.subtitle}>DATOS PARA UN CAMPO MÁS EFICIENTE</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: -24, // Pull text closer to compensate for image padding
  },
  title: {
    color: '#173F35',
    fontFamily: 'sans-serif', // Default to system sans-serif since we might not have Arial explicitly
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#2F6655',
    fontFamily: 'sans-serif',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 4,
  }
});
