import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, onBack, showBack, rightAction }) => {
  return (
    <View style={styles.container}>
      {showBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          testID="back-button"
          accessibilityLabel="Volver"
          accessibilityRole="button"
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title} accessibilityRole="header" numberOfLines={1}>
        {title}
      </Text>
      {rightAction ? (
        <View style={styles.rightAction}>{rightAction}</View>
      ) : (
        <View style={styles.rightPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    height: 60,
    paddingHorizontal: theme.spacing[16],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[8],
  },
  backText: {
    fontSize: 28,
    lineHeight: 32,
    color: theme.colors.forest,
    fontWeight: '300',
  },
  title: {
    flex: 1,
    ...theme.typography.h3,
    color: theme.colors.forest,
  },
  rightAction: {
    marginLeft: theme.spacing[8],
  },
  rightPlaceholder: {
    width: 36,
  },
});


