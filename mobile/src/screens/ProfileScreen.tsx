import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppScreen, AppHeader, AppCard } from '../components';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import { Alert } from 'react-native';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      Alert.alert('Error', 'No se pudo cerrar sesión correctamente.');
    }
  };

  return (
    <AppScreen style={styles.screen}>
      <AppHeader title="Perfil y Configuración" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Usuario'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
        </View>

        <AppCard style={styles.card}>
          <TouchableOpacity style={styles.optionRow} onPress={() => Alert.alert('Próximamente', 'Esta funcionalidad estará disponible pronto.')}>
            <Ionicons name="person-outline" size={24} color={theme.colors.textPrimary} />
            <Text style={styles.optionText}>Datos Personales</Text>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.optionRow} onPress={() => Alert.alert('Próximamente', 'Esta funcionalidad estará disponible pronto.')}>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.textPrimary} />
            <Text style={styles.optionText}>Notificaciones</Text>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.optionRow} onPress={() => Alert.alert('Próximamente', 'Esta funcionalidad estará disponible pronto.')}>
            <Ionicons name="lock-closed-outline" size={24} color={theme.colors.textPrimary} />
            <Text style={styles.optionText}>Privacidad y Seguridad</Text>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </AppCard>

        <AppCard style={styles.card}>
          <TouchableOpacity style={styles.optionRow} onPress={() => Alert.alert('Próximamente', 'Esta funcionalidad estará disponible pronto.')}>
            <Ionicons name="help-circle-outline" size={24} color={theme.colors.textPrimary} />
            <Text style={styles.optionText}>Soporte Técnico</Text>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </AppCard>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={theme.colors.semantic.error} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontSize: 32,
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  name: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  email: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  card: {
    padding: 0,
    marginBottom: theme.spacing.lg,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  optionText: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    backgroundColor: '#FFEBEB',
    borderRadius: theme.radius.md,
  },
  logoutText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    color: theme.colors.semantic.error,
    marginLeft: theme.spacing.sm,
  },
});

export default ProfileScreen;
