import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AppScreen, AppHeader, AppButton } from '../components';
import { apiClient } from '../apiClient';
import { theme } from '../theme/theme';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const LivestockScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [herds, setHerds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const establishmentId = route.params?.establishmentId;

  const fetchHerds = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/establishments/${establishmentId}/herds`);
      setHerds(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (establishmentId) fetchHerds();
    });
    return unsubscribe;
  }, [establishmentId, navigation]);

  return (
    <AppScreen style={styles.screen}>
      <AppHeader title="Gestión Ganadera" showBack={true} />
      
      <View style={styles.container}>
        <View style={styles.listHeader}>
          <Text style={styles.title}>Mis Rodeos</Text>
          <TouchableOpacity 
            style={styles.addButtonIcon} 
            onPress={() => navigation.navigate('CreateHerd', { establishmentId })}
          >
            <Ionicons name="add" size={24} color={theme.colors.surface} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary[600]} style={{marginTop: 40}} />
        ) : herds.length === 0 ? (
          <View style={styles.emptyState}>
             <MaterialCommunityIcons name="cow" size={64} color={theme.colors.textSecondary} style={{opacity: 0.3}} />
             <Text style={styles.emptyTitle}>Sin rodeos activos</Text>
             <Text style={styles.emptyDesc}>Empezá a gestionar tus animales creando tu primer rodeo.</Text>
             <AppButton 
                title="Crear Rodeo" 
                onPress={() => navigation.navigate('CreateHerd', { establishmentId })} 
                style={styles.emptyBtn}
              />
          </View>
        ) : (
          <FlatList
            data={herds}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 100}}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('HerdDetail', { establishmentId, herdId: item.id })}
              >
                <View style={styles.cardIconBox}>
                  <MaterialCommunityIcons name="cow" size={24} color={theme.colors.primary[600]} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSubtitle}>{item.activity} • {item.productionSystem}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.active ? '#E8F5E9' : '#FFEBEE' }]}>
                  <Text style={[styles.statusText, { color: item.active ? '#2E7D32' : '#C62828' }]}>
                    {item.active ? 'Activo' : 'Inactivo'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  addButtonIcon: {
    backgroundColor: theme.colors.primary[600],
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E6EBE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: theme.colors.textPrimary,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: 8,
    marginBottom: 24,
  },
  emptyBtn: {
    width: '100%',
  }
});

export default LivestockScreen;
