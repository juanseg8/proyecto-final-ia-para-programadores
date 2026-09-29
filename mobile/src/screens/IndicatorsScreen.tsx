import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { AppScreen, AppHeader, EstablishmentSelector, IndicatorsDashboard } from '../components';
import { theme } from '../theme/theme';
import { apiClient } from '../apiClient';
import { useEstablishment } from '../EstablishmentContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface IndicatorsData {
  gmd?: number | null;
  tasaMortalidad?: number | null;
  tasaPrenez?: number | null;
  tasaDestete?: number | null;
  cargaAnimal?: number | null;
  gmdGramsDay?: number | null;
  stockingRateHeadsHa?: number | null;
  mortalityPct?: number | null;
}

const IndicatorsScreen = ({ navigation }: { navigation: any }) => {
  const { selectedEstablishmentId } = useEstablishment();
  const [indicators, setIndicators] = useState<IndicatorsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedEstablishmentId) {
      loadIndicators();
    } else {
      setIndicators(null);
    }
  }, [selectedEstablishmentId]);

  const loadIndicators = async () => {
    setLoading(true);
    try {
      const to = new Date();
      const from = new Date();
      from.setFullYear(to.getFullYear() - 1); // Ultimo año por defecto

      const toStr = to.toISOString().split('T')[0];
      const fromStr = from.toISOString().split('T')[0];

      const res = await apiClient.get(`/establishments/${selectedEstablishmentId}/indicators`, {
        params: { from: fromStr, to: toStr }
      });
      setIndicators(res.data);
    } catch (e) {
      console.log('Error loading indicators', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen style={styles.screen}>
      <AppHeader title="Indicadores" rightElement={<EstablishmentSelector />} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!selectedEstablishmentId ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="chart-box-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>Seleccioná un establecimiento arriba para analizar sus indicadores.</Text>
          </View>
        ) : (
          <IndicatorsDashboard 
            indicators={indicators} 
            loading={loading} 
            showBenchmark={true}
            establishmentId={selectedEstablishmentId}
          />
        )}
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: 16,
    marginTop: 16,
    paddingHorizontal: 32,
  }
});

export default IndicatorsScreen;
