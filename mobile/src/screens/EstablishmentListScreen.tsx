import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { apiClient } from '../apiClient';
import { AppScreen } from '../components';
import { theme } from '../theme/theme';

interface Establishment {
  id: string;
  name: string;
  province: string;
  locality?: string;
  superficieHa?: number;
}

type TabKey = 'todos' | 'mapa' | 'favoritos';

export const EstablishmentListScreen = () => {
  const navigation = useNavigation<any>();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('todos');

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      const fetchEstablishments = async () => {
        try {
          const response = await apiClient.get('/establishments');
          setEstablishments(response.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchEstablishments();
    }, [])
  );

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'todos', label: `Todos (${establishments.length})` },
    { key: 'mapa', label: 'Mapa' },
    { key: 'favoritos', label: 'Favoritos' },
  ];

  return (
    <AppScreen>
      {/* Header personalizado */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel="Volver"
          accessibilityRole="button"
        >
          <Text style={styles.backBtnText}>â€¹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Mis establecimientos
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EstablishmentForm')}
          style={styles.addBtn}
          accessibilityLabel="Agregar establecimiento"
          accessibilityRole="button"
        >
          <Text style={styles.addBtnText}>ï¼‹</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.key }}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista o empty state */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      ) : establishments.length === 0 ? (
        <View style={styles.emptyContainer} testID="empty-state">
          <View style={styles.emptyIconBox}>
            <Text style={styles.emptyIcon}>ðŸŒ¿</Text>
          </View>
          <Text style={styles.emptyTitle}>Tu campo empieza acÃ¡</Text>
          <Text style={styles.emptyDesc}>
            TodavÃ­a no cargaste establecimientos.{'\n'}
            AgregÃ¡ el primero para comenzar a organizar y analizar tu informaciÃ³n.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('EstablishmentForm')}
            accessibilityRole="button"
            accessibilityLabel="Agregar establecimiento"
          >
            <Text style={styles.emptyButtonText}>ï¼‹  Agregar establecimiento</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={establishments}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={item.name}
              onPress={() => navigation.navigate('EstablishmentDetail', { id: item.id })}
              style={styles.cardWrapper}
            >
              <View style={styles.card}>
                {/* Thumbnail */}
                <View style={styles.thumbnail}>
                  <Text style={styles.thumbnailIcon}>ðŸ </Text>
                </View>
                {/* Contenido */}
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {item.locality
                      ? `${item.locality}, ${item.province}`
                      : item.province}
                  </Text>
                  {item.superficieHa !== undefined && (
                    <View style={styles.metricRow}>
                      <Text style={styles.metricIcon}>â–ª</Text>
                      <Text style={styles.metricText}>{item.superficieHa} ha</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardChevron}>â€º</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing[16],
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[4],
  },
  backBtnText: {
    fontSize: 28,
    color: theme.colors.forest,
    fontWeight: '300',
    lineHeight: 32,
  },
  headerTitle: {
    flex: 1,
    ...theme.typography.h3,
    color: theme.colors.forest,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: theme.colors.surface,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '400',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: theme.spacing[16],
  },
  tab: {
    paddingVertical: theme.spacing[12],
    paddingHorizontal: theme.spacing[16],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: theme.colors.forest,
  },
  tabText: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.forest,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  listContainer: {
    padding: theme.spacing[16],
    gap: theme.spacing[12],
  },
  cardWrapper: {
    marginBottom: theme.spacing[4],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: theme.spacing[12],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[12],
  },
  thumbnailIcon: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  cardSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[4],
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricIcon: {
    fontSize: 12,
    color: theme.colors.leaf,
  },
  metricText: {
    ...theme.typography.label,
    color: theme.colors.primaryLight,
    fontWeight: '600',
  },
  cardChevron: {
    fontSize: 20,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing[8],
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[32],
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[20],
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing[8],
  },
  emptyDesc: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing[24],
  },
  emptyButton: {
    backgroundColor: theme.colors.forest,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing[16],
    paddingHorizontal: theme.spacing[32],
    width: '100%',
    alignItems: 'center',
  },
  emptyButtonText: {
    color: theme.colors.surface,
    ...theme.typography.body,
    fontWeight: '600',
  },
});


interface Establishment {
    id: string;
    name: string;
    province: string;
    locality?: string;
    superficieHa?: number;
}
