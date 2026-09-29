import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { AppScreen, AppHeader, AppCard, EstablishmentSelector } from '../components';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../apiClient';
import { useEstablishment } from '../EstablishmentContext';

interface BenchmarkMetric {
  title: string;
  myValue: number | null;
  avgValue: number | null;
  unit: string;
  better: boolean;
  status: string;
}

const BenchmarkScreen = () => {
  const { selectedEstablishmentId } = useEstablishment();
  const [selectedPeriod, setSelectedPeriod] = useState('Último año');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<BenchmarkMetric[]>([]);

  useEffect(() => {
    if (selectedEstablishmentId) {
      loadBenchmark();
    } else {
      setMetrics([]);
    }
  }, [selectedEstablishmentId, selectedPeriod]);

  const loadBenchmark = async () => {
    setLoading(true);
    try {
      const to = new Date();
      const from = new Date();
      if (selectedPeriod === 'Último mes') from.setMonth(to.getMonth() - 1);
      else if (selectedPeriod === 'Último trimestre') from.setMonth(to.getMonth() - 3);
      else from.setFullYear(to.getFullYear() - 1); // Último año

      const toStr = to.toISOString().split('T')[0];
      const fromStr = from.toISOString().split('T')[0];

      const indicatorKeys = [
        { key: 'gmdGramsDay', title: 'Ganancia Media Diaria (GMD)', unit: 'g/día', higherIsBetter: true },
        { key: 'stockingRateHeadsHa', title: 'Carga Animal', unit: 'EV/ha', higherIsBetter: true },
        { key: 'mortalityPct', title: 'Tasa de Mortalidad', unit: '%', higherIsBetter: false }
      ];

      const newMetrics: BenchmarkMetric[] = [];

      for (const ind of indicatorKeys) {
        try {
          const res = await apiClient.get(`/establishments/${selectedEstablishmentId}/benchmark/${ind.key}`, {
            params: { from: fromStr, to: toStr }
          });
          if (res.data.status === 'OK' || res.data.status === 'SUCCESS') {
            const myVal = res.data.myValue ?? res.data.establishmentValue;
            const avgVal = res.data.avgValue ?? res.data.regionalAverage;
            
            newMetrics.push({
              title: ind.title,
              myValue: typeof myVal === 'number' ? Number(myVal.toFixed(2)) : null,
              avgValue: typeof avgVal === 'number' ? Number(avgVal.toFixed(2)) : null,
              unit: ind.unit,
              better: ind.higherIsBetter ? (myVal >= avgVal) : (myVal <= avgVal),
              status: 'OK'
            });
          } else {
            newMetrics.push({
              title: ind.title,
              myValue: null,
              avgValue: null,
              unit: ind.unit,
              better: false,
              status: res.data.status || 'DATOS_INSUFICIENTES'
            });
          }
        } catch (e) {
           newMetrics.push({
              title: ind.title,
              myValue: null,
              avgValue: null,
              unit: ind.unit,
              better: false,
              status: 'ERROR'
           });
        }
      }
      setMetrics(newMetrics);
    } catch (e) {
      console.log('Error loading benchmark', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen style={styles.screen}>
      <AppHeader title="Benchmark Zonal" rightElement={<EstablishmentSelector />} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary[600]} />
          <Text style={styles.infoText}>
            Compara tus indicadores con el promedio de productores en tu misma zona (Radio de 50km).
          </Text>
        </View>

        <View style={styles.periodSelector}>
          {['Último mes', 'Último trimestre', 'Último año'].map((period) => (
            <View 
              key={period} 
              style={[styles.periodPill, selectedPeriod === period && styles.periodPillActive]}
            >
              <Text style={[styles.periodText, selectedPeriod === period && styles.periodTextActive]}>
                {period}
              </Text>
            </View>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary[600]} style={{ marginTop: 40 }} />
        ) : metrics.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40 }}>No hay datos disponibles.</Text>
        ) : metrics.map((metric, index) => (
          <AppCard key={index} style={styles.metricCard}>
            <Text style={styles.metricTitle}>{metric.title}</Text>
            
            
            {metric.status !== 'OK' && metric.status !== 'SUCCESS' ? (
              <View style={{ marginTop: theme.spacing.md, padding: theme.spacing.md, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                 <Text style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
                   {metric.status === 'DATOS_INSUFICIENTES' ? 'Datos insuficientes en la zona para calcular este benchmark asegurando anonimidad.' : 'Error al obtener datos.'}
                 </Text>
              </View>
            ) : (
              <>
                <View style={styles.comparisonContainer}>
                  <View style={styles.valueColumn}>
                    <Text style={styles.valueLabel}>Tu campo</Text>
                    <Text style={[styles.value, metric.better ? styles.valueGood : styles.valueBad]}>
                      {metric.myValue ?? '-'} <Text style={styles.unit}>{metric.unit}</Text>
                    </Text>
                  </View>
                  
                  <View style={styles.divider} />
                  
                  <View style={styles.valueColumn}>
                    <Text style={styles.valueLabel}>Promedio zonal</Text>
                    <Text style={styles.value}>
                      {metric.avgValue ?? '-'} <Text style={styles.unit}>{metric.unit}</Text>
                    </Text>
                  </View>
                </View>

                {/* Visual Bar */}
                {metric.myValue !== null && metric.avgValue !== null && (
                  <View style={styles.barContainer}>
                    <View style={styles.barBackground}>
                      {/* My Value Bar */}
                      <View 
                        style={[
                          styles.barFill, 
                          { width: `${Math.min((metric.myValue / (Math.max(metric.myValue, metric.avgValue) * 1.2)) * 100, 100)}%` },
                          metric.better ? styles.bgGood : styles.bgBad
                        ]} 
                      />
                    </View>
                    
                    {/* Avg Value Marker */}
                    <View style={[
                      styles.avgMarker, 
                      { left: `${Math.min((metric.avgValue / (Math.max(metric.myValue, metric.avgValue) * 1.2)) * 100, 100)}%` }
                    ]} />
                  </View>
                )}
                
                <View style={styles.resultRow}>
                  <Ionicons 
                    name={metric.better ? "trending-up" : "trending-down"} 
                    size={16} 
                    color={metric.better ? theme.colors.semantic.success : theme.colors.semantic.error} 
                  />
                  <Text style={[styles.resultText, { color: metric.better ? theme.colors.semantic.success : theme.colors.semantic.error }]}>
                    {metric.better ? 'Mejor que el promedio' : 'Por debajo del promedio'}
                  </Text>
                </View>
              </>
            )}
          </AppCard>
        ))}
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
    paddingBottom: 100,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary[50],
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  infoText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    color: theme.colors.primary[800],
    fontSize: theme.typography.caption.fontSize,
    lineHeight: 18,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  periodPill: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  periodPillActive: {
    backgroundColor: theme.colors.primary[600],
    borderColor: theme.colors.primary[600],
  },
  periodText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  periodTextActive: {
    color: theme.colors.surface,
  },
  metricCard: {
    marginBottom: theme.spacing.lg,
  },
  metricTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  valueColumn: {
    flex: 1,
  },
  valueLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  valueGood: {
    color: theme.colors.semantic.success,
  },
  valueBad: {
    color: theme.colors.semantic.error,
  },
  unit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: theme.colors.textSecondary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
  barContainer: {
    position: 'relative',
    height: 8,
    marginBottom: theme.spacing.md,
  },
  barBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  bgGood: {
    backgroundColor: theme.colors.semantic.success,
  },
  bgBad: {
    backgroundColor: theme.colors.semantic.error,
  },
  avgMarker: {
    position: 'absolute',
    top: -4,
    bottom: -4,
    width: 4,
    backgroundColor: theme.colors.textPrimary,
    borderRadius: 2,
    zIndex: 1,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  }
});

export default BenchmarkScreen;
