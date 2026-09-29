import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { AppScreen, AppCard, BrandLogo } from '../components';
import { theme } from '../theme/theme';
import { apiClient } from '../apiClient';
import { useAuth } from '../AuthContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [establishmentCount, setEstablishmentCount] = useState(0);

  const loadData = async () => {
    try {
      const estRes = await apiClient.get('/establishments');
      setEstablishmentCount(estRes.data.length);
    } catch (err) {
      console.log('Error loading establishments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <AppScreen style={{ backgroundColor: '#F8F9F7' }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <BrandLogo variant="isotype" width={56} height={56} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.greeting} numberOfLines={1}>Buen día, {user?.name?.split(' ')[0] || 'Juan'}</Text>
              <Text style={styles.subtitle} numberOfLines={1}>Gestioná tu actividad desde un solo lugar.</Text>
            </View>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name ? user.name.substring(0, 2).toUpperCase() : 'JP'}</Text>
          </View>
        </View>

        {/* Hero Banner */}
        <View style={styles.bannerContainer}>
          <ImageBackground 
            source={require('../../assets/rural-bg-bright.jpg')} 
            style={styles.bannerImage}
            imageStyle={{ borderRadius: 12 }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.4)']}
              style={styles.bannerGradient}
            >
              <Text style={styles.bannerText}>"Información hoy,</Text>
              <Text style={styles.bannerText}>mejores resultados mañana"</Text>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Tus campos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tus campos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Campos')} style={styles.seeAllContainer}>
            <Text style={styles.seeAll}>Ver todos</Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color={theme.colors.neutral[600]} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Campos')}
          activeOpacity={0.8}
        >
          <AppCard style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="tractor" size={28} color={theme.colors.primary[800]} style={styles.barnIconInner} />
              </View>
              <View style={styles.summaryStats}>
                <Text style={styles.statNumber}>{loading ? '-' : establishmentCount}</Text>
                <Text style={styles.statLabel}>campos</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.neutral[400]} />
            </View>
            <Text style={styles.summaryDesc}>
              Gestioná, ubicá y mantené actualizada la{'\n'}información de tus campos.
            </Text>
          </AppCard>
        </TouchableOpacity>

        {/* Acciones rápidas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCardWrapper}
            onPress={() => navigation.navigate('EstablishmentForm')}
            activeOpacity={0.8}
          >
            <AppCard style={styles.actionCard}>
              <View style={{ alignItems: 'center', width: '100%' }}>
                <View style={styles.actionIcon}>
                  <MaterialCommunityIcons name="plus" size={28} color={theme.colors.primary[800]} />
                </View>
                <Text style={styles.actionTitle}>Nuevo campo</Text>
                <Text style={styles.actionDesc}>Cargá un nuevo campo</Text>
              </View>
            </AppCard>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCardWrapper}
            onPress={() => navigation.navigate('Campos')}
            activeOpacity={0.8}
          >
            <AppCard style={styles.actionCard}>
              <View style={{ alignItems: 'center', width: '100%' }}>
                <View style={styles.actionIcon}>
                  <MaterialCommunityIcons name="map-marker-outline" size={24} color={theme.colors.primary[800]} />
                </View>
                <Text style={styles.actionTitle}>Ver campos</Text>
                <Text style={styles.actionDesc}>Listá y administrá tus campos</Text>
              </View>
            </AppCard>
          </TouchableOpacity>
        </View>

        {/* Indicadores / Benchmarking funcionales */}
        <TouchableOpacity onPress={() => navigation.navigate('Indicators')} activeOpacity={0.8}>
          <AppCard style={styles.indicatorsCard}>
            <View style={styles.indicatorsContent}>
              <View style={styles.indicatorsIconContainer}>
                <MaterialCommunityIcons name="chart-bar" size={28} color={theme.colors.primary[800]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.indicatorsTitle}>Indicadores y Benchmarking</Text>
                <Text style={styles.indicatorsDesc}>
                  Accedé al resumen productivo de tus campos.
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.neutral[400]} />
            </View>
          </AppCard>
        </TouchableOpacity>
        
        <View style={{height: 40}} />
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0B2136',
  },
  subtitle: {
    fontSize: 12,
    color: '#5C6E7A',
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5F0EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0E3D8',
  },
  avatarText: {
    color: theme.colors.primary[800],
    fontWeight: 'bold',
    fontSize: 16,
  },
  bannerContainer: {
    width: '100%',
    height: 160,
    marginBottom: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerGradient: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 4,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 24,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 2,
    marginHorizontal: 2,
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B2136',
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAll: {
    color: theme.colors.neutral[600],
    fontSize: 14,
    marginRight: 2,
  },
  summaryCard: {
    padding: 20,
    marginBottom: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#E5F0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  barnIconInner: {
    color: theme.colors.primary[800],
  },
  summaryStats: {
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B2136',
  },
  statLabel: {
    fontSize: 14,
    color: '#5C6E7A',
  },
  summaryDesc: {
    fontSize: 14,
    color: '#5C6E7A',
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCardWrapper: {
    width: '48%',
  },
  actionCard: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 144,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5F0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0B2136',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDesc: {
    fontSize: 12,
    color: '#5C6E7A',
    textAlign: 'center',
    lineHeight: 16,
  },
  indicatorsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  indicatorsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E5F0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  indicatorsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B2136',
    marginBottom: 4,
  },
  indicatorsDesc: {
    fontSize: 13,
    color: '#5C6E7A',
    lineHeight: 18,
  },
});

export default HomeScreen;
