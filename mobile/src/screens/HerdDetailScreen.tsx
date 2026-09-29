import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { AppScreen, AppHeader, AppButton, AppCard } from '../components';
import { apiClient } from '../apiClient';
import { theme } from '../theme/theme';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const HerdDetailScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [herd, setHerd] = useState<any>(null);
  const [animals, setAnimals] = useState<any[]>([]);
  const [establishment, setEstablishment] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const establishmentId = route.params?.establishmentId;
  const herdId = route.params?.herdId;

  const fetchHerdAndAnimals = async () => {
    try {
      const [herdRes, animalsRes, estRes] = await Promise.all([
        apiClient.get(`/establishments/${establishmentId}/herds/${herdId}`),
        apiClient.get(`/establishments/${establishmentId}/animals?herdId=${herdId}`),
        apiClient.get(`/establishments/${establishmentId}`)
      ]);
      setHerd(herdRes.data);
      setAnimals(animalsRes.data);
      setEstablishment(estRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHerdAndAnimals();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <AppScreen style={styles.screen}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{herd?.name || 'Cargando...'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {herd && (
          <>
            <View style={styles.headerBox}>
              <View style={styles.subtitleRow}>
                <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.subtitleText}>{establishment?.name || 'Establecimiento'} • </Text>
                <View style={[styles.statusBadge, { backgroundColor: herd.active ? '#E8F5E9' : '#F5F5F5' }]}>
                  <Text style={[styles.statusText, { color: herd.active ? '#2E7D32' : '#616161' }]}>
                    {herd.active ? 'Activo' : 'Inactivo'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.statsCard}>
              <View style={styles.statBlock}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name="cow" size={24} color={theme.colors.primary[700]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.statLabel}>Categoría</Text>
                  <Text style={styles.statValue}>{herd.activity}</Text>
                </View>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.statBlock}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name="cow" size={24} color={theme.colors.primary[700]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.statLabel}>Cantidad de animales</Text>
                  <Text style={styles.statValue}>{animals.length}</Text>
                </View>
              </View>
            </View>

            <View style={styles.animalesSectionHeader}>
              <Text style={styles.sectionTitle}>Animales</Text>
            </View>

            <View style={styles.searchRow}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search-outline" size={20} color={theme.colors.textSecondary} />
                <TextInput 
                  style={styles.searchInput}
                  placeholder="Buscar por caravana..."
                  placeholderTextColor={theme.colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity style={styles.filterBtn}>
                <Ionicons name="filter" size={20} color={theme.colors.primary[700]} />
                <Text style={styles.filterText}>Filtrar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.addAnimalsBtn}
              onPress={() => navigation.navigate('CreateAnimal', { establishmentId, herdId })}
            >
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.addAnimalsText}>Agregar animales</Text>
            </TouchableOpacity>

            {animals.length === 0 ? (
              <AppCard style={{ alignItems: 'center', padding: 24, marginTop: 16 }}>
                <MaterialCommunityIcons name="cow" size={40} color={theme.colors.neutral[300]} style={{marginBottom: 12}} />
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 8 }}>Sin animales</Text>
                <Text style={{ fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center' }}>No hay animales asignados a este rodeo.</Text>
              </AppCard>
            ) : (
              animals.map(animal => {
                const isDead = animal.status === 'DEATH' || animal.status === 'DEAD' || animal.status === 'MUERTO';
                return (
                  <TouchableOpacity 
                    key={animal.id} 
                    style={[styles.animalRow, isDead && { opacity: 0.7, backgroundColor: '#ffebee' }]}
                    onPress={() => navigation.navigate('AnimalDetail', { establishmentId, animalId: animal.id })}
                  >
                    <View style={[styles.animalIcon, isDead && { backgroundColor: '#ffcdd2' }]}>
                      <MaterialCommunityIcons name={isDead ? "skull-crossbones" : "cow"} size={24} color={isDead ? "#c62828" : theme.colors.primary[700]} />
                    </View>
                    <View style={styles.animalInfo}>
                      <Text style={[styles.animalTag, isDead && { textDecorationLine: 'line-through', color: '#c62828' }]}>
                        {animal.tag} {isDead && <Text style={{fontSize: 10, color: '#c62828'}}>(MUERTO)</Text>}
                      </Text>
                      <Text style={styles.animalDesc}>
                        {animal.category || 'Categoría'} • {animal.sex === 'M' ? 'Macho' : 'Hembra'} • {animal.ageMonths != null ? (animal.ageMonths < 12 ? `${animal.ageMonths} meses` : `${(animal.ageMonths / 12).toFixed(1).replace('.0', '').replace('.', ',')} años`) : 'N/A'}
                      </Text>
                    </View>
                  <View style={styles.animalRightCol}>
                    <View style={styles.animalWeightRow}>
                      <MaterialCommunityIcons name="weight" size={16} color={theme.colors.textPrimary} style={{marginRight: 4}} />
                      <Text style={styles.animalWeightText}>{animal.lastWeight ? Number(animal.lastWeight).toFixed(1).replace('.0', '').replace('.', ',') : '0'} kg</Text>
                    </View>
                    <Text style={styles.animalDateText}>{animal.lastWeightDate || 'N/A'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral[400]} />
                </TouchableOpacity>
                );
              })
            )}
          </>
        )}
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: theme.colors.background,
  },
  headerBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 8,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitleText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
  },
  statBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  verticalDivider: {
    width: 1,
    height: '80%',
    backgroundColor: theme.colors.border,
    marginHorizontal: 8,
  },
  animalesSectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.textPrimary,
    marginLeft: 8,
    height: '100%',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary[50],
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
  },
  filterText: {
    color: theme.colors.textPrimary,
    fontWeight: '500',
    marginLeft: 8,
  },
  addAnimalsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary[800],
    height: 48,
    borderRadius: 12,
    marginBottom: 16,
  },
  addAnimalsText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  animalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  animalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  animalInfo: {
    flex: 1,
  },
  animalTag: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  animalDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  animalRightCol: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  animalWeightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  animalWeightText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  animalDateText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  }
});

export default HerdDetailScreen;
