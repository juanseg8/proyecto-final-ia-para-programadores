import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppScreen, AppHeader } from '../components';
import { apiClient } from '../apiClient';
import { theme } from '../theme/theme';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const TABS = ['Resumen', 'Pesadas', 'Eventos'];

const AnimalDetailScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [animal, setAnimal] = useState<any>(null);
  const [weighings, setWeighings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [establishment, setEstablishment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(TABS[1]); // Default to Pesadas to match mockup

  const { establishmentId, animalId } = route.params;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [animalRes, weighingsRes, eventsRes, estRes] = await Promise.all([
        apiClient.get(`/establishments/${establishmentId}/animals/${animalId}`),
        apiClient.get(`/establishments/${establishmentId}/weighings?animalId=${animalId}`),
        apiClient.get(`/establishments/${establishmentId}/events?animalId=${animalId}`),
        apiClient.get(`/establishments/${establishmentId}`)
      ]);
      
      setAnimal(animalRes.data);
      setWeighings(weighingsRes.data);
      setEvents(eventsRes.data);
      setEstablishment(estRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading || !animal) {
    return (
      <AppScreen style={styles.screen}>
        <AppHeader title="Detalle del Animal" showBack={true} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary[600]} />
        </View>
      </AppScreen>
    );
  }

  // Format age
  const now = new Date();
  let ageFormatted = 'N/A';
  let category = 'Categoría';
  if (animal.birthDate) {
    const bd = new Date(animal.birthDate);
    let ageMonths = (now.getFullYear() - bd.getFullYear()) * 12 + now.getMonth() - bd.getMonth();
    if (now.getDate() < bd.getDate()) ageMonths--;
    if (ageMonths < 0) ageMonths = 0;
    
    if (ageMonths < 12) {
      ageFormatted = `${ageMonths} meses`;
    } else {
      const years = Math.floor(ageMonths / 12);
      const remainingMonths = ageMonths % 12;
      ageFormatted = `${years} año${years > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}` : ''}`;
    }

    if (animal.sex === 'M') {
       category = ageMonths <= 12 ? 'Ternero' : (ageMonths <= 24 ? 'Novillito' : 'Toro');
    } else {
       category = ageMonths <= 12 ? 'Ternera' : (ageMonths <= 24 ? 'Vaquillona' : 'Vaca');
    }
  }

  const birthDateFormatted = animal.birthDate ? new Date(animal.birthDate).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';

  const sortedWeighings = [...weighings].sort((a, b) => new Date(b.weighedAt).getTime() - new Date(a.weighedAt).getTime());
  const lastWeighing = sortedWeighings.length > 0 ? sortedWeighings[0] : null;

  const renderPesadas = () => {
    return (
      <View style={styles.tabContent}>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => navigation.navigate('RegisterWeighing', { establishmentId, herdId: animal.herdId, animalId: animal.id })}
        >
          <Ionicons name="add-outline" size={20} color="#fff" style={{marginRight: 8}} />
          <Text style={styles.addBtnText}>Registrar pesada</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Historial de pesadas</Text>

        {sortedWeighings.length === 0 ? (
          <Text style={{ textAlign: 'center', color: theme.colors.textSecondary, marginTop: 24, marginBottom: 24 }}>No hay pesadas registradas.</Text>
        ) : (
          sortedWeighings.map((w, i) => {
            const nextW = sortedWeighings[i + 1];
            let diffStr = '';
            let pctStr = '';
            let isFirst = i === sortedWeighings.length - 1;
            
            if (nextW) {
              const diff = w.weightKg - nextW.weightKg;
              const pct = ((diff / nextW.weightKg) * 100).toFixed(1).replace('.', ',');
              diffStr = diff > 0 ? `+${diff} kg` : `${diff} kg`;
              pctStr = diff > 0 ? `+${pct}%` : `${pct}%`;
            }

            const diffColor = diffStr.startsWith('+') ? theme.colors.primary[700] : (diffStr.startsWith('-') ? '#C62828' : theme.colors.textSecondary);

            // Compute "hace X dias/meses"
            const daysDiff = Math.floor((new Date().getTime() - new Date(w.weighedAt).getTime()) / (1000 * 3600 * 24));
            let agoStr = '';
            if (daysDiff === 0) agoStr = 'hoy';
            else if (daysDiff < 30) agoStr = `hace ${daysDiff} día${daysDiff > 1 ? 's' : ''}`;
            else {
              const m = Math.floor(daysDiff / 30);
              agoStr = `hace ${m} mes${m > 1 ? 'es' : ''}`;
            }

            return (
              <View key={w.id} style={styles.historyCard}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyDate}>{new Date(w.weighedAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
                  <Text style={styles.historyAgo}>{agoStr}</Text>
                </View>
                
                <Text style={styles.historyWeight}>{Number(w.weightKg).toFixed(1).replace('.0', '').replace('.', ',')} kg</Text>

                <View style={styles.historyRight}>
                  {isFirst ? (
                    <View style={{alignItems: 'flex-start'}}>
                      <Text style={styles.historyDiffFirst}>-</Text>
                      <Text style={styles.historyPctFirst}>Primera pesada</Text>
                    </View>
                  ) : (
                    <View style={{alignItems: 'flex-start'}}>
                      <Text style={[styles.historyDiff, { color: diffColor }]}>{diffStr}</Text>
                      <Text style={styles.historyPct}>{pctStr}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral[400]} style={{marginLeft: 'auto'}} />
                </View>
              </View>
            );
          })
        )}

      </View>
    );
  };

  const renderResumen = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoCard}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
          <Text style={styles.infoLabel}>Caravana Visual</Text>
          <Text style={styles.infoValue}>{animal.tag}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
          <Text style={styles.infoLabel}>Categoría</Text>
          <Text style={styles.infoValue}>{category}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
          <Text style={styles.infoLabel}>Sexo</Text>
          <Text style={styles.infoValue}>{animal.sex === 'M' ? 'Macho' : 'Hembra'}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
          <Text style={styles.infoLabel}>Edad</Text>
          <Text style={styles.infoValue}>{ageFormatted}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.infoLabel}>Estado</Text>
          <Text style={styles.infoValue}>{animal.status === 'ACTIVE' ? 'Activo' : animal.status}</Text>
        </View>
      </View>
    </View>
  );

  const renderEventos = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={styles.addBtn}
        onPress={() => navigation.navigate('RegisterLivestockEvent', { establishmentId, herdId: animal.herdId, animalId: animal.id })}
      >
        <Ionicons name="add-outline" size={20} color="#fff" style={{marginRight: 8}} />
        <Text style={styles.addBtnText}>Registrar evento</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Historial de eventos</Text>

      {events.length === 0 ? (
        <Text style={{ textAlign: 'center', color: theme.colors.textSecondary, marginTop: 24, marginBottom: 24 }}>No hay eventos registrados.</Text>
      ) : (
        events.map((e) => (
          <View key={e.id} style={styles.historyCard}>
            <View style={styles.historyLeft}>
              <Text style={styles.historyDate}>{new Date(e.occurredAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
              <Text style={styles.historyAgo}>{new Date(e.occurredAt).toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit'})}</Text>
            </View>
            
            <View style={{flex: 1.5, paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: theme.colors.border}}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary}}>{e.type}</Text>
              {e.notes ? (
                <Text style={{fontSize: 14, color: theme.colors.textSecondary, marginTop: 4}}>{e.notes}</Text>
              ) : null}
            </View>
          </View>
        ))
      )}
    </View>
  );

  return (
    <AppScreen style={styles.screen}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Animal {animal.tag}</Text>
          <View style={styles.headerSubtitleRow}>
            <Ionicons name="location-outline" size={12} color={theme.colors.textSecondary} />
            <Text style={styles.headerSubtitle}>{animal.herd?.name || 'Rodeo'} • {establishment?.name || 'Establecimiento'}</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.infoCard}>
          <View style={styles.infoCardTop}>
            <View style={styles.bigIconCircle}>
              <MaterialCommunityIcons name="cow" size={40} color={theme.colors.primary[800]} />
            </View>
            <View style={styles.infoTitleBox}>
              <Text style={styles.infoTag}>{animal.tag}</Text>
              <View style={[styles.statusBadge, { backgroundColor: animal.status === 'ACTIVE' ? '#E8F5E9' : '#F5F5F5' }]}>
                <Text style={[styles.statusText, { color: animal.status === 'ACTIVE' ? '#2E7D32' : '#616161' }]}>
                  {animal.status === 'ACTIVE' ? 'Activo' : animal.status}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCols}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Categoría</Text>
              <Text style={styles.infoValue}>{category}</Text>
            </View>
            <View style={styles.infoColDivider} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Sexo</Text>
              <Text style={styles.infoValue}>{animal.sex === 'M' ? 'Macho' : 'Hembra'}</Text>
            </View>
            <View style={styles.infoColDivider} />
            <View style={[styles.infoCol, { flex: 1.5 }]}>
              <Text style={styles.infoLabel}>Edad</Text>
              <Text style={styles.infoValue}>{ageFormatted}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoBottom}>
            <View style={styles.infoBottomCol}>
              <MaterialCommunityIcons name="weight" size={24} color={theme.colors.primary[800]} style={{marginRight: 8}} />
              <View>
                <Text style={styles.infoLabel}>Última pesada</Text>
                <Text style={styles.infoBigValue}>{lastWeighing ? Number(lastWeighing.weightKg).toFixed(1).replace('.0', '').replace('.', ',') : '0'} kg</Text>
              </View>
            </View>
            <View style={styles.infoColDivider} />
            <View style={[styles.infoBottomCol, { paddingLeft: 16 }]}>
              <View>
                <Text style={styles.infoLabel}>Fecha</Text>
                <Text style={styles.infoBigValue}>{lastWeighing ? new Date(lastWeighing.weighedAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'Resumen' && renderResumen()}
        {activeTab === 'Pesadas' && renderPesadas()}
        {activeTab === 'Eventos' && renderEventos()}

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
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  scrollContent: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  bigIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTitleBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoTag: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoCols: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  infoCol: {
    flex: 1,
  },
  infoColDivider: {
    width: 1,
    height: '100%',
    backgroundColor: theme.colors.border,
    marginHorizontal: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  infoSubValue: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: 16,
  },
  infoBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBottomCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBigValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#E6EBE5',
    borderRadius: 24,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: theme.colors.primary[800],
  },
  tabText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary[800],
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  historyLeft: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  historyAgo: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  historyWeight: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  historyRight: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border,
    paddingLeft: 12,
  },
  historyDiff: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyPct: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  historyDiffFirst: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  historyPctFirst: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  bottomSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary[800],
  },
  bottomSecondaryBtnText: {
    color: theme.colors.primary[800],
    fontSize: 16,
    fontWeight: '600',
  }
});

export default AnimalDetailScreen;
