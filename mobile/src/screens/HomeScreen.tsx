import React, { useContext, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { apiClient } from '../apiClient';
import { AppScreen } from '../components';
import { theme } from '../theme/theme';

const getInitials = (name?: string) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (parts[0][0]).toUpperCase();
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'Buen dÃ­a';
  if (hour >= 12 && hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

const getFirstName = (name?: string) => {
  if (!name) return '';
  return name.trim().split(/\s+/)[0];
};

export const HomeScreen = () => {
  const { logout, user } = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const [establishmentCount, setEstablishmentCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      apiClient.get('/establishments')
        .then(res => setEstablishmentCount(res.data?.length ?? 0))
        .catch(() => {});
    }, [])
  );

  const userName = (user as any)?.name;
  const initials = getInitials(userName);
  const firstName = getFirstName(userName);
  const greeting = `${getGreeting()}, ${firstName || 'bienvenido'}`;

  return (
    <AppScreen>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerTextCol}>
            <Text style={styles.greetingText}>{greeting}</Text>
            <Text style={styles.greetingSubtitle}>
              GestionÃ¡ tu actividad desde un solo lugar.
            </Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        {/* Card Hero */}
        <LinearGradient
          colors={[theme.colors.forest, theme.colors.primaryLight, theme.colors.leaf]}
          style={styles.heroCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.heroQuote}>
            "InformaciÃ³n hoy,{'\n'}mejores resultados maÃ±ana."
          </Text>
          <View style={styles.heroDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </LinearGradient>

        {/* SecciÃ³n: Tus establecimientos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tus establecimientos</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('EstablishmentList')}
            accessibilityRole="link"
          >
            <Text style={styles.sectionLink}>Ver todos â€º</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.estCard}
          onPress={() => navigation.navigate('EstablishmentList')}
          accessibilityRole="button"
          accessibilityLabel="Ver establecimientos"
        >
          <View style={styles.estIconBox}>
            <Text style={styles.estIcon}>ðŸ </Text>
          </View>
          <View style={styles.estCardContent}>
            <Text style={styles.estCount}>{establishmentCount}</Text>
            <Text style={styles.estCountLabel}>
              {establishmentCount === 1 ? 'establecimiento' : 'establecimientos'}
            </Text>
            <Text style={styles.estCardDesc}>
              GestionÃ¡, ubicÃ¡ y mantenÃ© actualizada la informaciÃ³n de tus campos.
            </Text>
          </View>
          <Text style={styles.chevron}>â€º</Text>
        </TouchableOpacity>

        {/* Acciones rÃ¡pidas */}
        <Text style={styles.sectionTitle}>Acciones rÃ¡pidas</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('EstablishmentForm')}
            accessibilityRole="button"
            accessibilityLabel="Nuevo establecimiento"
          >
            <Text style={styles.actionIcon}>ï¼‹</Text>
            <Text style={styles.actionTitle}>Nuevo establecimiento</Text>
            <Text style={styles.actionDesc}>CargÃ¡ un nuevo campo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardFilled]}
            onPress={() => navigation.navigate('EstablishmentList')}
            accessibilityRole="button"
            accessibilityLabel="Ver establecimientos"
          >
            <Text style={[styles.actionIcon, styles.actionIconLight]}>ðŸ“</Text>
            <Text style={[styles.actionTitle, styles.actionTitleLight]}>
              Ver establecimientos
            </Text>
            <Text style={[styles.actionDesc, styles.actionDescLight]}>
              ListÃ¡ y administrÃ¡ tus campos
            </Text>
          </TouchableOpacity>
        </View>

        {/* PrÃ³ximamente */}
        <TouchableOpacity
          style={styles.comingSoonCard}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="PrÃ³ximamente â€” Indicadores"
        >
          <View style={styles.comingSoonLeft}>
            <Text style={styles.comingSoonIcon}>ðŸ“Š</Text>
          </View>
          <View style={styles.comingSoonContent}>
            <Text style={styles.comingSoonTitle}>PrÃ³ximamente</Text>
            <Text style={styles.comingSoonDesc}>
              Indicadores productivos, benchmarking, y mucho mÃ¡s.
            </Text>
          </View>
          <Text style={styles.chevron}>â€º</Text>
        </TouchableOpacity>

        {/* Logout link */}
        <TouchableOpacity
          onPress={logout}
          style={styles.logoutLink}
          accessibilityRole="button"
        >
          <Text style={styles.logoutText}>Cerrar sesiÃ³n</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[20],
    paddingTop: theme.spacing[20],
    paddingBottom: theme.spacing[16],
  },
  headerTextCol: {
    flex: 1,
    marginRight: theme.spacing[12],
  },
  greetingText: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    fontWeight: '700',
    marginBottom: 2,
  },
  greetingSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.colors.surface,
    ...theme.typography.label,
    fontWeight: '700',
  },
  heroCard: {
    marginHorizontal: theme.spacing[20],
    borderRadius: theme.radius.card,
    padding: theme.spacing[24],
    marginBottom: theme.spacing[24],
    minHeight: 130,
    justifyContent: 'space-between',
  },
  heroQuote: {
    ...theme.typography.h3,
    color: theme.colors.surface,
    fontStyle: 'italic',
    lineHeight: 26,
  },
  heroDots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: theme.spacing[16],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: theme.colors.surface,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[20],
    marginBottom: theme.spacing[12],
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing[20],
    marginBottom: theme.spacing[12],
  },
  sectionLink: {
    ...theme.typography.bodySmall,
    color: theme.colors.primaryLight,
    fontWeight: '600',
  },
  estCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    marginHorizontal: theme.spacing[20],
    marginBottom: theme.spacing[24],
    padding: theme.spacing[16],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  estIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[12],
  },
  estIcon: {
    fontSize: 22,
  },
  estCardContent: {
    flex: 1,
  },
  estCount: {
    ...theme.typography.metric,
    color: theme.colors.forest,
  },
  estCountLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  estCardDesc: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  chevron: {
    fontSize: 22,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing[8],
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: theme.spacing[12],
    paddingHorizontal: theme.spacing[20],
    marginBottom: theme.spacing[24],
  },
  actionCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: theme.spacing[16],
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  actionCardFilled: {
    backgroundColor: theme.colors.forest,
    borderColor: theme.colors.forest,
  },
  actionIcon: {
    fontSize: 22,
    marginBottom: theme.spacing[8],
    color: theme.colors.forest,
  },
  actionIconLight: {
    color: theme.colors.surface,
  },
  actionTitle: {
    ...theme.typography.label,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionTitleLight: {
    color: theme.colors.surface,
  },
  actionDesc: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  actionDescLight: {
    color: 'rgba(255,255,255,0.75)',
  },
  comingSoonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.card,
    marginHorizontal: theme.spacing[20],
    padding: theme.spacing[16],
    marginBottom: theme.spacing[24],
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  comingSoonLeft: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[12],
  },
  comingSoonIcon: {
    fontSize: 20,
  },
  comingSoonContent: {
    flex: 1,
  },
  comingSoonTitle: {
    ...theme.typography.label,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  comingSoonDesc: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  logoutLink: {
    alignItems: 'center',
    paddingVertical: theme.spacing[16],
    marginBottom: theme.spacing[24],
  },
  logoutText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textDecorationLine: 'underline',
  },
});


