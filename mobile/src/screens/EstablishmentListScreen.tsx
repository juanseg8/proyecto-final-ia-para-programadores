import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { AppScreen, AppButton, AppCard } from '../components';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { theme } from '../theme/theme';
import { apiClient } from '../apiClient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const EstablishmentListScreen = ({ navigation }: { navigation: any }) => {
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Todos');
  const [selectedMapEst, setSelectedMapEst] = useState<any | null>(null);

  const loadData = async () => {
    try {
      const res = await apiClient.get('/establishments');
      const fetchedEsts = res.data;
      setEstablishments(fetchedEsts);
      const storedFavs = await SecureStore.getItemAsync('favorites');
      if (storedFavs) {
        let parsed = JSON.parse(storedFavs);
        // Clean up invalid favorites that no longer exist (e.g., after DB re-seed)
        parsed = parsed.filter((fid: string) => fetchedEsts.some((e: any) => e.id === fid));
        setFavorites(parsed);
        await SecureStore.setItemAsync('favorites', JSON.stringify(parsed));
      }
    } catch (err) {
      console.log('Error loading establishments', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string) => {
    const newFavs = favorites.includes(id) ? favorites.filter(fid => fid !== id) : [...favorites, id];
    setFavorites(newFavs);
    try {
      await SecureStore.setItemAsync('favorites', JSON.stringify(newFavs));
    } catch (err) {}
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const displayedEstablishments = activeTab === 'Favoritos' 
    ? establishments.filter(e => favorites.includes(e.id))
    : establishments;

  const validMapEstablishments = establishments.filter(e => e.latitude && e.longitude);

  const tabs = [`Todos (${establishments.length})`, 'Mapa', `Favoritos (${favorites.length})`];

  const renderLargeCard = (item: any) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('EstablishmentDetail', { establishment: item })}
      activeOpacity={0.8}
    >
      <AppCard style={styles.largeCard} contentStyle={{ padding: 0 }}>
        <View style={styles.largeCardImageContainer}>
          <Image 
            source={require('../../assets/rural-bg-bright.jpg')} 
            style={{ width: '100%', height: '100%' }} 
            resizeMode="cover" 
          />
          <TouchableOpacity 
            onPress={() => toggleFavorite(item.id)}
            style={styles.largeStarButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
            <MaterialCommunityIcons 
              name={favorites.includes(item.id) ? "star" : "star-outline"} 
              size={24} 
              color={favorites.includes(item.id) ? "#FFD700" : theme.colors.neutral[0]} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.largeCardBody}>
          <View style={styles.largeCardIconBox}>
            <MaterialCommunityIcons name="office-building-outline" size={28} color={theme.colors.neutral[0]} />
          </View>
          <View style={styles.largeCardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
            <View style={styles.cardRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color={theme.colors.neutral[500]} style={styles.rowIcon} />
              <Text style={styles.cardText} numberOfLines={1}>{item.locality || 'Sin localidad'}, {item.province || 'Sin provincia'}</Text>
            </View>
            <View style={styles.cardRow}>
              <MaterialCommunityIcons name="texture" size={16} color={theme.colors.primary[800]} style={styles.rowIcon} />
              <Text style={styles.cardTextHighlight}>{item.superficieHa || 0} ha</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.neutral[300]} />
        </View>
      </AppCard>
    </TouchableOpacity>
  );

  const renderCompactCard = (item: any) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('EstablishmentDetail', { establishment: item })}
      activeOpacity={0.8}
    >
      <AppCard style={styles.compactCard} contentStyle={{ padding: theme.spacing.sm, flexDirection: 'row', alignItems: 'center' }}>
        <Image 
          source={require('../../assets/rural-bg-bright.jpg')} 
          style={styles.compactCardThumbnail} 
        />
        <View style={styles.compactCardContent}>
          <View style={styles.compactCardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
            <TouchableOpacity 
              onPress={() => toggleFavorite(item.id)}
              style={styles.starButton}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <MaterialCommunityIcons 
                name={favorites.includes(item.id) ? "star" : "star-outline"} 
                size={24} 
                color={favorites.includes(item.id) ? "#FFD700" : theme.colors.neutral[300]} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={14} color={theme.colors.neutral[500]} style={styles.rowIcon} />
            <Text style={styles.cardText} numberOfLines={1}>{item.locality || 'Sin localidad'}, {item.province || 'Sin provincia'}</Text>
          </View>
          
          <View style={styles.cardRow}>
            <MaterialCommunityIcons name="texture" size={14} color={theme.colors.primary[800]} style={styles.rowIcon} />
            <Text style={styles.cardTextHighlight}>{item.superficieHa || 0} ha</Text>
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.neutral[300]} style={styles.cardChevron} />
      </AppCard>
    </TouchableOpacity>
  );

  return (
    <AppScreen style={{backgroundColor: theme.colors.background}}>
      <View style={styles.header}>
        <View style={styles.backButtonPlaceholder} />
        <Text style={styles.headerTitle}>Mis campos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EstablishmentForm')} style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map((tab, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.tab, activeTab === tab.split(' ')[0] && styles.activeTab]}
            onPress={() => {
              setActiveTab(tab.split(' ')[0]);
              setSelectedMapEst(null);
            }}
          >
            <Text style={[styles.tabText, activeTab === tab.split(' ')[0] && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary[600]} style={{marginTop: 50}} />
        ) : establishments.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons name="tractor" size={40} color={theme.colors.primary[600]} />
            </View>
            <Text style={styles.emptyTitle}>Tu campo empieza acá</Text>
            <Text style={styles.emptyDesc}>
              Todavía no cargaste campos. Agregá el primero para comenzar a organizar y analizar tu información.
            </Text>
            <AppButton 
              title="+ Agregar campo" 
              onPress={() => navigation.navigate('EstablishmentForm')} 
              style={styles.emptyButton} 
            />
          </View>
        ) : activeTab === 'Mapa' ? (
          validMapEstablishments.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <MaterialCommunityIcons name="map-marker-off" size={40} color={theme.colors.primary[600]} />
              </View>
              <Text style={styles.emptyTitle}>Sin ubicaciones</Text>
              <Text style={styles.emptyDesc}>
                Ninguno de tus campos tiene coordenadas válidas. Editá tus campos para ubicarlos en el mapa.
              </Text>
            </View>
          ) : (
            <View style={styles.mapContainer}>
              <MapView 
                style={styles.map}
                mapType="none"
                initialRegion={{
                  latitude: Number(validMapEstablishments[0].latitude),
                  longitude: Number(validMapEstablishments[0].longitude),
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }}
              >
                <UrlTile
                  urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maximumZ={19}
                  flipY={false}
                />
                {validMapEstablishments.map((est) => (
                  <Marker
                    key={est.id}
                    coordinate={{ 
                      latitude: Number(est.latitude), 
                      longitude: Number(est.longitude) 
                    }}
                    onPress={() => setSelectedMapEst(est)}
                  >
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialCommunityIcons name="map-marker" size={36} color={theme.colors.primary[600]} />
                    </View>
                  </Marker>
                ))}
              </MapView>

              {selectedMapEst && (
                <View style={styles.mapOverlayCard}>
                  <AppCard style={styles.overlayCardInner}>
                    <View style={styles.overlayHeader}>
                      <View style={styles.overlayIconBox}>
                        <MaterialCommunityIcons name="office-building-outline" size={24} color={theme.colors.neutral[0]} />
                      </View>
                      <View style={styles.overlayInfo}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{selectedMapEst.name}</Text>
                        <View style={styles.cardRow}>
                          <MaterialCommunityIcons name="map-marker-outline" size={14} color={theme.colors.neutral[500]} style={styles.rowIcon} />
                          <Text style={styles.cardText} numberOfLines={1}>{selectedMapEst.locality}, {selectedMapEst.province}</Text>
                        </View>
                        <View style={styles.cardRow}>
                          <MaterialCommunityIcons name="texture" size={14} color={theme.colors.primary[600]} style={styles.rowIcon} />
                          <Text style={styles.cardTextHighlight}>{selectedMapEst.superficieHa || 0} ha</Text>
                        </View>
                      </View>
                      <TouchableOpacity 
                        onPress={() => toggleFavorite(selectedMapEst.id)}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                      >
                        <MaterialCommunityIcons 
                          name={favorites.includes(selectedMapEst.id) ? "star" : "star-outline"} 
                          size={28} 
                          color={favorites.includes(selectedMapEst.id) ? "#FFD700" : theme.colors.neutral[300]} 
                        />
                      </TouchableOpacity>
                    </View>
                    <AppButton 
                      title="Ver establecimiento" 
                      onPress={() => navigation.navigate('EstablishmentDetail', { establishment: selectedMapEst })}
                      style={styles.overlayButton}
                      rightIcon="chevron-right"
                    />
                  </AppCard>
                </View>
              )}
            </View>
          )
        ) : activeTab === 'Favoritos' && displayedEstablishments.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons name="star-outline" size={40} color={theme.colors.primary[600]} />
            </View>
            <Text style={styles.emptyTitle}>Sin favoritos</Text>
            <Text style={styles.emptyDesc}>
              Todavía no marcaste ningún campo como favorito. Podés hacerlo desde la pestaña Todos.
            </Text>
          </View>
        ) : (
          <FlatList
            data={displayedEstablishments}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 20}}
            renderItem={({ item }) => activeTab === 'Todos' ? renderLargeCard(item) : renderCompactCard(item)}
          />
        )}
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  backButtonPlaceholder: { width: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight as any,
    color: theme.colors.neutral[900],
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary[800],
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    color: theme.colors.neutral[0],
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  tab: {
    marginRight: theme.spacing.xl,
    paddingBottom: theme.spacing.sm,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary[800],
  },
  tabText: {
    fontSize: theme.typography.label.fontSize,
    color: theme.colors.neutral[500],
    fontWeight: theme.typography.label.fontWeight as any,
  },
  activeTabText: {
    color: theme.colors.primary[800],
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.neutral[50],
  },
  largeCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  largeCardImageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: theme.colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  largeCardImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeStarButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeCardBody: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[0],
  },
  largeCardIconBox: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary[800],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  largeCardInfo: {
    flex: 1,
  },
  compactCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.lg,
  },
  compactCardThumbnail: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  compactCardContent: {
    flex: 1,
  },
  compactCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.neutral[900],
    flex: 1,
    marginRight: 8,
  },
  starButton: {
    padding: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  rowIcon: {
    marginRight: 6,
  },
  cardText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.neutral[600],
    flex: 1,
  },
  cardTextHighlight: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    color: theme.colors.neutral[900],
  },
  cardChevron: {
    paddingLeft: theme.spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    marginTop: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight as any,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.md,
  },
  emptyDesc: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.neutral[600],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.xl,
  },
  emptyButton: {
    width: '100%',
  },
  mapContainer: {
    flex: 1,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  mapOverlayCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  overlayCardInner: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
  },
  overlayHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    alignItems: 'flex-start',
  },
  overlayIconBox: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary[800],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  overlayInfo: {
    flex: 1,
  },
  overlayButton: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
  }
});

export default EstablishmentListScreen;
