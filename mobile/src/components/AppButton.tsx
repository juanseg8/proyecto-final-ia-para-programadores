import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator, View } from 'react-native';
import { theme } from '../theme/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

export interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: any;
  textStyle?: any;
  rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const AppButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  rightIcon,
  ...props
}: AppButtonProps) => {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  
  const getBackgroundColor = () => {
    if (isOutline || isGhost) return 'transparent';
    if (disabled) return theme.colors.neutral[300];
    switch (variant) {
      case 'secondary': return theme.colors.primary[50];
      case 'destructive': return theme.colors.semantic.error;
      default: return theme.colors.primary[800]; // Dark green as per reference
    }
  };

  const getTextColor = () => {
    if (disabled && !isOutline && !isGhost) return theme.colors.neutral[500];
    if (disabled && (isOutline || isGhost)) return theme.colors.neutral[400];
    switch (variant) {
      case 'secondary': return theme.colors.primary[700];
      case 'outline': return theme.colors.neutral[800];
      case 'ghost': return theme.colors.neutral[800];
      case 'destructive': return theme.colors.neutral[0];
      default: return theme.colors.neutral[0]; 
    }
  };

  const getBorderColor = () => {
    if (isOutline) return disabled ? theme.colors.neutral[300] : theme.colors.neutral[300];
    return 'transparent';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: isOutline ? 1 : 0,
        },
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
          {rightIcon && (
            <MaterialCommunityIcons name={rightIcon} size={20} color={getTextColor()} style={styles.rightIcon} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: theme.typography.fontSize.lg || 18,
    fontWeight: '500',
  },
  rightIcon: {
    marginLeft: theme.spacing.sm,
  }
});
