import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { AppScreen, AppHeader, AppButton, AppCard, WeatherCard, AppInput, IndicatorsDashboard } from '../components';
import { theme } from '../theme/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as SecureStore from 'expo-secure-store';

const TABS = ['Resumen', 'Indicadores', 'Rodeos', 'Clima', 'Mapa'];

const EstablishmentDetailScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const establishment = route.params?.establishment;
  const [activeTab, setActiveTab] = useState('Resumen');
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [herds, setHerds] = useState<any[]>([]);
  const [loadingHerds, setLoadingHerds] = useState(false);
  const [herdSearchQuery, setHerdSearchQuery] = useState('');

  useEffect(() => {
    loadFavoriteStatus();
  }, [establishment?.id]);

  const [indicators, setIndicators] = useState<any>(null);
  const [loadingIndicators, setLoadingIndicators] = useState(false);

  useEffect(() => {
    const fetchIndicators = async () => {
      if (!establishment?.id) return;
      try {
        setLoadingIndicators(true);
        const { apiClient } = await import('../apiClient');
        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - 365);
        const toStr = to.toISOString().split('T')[0];
        const fromStr = from.toISOString().split('T')[0];
        const res = await apiClient.get(`/establishments/${establishment.id}/indicators`, {
          params: { from: fromStr, to: toStr }
        });
        setIndicators(res.data);
      } catch (err) {
      } finally {
        setLoadingIndicators(false);
      }
    };
    fetchIndicators();
  }, [establishment?.id]);

  useEffect(() => {
    const fetchHerds = async () => {
      if (!establishment?.id) return;
      try {
        setLoadingHerds(true);
        const { apiClient } = await import('../apiClient');
        const res = await apiClient.get(`/establishments/${establishment.id}/herds`);
        setHerds(res.data);
      } catch (err) {
        // error handled silently
      } finally {
        setLoadingHerds(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchHerds();
    });

    fetchHerds();

    return unsubscribe;
  }, [establishment?.id, navigation]);

  useEffect(() => {
    if (establishment?.id && establishment.latitude && establishment.longitude) {
      import('../apiClient').then(({ apiClient }) => {
        apiClient.get(`/establishments/${establishment.id}/weather`)
          .then(res => {
            if (res.data && res.data.status !== 'UNAVAILABLE') {
              setCurrentWeather(res.data.current);
            }
          })
          .catch(() => {});
      });
    }
  }, [establishment?.id]);

  const loadFavoriteStatus = async () => {
    if (!establishment?.id) return;
    try {
      const storedFavs = await SecureStore.getItemAsync('favorites');
      if (storedFavs) {
        const parsed = JSON.parse(storedFavs);
        setIsFavorite(parsed.includes(establishment.id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFavorite = async () => {
    if (!establishment?.id) return;
    try {
      const storedFavs = await SecureStore.getItemAsync('favorites');
      let favs: string[] = storedFavs ? JSON.parse(storedFavs) : [];
      if (favs.includes(establishment.id)) {
        favs = favs.filter(id => id !== establishment.id);
        setIsFavorite(false);
      } else {
        favs.push(establishment.id);
        setIsFavorite(true);
      }
      await SecureStore.setItemAsync('favorites', JSON.stringify(favs));
    } catch (e) {
      console.error(e);
    }
  };

  if (!establishment) return null;

  const hasCoordinates = establishment.latitude && establishment.longitude;

  const getWeatherIconInfo = (code?: number) => {
    if (code === undefined) return { name: 'weather-partly-cloudy', color: theme.colors.primary[600] };
    if (code === 0) return { name: 'weather-sunny', color: '#F59E0B' };
    if (code >= 1 && code <= 3) return { name: 'weather-partly-cloudy', color: '#6B7280' };
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { name: 'weather-pouring', color: '#3B82F6' };
    if (code >= 71 && code <= 86) return { name: 'weather-snowy', color: '#60A5FA' };
    if (code >= 95) return { name: 'weather-lightning', color: '#8B5CF6' };
    return { name: 'weather-cloudy', color: '#6B7280' };
  };

  const HeaderRight = () => (
    <TouchableOpacity onPress={toggleFavorite} style={{ padding: 4 }} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
      <MaterialCommunityIcons name={isFavorite ? "star" : "star-outline"} size={28} color={isFavorite ? "#FFD700" : theme.colors.neutral[400]} />
    </TouchableOpacity>
  );

  const renderResumen = () => (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.heroSection}>
        <Image 
          source={require('../../assets/rural-bg-bright.jpg')} 
          style={styles.imagePlaceholder} 
          resizeMode="cover" 
        />
        <Text style={styles.title}>{establishment.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={theme.colors.neutral[500]} />
          <Text style={styles.locationText}>{establishment.locality}, {establishment.province}</Text>
        </View>
      </View>

      <View style={styles.rowCards}>
        <AppCard style={styles.halfCard} contentStyle={styles.halfCardContent}>
          <MaterialCommunityIcons name="sprout" size={24} color={theme.colors.primary[600]} style={styles.cardIcon} />
          <Text style={styles.cardLabel}>Actividad</Text>
          <Text style={styles.cardValue}>{establishment.activity || 'No definida'}</Text>
        </AppCard>
        <AppCard style={styles.halfCard} contentStyle={styles.halfCardContent}>
          <MaterialCommunityIcons name="tape-measure" size={24} color={theme.colors.primary[600]} style={styles.cardIcon} />
          <Text style={styles.cardLabel}>Superficie</Text>
          <Text style={styles.cardValue}>{establishment.superficieHa ? `${establishment.superficieHa} ha` : 'No definida'}</Text>
        </AppCard>
      </View>

      <AppCard style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Clima actual</Text>
          <TouchableOpacity onPress={() => setActiveTab('Clima')} style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.seeAllText}>Ver clima</Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color={theme.colors.primary[600]} />
          </TouchableOpacity>
        </View>
        {hasCoordinates ? (
          currentWeather ? (
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
              <MaterialCommunityIcons name={getWeatherIconInfo(currentWeather.weatherCode).name as any} size={36} color={getWeatherIconInfo(currentWeather.weatherCode).color} />
              <View style={{marginLeft: 12}}>
                <Text style={{fontSize: 28, fontWeight: 'bold', color: theme.colors.neutral[900]}}>{currentWeather.temperatureC}°C</Text>
                <Text style={{fontSize: 14, color: theme.colors.neutral[600]}}>Viento: {currentWeather.windSpeedKmh} km/h  •  Precip: {currentWeather.precipitationMm} mm</Text>
              </View>
            </View>
          ) : (
            <ActivityIndicator size="small" color={theme.colors.primary[600]} style={{alignSelf: 'flex-start', marginTop: 8}} />
          )
        ) : (
          <Text style={styles.textSecondary}>Faltan coordenadas para obtener el clima.</Text>
        )}
      </AppCard>

      <AppCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Alertas</Text>
        <View style={styles.emptyStateContainer}>
          <MaterialCommunityIcons name="bell-outline" size={32} color={theme.colors.neutral[300]} style={{marginBottom: 8}} />
          <Text style={styles.emptyStateText}>No hay alertas activas</Text>
        </View>
      </AppCard>
    </ScrollView>
  );

  const renderIndicadores = () => (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      <IndicatorsDashboard 
        indicators={indicators} 
        loading={loadingIndicators} 
        onRefreshRequest={() => setActiveTab('Rodeos')}
        showBenchmark={true}
        establishmentId={establishment?.id}
      />
    </ScrollView>
  );

  const renderClima = () => (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      {hasCoordinates ? (
        <WeatherCard establishmentId={establishment.id || '1'} />
      ) : (
        <AppCard style={styles.sectionCard}>
          <View style={styles.emptyStateContainer}>
            <MaterialCommunityIcons name="map-marker-off" size={40} color={theme.colors.neutral[300]} style={{marginBottom: 12}} />
            <Text style={styles.emptyStateTitle}>Falta ubicación</Text>
            <Text style={styles.emptyStateText}>Configurá las coordenadas de este establecimiento para acceder a los datos meteorológicos.</Text>
            <AppButton 
              title="Editar ubicación" 
              onPress={() => navigation.navigate('EstablishmentForm', { establishment })}
              style={{marginTop: 16}}
            />
          </View>
        </AppCard>
      )}
    </ScrollView>
  );

  const renderRodeos = () => (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      <AppCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Información general</Text>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Nombre</Text>
          <Text style={styles.dataValue}>{establishment.name}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Actividad</Text>
          <Text style={styles.dataValue}>{establishment.activity || 'No definida'}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Superficie</Text>
          <Text style={styles.dataValue}>{establishment.superficieHa ? `${establishment.superficieHa} ha` : 'No definida'}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Ubicación</Text>
          <Text style={styles.dataValue}>{establishment.locality}, {establishment.province}</Text>
        </View>
        
        <AppButton 
          title="Editar información" 
          onPress={() => navigation.navigate('EstablishmentForm', { establishment })}
          style={styles.outlineBtn}
          textStyle={styles.outlineBtnText}
        />
      </AppCard>

      <View style={{ marginBottom: 24 }}>
        <View style={[styles.sectionHeader, { paddingHorizontal: 4 }]}>
          <Text style={styles.sectionTitle}>Rodeos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CreateHerd', { establishmentId: establishment.id })}>
            <Text style={styles.seeAllText}>Agregar nuevo</Text>
          </TouchableOpacity>
        </View>

        {loadingHerds ? (
          <ActivityIndicator size="small" color={theme.colors.primary[600]} style={{ margin: 24 }} />
        ) : herds.length > 0 ? (
          <View>
            <View style={{ marginBottom: 16 }}>
              <AppInput
                placeholder="Buscar rodeo..."
                value={herdSearchQuery}
                onChangeText={setHerdSearchQuery}
              />
            </View>
            {herds.filter(h => h.name.toLowerCase().includes(herdSearchQuery.toLowerCase())).map((herd, index, filteredHerds) => (
              <TouchableOpacity
                key={herd.id}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('HerdDetail', { establishmentId: establishment.id, herdId: herd.id })}
              >
                <AppCard style={{ marginBottom: 12, paddingVertical: 12, paddingHorizontal: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.herdIconContainer}>
                      <MaterialCommunityIcons name="cow" size={24} color={theme.colors.primary[700]} />
                    </View>
                    <View style={styles.herdInfoContainer}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <Text style={styles.herdName}>{herd.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: herd.active ? '#E8F5E9' : '#F5F5F5' }]}>
                          <Text style={[styles.statusText, { color: herd.active ? '#2E7D32' : '#616161' }]}>
                            {herd.active ? 'Activo' : 'Inactivo'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.herdDetails}>{herd.animalCount} {herd.animalCount === 1 ? 'ANIMAL' : 'ANIMALES'} • {herd.activity} • {herd.productionSystem}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.neutral[400]} />
                  </View>
                </AppCard>
              </TouchableOpacity>
            ))}
            {herds.filter(h => h.name.toLowerCase().includes(herdSearchQuery.toLowerCase())).length === 0 && (
              <Text style={{ textAlign: 'center', marginVertical: 20, color: theme.colors.textSecondary }}>No se encontraron rodeos.</Text>
            )}
          </View>
        ) : (
          <AppCard style={styles.sectionCard}>
            <View style={styles.emptyStateContainer}>
              <MaterialCommunityIcons name="cow-off" size={40} color={theme.colors.neutral[300]} style={{marginBottom: 12}} />
              <Text style={styles.emptyStateTitle}>Sin rodeos activos</Text>
              <Text style={styles.emptyStateText}>Cargá los datos productivos y rodeos de este establecimiento para visualizar los indicadores clave.</Text>
              <AppButton 
                title="Cargar primer rodeo" 
                onPress={() => navigation.navigate('CreateHerd', { establishmentId: establishment.id })}
                style={{marginTop: 16}}
              />
            </View>
          </AppCard>
        )}
      </View>
    </ScrollView>
  );

  const renderMapa = () => (
    <View style={styles.mapTabContainer}>
      {hasCoordinates ? (
        <MapView
          style={styles.fullMap}
          mapType="none"
          initialRegion={{
            latitude: Number(establishment.latitude),
            longitude: Number(establishment.longitude),
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <UrlTile
            urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
          <Marker coordinate={{ latitude: Number(establishment.latitude), longitude: Number(establishment.longitude) }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name="map-marker" size={36} color={theme.colors.primary[600]} />
            </View>
          </Marker>
        </MapView>
      ) : (
        <View style={styles.emptyMapContainer}>
          <MaterialCommunityIcons name="map-marker-off" size={60} color={theme.colors.neutral[300]} style={{marginBottom: 16}} />
          <Text style={styles.emptyStateTitle}>Sin ubicación</Text>
          <Text style={styles.emptyStateText}>No hay coordenadas guardadas para este campo.</Text>
          <AppButton 
            title="Agregar ubicación" 
            onPress={() => navigation.navigate('EstablishmentForm', { establishment })}
            style={{marginTop: 24}}
          />
        </View>
      )}
    </View>
  );

  return (
    <AppScreen style={styles.screen}>
      <AppHeader title={establishment.name} showBack={true} rightElement={<HeaderRight />} />
      
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {activeTab === 'Resumen' && renderResumen()}
        {activeTab === 'Indicadores' && renderIndicadores()}
        {activeTab === 'Rodeos' && renderRodeos()}
        {activeTab === 'Clima' && renderClima()}
        {activeTab === 'Mapa' && renderMapa()}
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.neutral[50],
  },
  tabsWrapper: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  tabsContainer: {
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    marginRight: theme.spacing.md,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary[800],
  },
  tabText: {
    fontSize: theme.typography.label.fontSize,
    color: theme.colors.neutral[500],
    fontWeight: '500',
  },
  activeTabText: {
    color: theme.colors.primary[800],
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: theme.colors.primary[800],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: 'bold',
    color: theme.colors.neutral[900],
    marginBottom: 4,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.neutral[600],
    marginLeft: 4,
  },
  rowCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  halfCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  halfCardContent: {
    alignItems: 'flex-start',
    padding: theme.spacing.md,
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.neutral[500],
    marginBottom: 2,
  },
  cardValue: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.neutral[900],
  },
  sectionCard: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    fontSize: theme.typography.label.fontSize,
    color: theme.colors.primary[600],
    fontWeight: 'bold',
  },
  textSecondary: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.neutral[600],
    lineHeight: 20,
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.radius.md,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.neutral[900],
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.neutral[600],
    textAlign: 'center',
    lineHeight: 20,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[100],
    paddingVertical: theme.spacing.md,
  },
  dataLabel: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.neutral[500],
  },
  dataValue: {
    flex: 2,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.neutral[900],
    fontWeight: '500',
    textAlign: 'right',
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary[800],
    marginTop: theme.spacing.lg,
  },
  outlineBtnText: {
    color: theme.colors.primary[800],
  },
  mapTabContainer: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
  },
  fullMap: {
    width: '100%',
    height: '100%',
  },
  emptyMapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  markerPin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary[800],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  markerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  herdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[100],
  },
  herdIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  herdInfoContainer: {
    flex: 1,
  },
  herdName: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    color: theme.colors.neutral[900],
    marginBottom: 2,
  },
  herdDetails: {
    fontSize: theme.typography.label.fontSize,
    color: theme.colors.neutral[500],
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  }
});

export default EstablishmentDetailScreen;
