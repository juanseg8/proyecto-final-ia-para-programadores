import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { apiClient } from '../apiClient';

interface IndicatorsData {
  gmd?: number | null;
  tasaMortalidad?: number | null;
  tasaPrenez?: number | null;
  tasaDestete?: number | null;
  cargaAnimal?: number | null;
  gmdGramsDay?: number | null;
  stockingRateHeadsHa?: number | null;
  mortalityPct?: number | null;
  pregnancyPct?: number | null;
  weaningPct?: number | null;
}

interface Props {
  indicators: IndicatorsData | null;
  loading: boolean;
  onRefreshRequest?: () => void;
  showBenchmark?: boolean;
  establishmentId?: string;
}

export const IndicatorsDashboard: React.FC<Props> = ({ indicators, loading, onRefreshRequest, showBenchmark = false, establishmentId }) => {
  const [benchmarkData, setBenchmarkData] = useState<any>(null);
  const [benchmarkPregnancyData, setBenchmarkPregnancyData] = useState<any>(null);
  const [loadingBenchmark, setLoadingBenchmark] = useState(false);

  useEffect(() => {
    if (showBenchmark && establishmentId) {
      loadBenchmarkTeaser();
    }
  }, [showBenchmark, establishmentId]);

  const loadBenchmarkTeaser = async () => {
    try {
      setLoadingBenchmark(true);
      const to = new Date();
      const from = new Date();
      from.setFullYear(to.getFullYear() - 1);
      const toStr = to.toISOString().split('T')[0];
      const fromStr = from.toISOString().split('T')[0];
      
      const [resGmd, resPregnancy] = await Promise.all([
        apiClient.get(`/establishments/${establishmentId}/benchmark/gmdGramsDay`, { params: { from: fromStr, to: toStr } }).catch(() => ({ data: { status: 'ERROR' } })),
        apiClient.get(`/establishments/${establishmentId}/benchmark/pregnancyPct`, { params: { from: fromStr, to: toStr } }).catch(() => ({ data: { status: 'ERROR' } }))
      ]);

      if (resGmd.data.status === 'OK' || resGmd.data.status === 'SUCCESS' || resGmd.data.median) {
        setBenchmarkData(resGmd.data);
      } else {
        setBenchmarkData('INSUFFICIENT');
      }

      if (resPregnancy.data.status === 'OK' || resPregnancy.data.status === 'SUCCESS' || resPregnancy.data.median) {
        setBenchmarkPregnancyData(resPregnancy.data);
      } else {
        setBenchmarkPregnancyData('INSUFFICIENT');
      }

    } catch (e) {
      setBenchmarkData('ERROR');
      setBenchmarkPregnancyData('ERROR');
    } finally {
      setLoadingBenchmark(false);
    }
  };
  const renderKpi = (title: string, value: number | string | null | undefined, unit: string, icon: keyof typeof MaterialCommunityIcons.glyphMap, color: string, isBig = false) => (
    <View style={[styles.kpiCard, isBig && styles.kpiCardBig]}>
      <View style={[styles.iconCircle, isBig && { marginBottom: 0, marginRight: 16 }, { backgroundColor: color + '1A' }]}>
        <MaterialCommunityIcons name={icon} size={isBig ? 32 : 24} color={color} />
      </View>
      <View style={styles.kpiContent}>
        <Text style={styles.kpiValue}>
          {value != null ? Number(value).toFixed(2) : '-'} <Text style={styles.kpiUnit}>{unit}</Text>
        </Text>
        <Text style={styles.kpiTitle}>{title}</Text>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color={theme.colors.primary[600]} style={{ marginTop: 40 }} />;
  }

  // Use API values, mapping correctly from backend properties
  const gmd = indicators?.gmd ?? indicators?.gmdGramsDay ?? null;
  const cargaAnimal = indicators?.cargaAnimal ?? indicators?.stockingRateHeadsHa ?? null;
  const tasaMortalidad = indicators?.tasaMortalidad ?? indicators?.mortalityPct ?? null;
  const tasaPrenez = indicators?.tasaPrenez ?? indicators?.pregnancyPct ?? null;
  const tasaDestete = indicators?.tasaDestete ?? indicators?.weaningPct ?? null;

  const hasNoData = gmd === null && cargaAnimal === null && tasaMortalidad === null && tasaPrenez === null && tasaDestete === null;

  if (hasNoData) {
    return (
      <AppCard style={styles.sectionCard}>
        <View style={styles.emptyStateContainer}>
          <MaterialCommunityIcons name="chart-bar" size={40} color={theme.colors.neutral[300]} style={{marginBottom: 12}} />
          <Text style={styles.emptyStateTitle}>Faltan datos productivos</Text>
          <Text style={styles.emptyStateText}>Para calcular indicadores y visualizar métricas de rendimiento, es necesario cargar los datos productivos del campo.</Text>
          {onRefreshRequest && (
            <AppButton 
              title="Cargar datos" 
              onPress={onRefreshRequest}
              style={{marginTop: 16}}
            />
          )}
        </View>
      </AppCard>
    );
  }

  return (
    <View>
      <View style={styles.headerBox}>
        <Text style={styles.periodTitle}>Resumen de Indicadores</Text>
      </View>

      <View style={styles.featuredContainer}>
        {renderKpi('Ganancia Media Diaria (GMD)', gmd, 'g/día', 'scale-bathroom', theme.colors.primary[800], true)}
      </View>

      <View style={styles.kpiGrid}>
        {renderKpi('Carga Animal', cargaAnimal, 'EV/ha', 'grass', theme.colors.secondary[700])}
        {renderKpi('Tasa de Mortalidad', tasaMortalidad, '%', 'heart-broken', '#D32F2F')}
        {renderKpi('Tasa de Preñez', tasaPrenez, '%', 'heart-plus', theme.colors.primary[600])}
        {renderKpi('Tasa de Destete', tasaDestete, '%', 'cow', theme.colors.primary[600])}
      </View>

      <View style={styles.infoBox}>
        <MaterialCommunityIcons name="information-outline" size={20} color={theme.colors.primary[800]} style={{marginRight: 8, marginTop: 2}} />
        <Text style={styles.infoText}>Mantené los registros de tus animales al día para obtener indicadores productivos más precisos.</Text>
      </View>

      {showBenchmark && (
        (() => {
          const getRegionName = (region?: string) => {
            if (region === 'province') return 'tu provincia';
            if (region === 'national') return 'todo el país';
            return 'tu zona';
          };
          return (
            <>
              <AppCard style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Benchmark Zonal (GMD)</Text>
            {loadingBenchmark ? (
              <ActivityIndicator size="small" color={theme.colors.primary[600]} style={{ marginVertical: 20 }} />
            ) : benchmarkData && benchmarkData !== 'INSUFFICIENT' && benchmarkData !== 'ERROR' ? (
              <View>
                <Text style={{ fontSize: 14, color: theme.colors.neutral[600], marginBottom: 16 }}>
                  Comparativa con {benchmarkData.peerGroupSize} establecimientos en {getRegionName(benchmarkData.criteria?.region)}:
                </Text>
                {(() => {
                  const myVal = Number(benchmarkData.myValue ?? benchmarkData.establishmentValue ?? gmd ?? 0);
                  const avgVal = Number(benchmarkData.avgValue ?? benchmarkData.regionalAverage ?? benchmarkData.median ?? 0);
                  const isBelow = myVal < avgVal;
                  const safeMax = Math.max(myVal, avgVal) || 1;
                  const myWidth = (myVal / safeMax) * 100;
                  const avgWidth = (avgVal / safeMax) * 100;
                  const myColor = isBelow ? theme.colors.semantic.warning : theme.colors.primary[500];

                  return (
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, color: theme.colors.neutral[700] }}>Tu campo</Text>
                          <View style={{ height: 8, backgroundColor: myColor, borderRadius: 4, width: `${myWidth}%`, marginTop: 4 }} />
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: myColor, marginLeft: 8, width: 75, textAlign: 'right' }}>
                          {myVal.toFixed(0)} g/día
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, color: theme.colors.neutral[500] }}>Promedio zonal</Text>
                          <View style={{ height: 8, backgroundColor: theme.colors.neutral[300], borderRadius: 4, width: `${avgWidth}%`, marginTop: 4 }} />
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.neutral[500], marginLeft: 8, width: 75, textAlign: 'right' }}>
                          {avgVal.toFixed(0)} g/día
                        </Text>
                      </View>
                    </View>
                  );
                })()}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <MaterialCommunityIcons name="compare" size={40} color={theme.colors.neutral[300]} style={{marginBottom: 12}} />
                <Text style={styles.emptyStateTitle}>Sin comparativa</Text>
                <Text style={styles.emptyStateText}>No hay suficientes establecimientos en la zona con datos públicos para generar un benchmark confiable.</Text>
              </View>
            )}
          </AppCard>

          <AppCard style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Benchmark Zonal (Preñez)</Text>
            {loadingBenchmark ? (
              <ActivityIndicator size="small" color={theme.colors.primary[600]} style={{ marginVertical: 20 }} />
            ) : benchmarkPregnancyData && benchmarkPregnancyData !== 'INSUFFICIENT' && benchmarkPregnancyData !== 'ERROR' ? (
              <View>
                <Text style={{ fontSize: 14, color: theme.colors.neutral[600], marginBottom: 16 }}>
                  Comparativa con {benchmarkPregnancyData.peerGroupSize} establecimientos en {getRegionName(benchmarkPregnancyData.criteria?.region)}:
                </Text>
                {(() => {
                  const myVal = Number(benchmarkPregnancyData.myValue ?? benchmarkPregnancyData.establishmentValue ?? tasaPrenez ?? 0);
                  const avgVal = Number(benchmarkPregnancyData.avgValue ?? benchmarkPregnancyData.regionalAverage ?? benchmarkPregnancyData.median ?? 0);
                  const isBelow = myVal < avgVal;
                  const safeMax = Math.max(myVal, avgVal) || 1;
                  const myWidth = (myVal / safeMax) * 100;
                  const avgWidth = (avgVal / safeMax) * 100;
                  const myColor = isBelow ? theme.colors.semantic.warning : theme.colors.primary[500];

                  return (
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, color: theme.colors.neutral[700] }}>Tu campo</Text>
                          <View style={{ height: 8, backgroundColor: myColor, borderRadius: 4, width: `${myWidth}%`, marginTop: 4 }} />
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: myColor, marginLeft: 8, width: 75, textAlign: 'right' }}>
                          {myVal.toFixed(1)} %
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, color: theme.colors.neutral[500] }}>Promedio zonal</Text>
                          <View style={{ height: 8, backgroundColor: theme.colors.neutral[300], borderRadius: 4, width: `${avgWidth}%`, marginTop: 4 }} />
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.neutral[500], marginLeft: 8, width: 75, textAlign: 'right' }}>
                          {avgVal.toFixed(1)} %
                        </Text>
                      </View>
                    </View>
                  );
                })()}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <MaterialCommunityIcons name="compare" size={40} color={theme.colors.neutral[300]} style={{marginBottom: 12}} />
                <Text style={styles.emptyStateTitle}>Sin comparativa</Text>
                <Text style={styles.emptyStateText}>No hay suficientes establecimientos en la zona con datos públicos para generar un benchmark confiable.</Text>
              </View>
            )}
          </AppCard>
            </>
          );
        })()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerBox: {
    marginBottom: 20,
    marginTop: 8,
  },
  periodTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  periodSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  featuredContainer: {
    marginBottom: 16,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  kpiCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'flex-start',
  },
  kpiCardBig: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  kpiContent: {
    flex: 1,
  },
  kpiContentBig: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  kpiValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  kpiUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: theme.colors.textSecondary,
  },
  kpiTitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    color: theme.colors.primary[900],
    fontSize: 13,
    lineHeight: 20,
  },
  sectionCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  emptyStateContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.neutral[50],
    borderRadius: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.neutral[700],
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: theme.colors.neutral[500],
    textAlign: 'center',
    lineHeight: 20,
  }
});
