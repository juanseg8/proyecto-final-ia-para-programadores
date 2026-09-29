import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export const AppCard = ({ title, children, style, contentStyle }: { title?: string; children: React.ReactNode; style?: any; contentStyle?: any }) => {
  return (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg, // 16
    marginBottom: theme.spacing.lg, // 16
    backgroundColor: theme.colors.neutral[0],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    // Subtle shadow instead of strong ones
    shadowColor: theme.colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  title: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight as any, // 600
    color: theme.colors.neutral[900],
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  content: {
    padding: theme.spacing.lg,
  },
});
