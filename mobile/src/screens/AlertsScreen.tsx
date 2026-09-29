import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AppScreen, AppHeader, AppCard, EstablishmentSelector } from '../components';
import { theme } from '../theme/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../apiClient';
import { useEstablishment } from '../EstablishmentContext';

interface AlertData {
  code: string;
  category: 'BENCHMARK' | 'HISTORIC' | 'STATUS' | 'WEATHER' | 'NEWS';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  metric: string;
  currentValue: number | null;
  referenceValue?: number | null;
  createdAt: string;
}

const getAlertTip = (code: string) => {
  switch (code) {
    case 'EST-01': return 'Organizar una jornada de pesaje te ayudará a no perder de vista la evolución del lote.';
    case 'EST-02': return 'Ir a Configuración para completar los datos productivos.';
    case 'BEN-01': return 'Revisar la disponibilidad forrajera, sanidad del rodeo y calidad del agua.';
    case 'BEN-02': return 'Consultar urgente con el veterinario el plan sanitario y revisar el estado de los bebederos.';
    case 'BEN-03': return 'Analizar los últimos gastos operativos y buscar alternativas de suplementación.';
    case 'BEN-04': return 'Ajustar la carga ayuda a mantener la receptividad del lote a largo plazo.';
    case 'HIS-01': return 'Comparar el régimen de lluvias actual con el del año pasado para evaluar si falta pasto.';
    case 'HIS-02': return 'Investigar si hubo brotes de enfermedades locales recientemente.';
    case 'WEA-01': return 'Preparar aguadas y verificar que haya sombra disponible para todos los lotes.';
    case 'WEA-02': return 'Armar cortafuegos y evitar cualquier quema de pastizales en estos días.';
    case 'WEA-03': return 'Revisar drenajes y asegurar la accesibilidad a lotes bajos.';
    case 'NEW-01': return 'Contactá a tu banco para evaluar las tasas de esta nueva línea.';
    case 'NEW-02': return 'Agendá la fecha con tu veterinario para asegurar disponibilidad de dosis.';
    case 'NEW-03': return 'Buena oportunidad para evaluar la reposición de reproductores.';
    default: return 'Agro IA: Analizamos tus datos y el contexto para darte esta recomendación.';
  }
};

const getAlertIcon = (category: string) => {
  switch (category) {
    case 'BENCHMARK': return 'compare';
    case 'HISTORIC': return 'history';
    case 'STATUS': return 'alert-circle-outline';
    case 'WEATHER': return 'weather-partly-lightning';
    case 'NEWS': return 'newspaper-variant-outline';
    default: return 'bell-outline';
  }
};

const getAlertColor = (severity: string) => {
  switch (severity) {
    case 'CRITICAL': return theme.colors.semantic.error;
    case 'WARNING': return theme.colors.semantic.warning;
    case 'INFO': return theme.colors.semantic.info;
    default: return theme.colors.primary[500];
  }
};

const formatMetric = (metric: string, val: number) => {
  if (metric === 'gmdGramsDay') return `${val.toFixed(0)} g/día`;
  if (metric === 'mortalityPct' || metric === 'pregnancyPct' || metric === 'weaningPct') return `${val.toFixed(1)} %`;
  if (metric === 'stockingRateHeadsHa') return `${val.toFixed(2)} EV/ha`;
  if (metric === 'costPerKgProduced') return `$${val.toFixed(2)}`;
  return val.toString();
};

const AlertsScreen = ({ navigation }: { navigation: any }) => {
  const { selectedEstablishmentId } = useEstablishment();
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedEstablishmentId) {
      loadAlerts();
    } else {
      setAlerts([]);
    }
  }, [selectedEstablishmentId]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 365); // Ultimo año para tener mas contexto

      const res = await apiClient.get(`/establishments/${selectedEstablishmentId}/alerts`, {
        params: { from: from.toISOString(), to: to.toISOString() }
      });
      
      // Ordenar por severidad y fecha
      const sorted = res.data.sort((a: AlertData, b: AlertData) => {
        const sevA = a.severity === 'CRITICAL' ? 3 : a.severity === 'WARNING' ? 2 : 1;
        const sevB = b.severity === 'CRITICAL' ? 3 : b.severity === 'WARNING' ? 2 : 1;
        if (sevA !== sevB) return sevB - sevA;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setAlerts(sorted);
    } catch (e) {
      console.log('Error loading alerts', e);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedEstablishmentId) {
    return (
      <AppScreen style={styles.screen}>
        <AppHeader title="Alertas" rightElement={<EstablishmentSelector />} />
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="bell-off-outline" size={64} color={theme.colors.neutral[300]} />
          <Text style={styles.emptyTitle}>Seleccioná un establecimiento arriba para ver tus alertas.</Text>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen style={styles.screen}>
      <AppHeader title="Alertas" rightElement={<EstablishmentSelector />} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageDescription}>
          Agro IA analiza tus datos y los compara con tu zona y tu historial para detectar oportunidades de mejora.
        </Text>
        
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary[600]} style={{ marginTop: 40 }} />
        ) : alerts.length > 0 ? (
          alerts.map((alert, index) => {
            const color = getAlertColor(alert.severity);
            const icon = getAlertIcon(alert.category);
            
            return (
              <AppCard key={index} style={[styles.alertCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
                <View style={styles.headerRow}>
                  <View style={[styles.iconBox, { backgroundColor: color + '1A' }]}>
                    <MaterialCommunityIcons name={icon} size={22} color={color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertDate}>
                      {new Date(alert.createdAt).toLocaleDateString('es-AR', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.alertMessage}>{alert.message}</Text>
                
                {(alert.currentValue != null && alert.referenceValue != null) && (
                  <View style={styles.metricContainer}>
                    <View style={styles.metricRow}>
                      <Text style={styles.metricLabel}>Tu campo:</Text>
                      <Text style={[styles.metricValue, { color }]}>{formatMetric(alert.metric, alert.currentValue)}</Text>
                    </View>
                    <View style={styles.metricRow}>
                      <Text style={styles.metricLabel}>{alert.category === 'BENCHMARK' ? 'Promedio Zonal:' : 'Histórico:'}</Text>
                      <Text style={styles.metricValueRef}>{formatMetric(alert.metric, alert.referenceValue)}</Text>
                    </View>
                  </View>
                )}
                
                <View style={styles.tipContainer}>
                  <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color={theme.colors.accent[500]} />
                  <Text style={styles.tipText}>{getAlertTip(alert.code)}</Text>
                </View>
              </AppCard>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="check-decagram" size={64} color={theme.colors.semantic.success} />
            <Text style={styles.emptyTitle}>¡Todo en orden!</Text>
            <Text style={styles.emptySubtitle}>No detectamos ninguna alerta crítica ni desvíos productivos en tu campo.</Text>
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.neutral[50],
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  pageDescription: {
    fontSize: 14,
    color: theme.colors.neutral[600],
    marginBottom: 20,
    lineHeight: 20,
  },
  alertCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  alertDate: {
    fontSize: 12,
    color: theme.colors.neutral[500],
  },
  alertMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  metricContainer: {
    backgroundColor: theme.colors.neutral[50],
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  metricLabel: {
    fontSize: 13,
    color: theme.colors.neutral[600],
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  metricValueRef: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.neutral[600],
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.accent[50],
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.accent[900],
    marginLeft: 8,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  }
});

export default AlertsScreen;
