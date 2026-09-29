import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AppHeader = ({ title, showBack = false, rightElement }: { title: string; showBack?: boolean; rightElement?: React.ReactNode }) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {showBack ? (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButtonPlaceholder} />
      )}
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
      {rightElement ? (
        <View style={styles.rightElementContainer}>{rightElement}</View>
      ) : (
        <View style={styles.backButtonPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 4,
    width: 40,
    alignItems: 'flex-start',
  },
  backButtonPlaceholder: {
    width: 40,
  },
  rightElementContainer: {
    alignItems: 'flex-end',
    minWidth: 40,
  }
});

export default AppHeader;
