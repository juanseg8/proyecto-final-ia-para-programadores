import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppCard } from './AppCard';
import theme from '../theme/theme';

interface KpiCardProps {
  indicators: any;
}

const KpiCard: React.FC<KpiCardProps> = ({ indicators }) => {
  if (!indicators) return null;

  return (
    <AppCard title="Indicadores Productivos">
      <View style={styles.row}>
        <View style={styles.kpi}>
          <Text style={styles.label}>GMD</Text>
          <Text style={styles.value}>
            {indicators.gmdGramsDay !== null ? `${Math.round(indicators.gmdGramsDay)} g/día` : '-'}
          </Text>
        </View>
        <View style={styles.kpi}>
          <Text style={styles.label}>Carga</Text>
          <Text style={styles.value}>
            {indicators.stockingRateHeadsHa !== null ? `${indicators.stockingRateHeadsHa.toFixed(2)} cab/ha` : '-'}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.kpi}>
          <Text style={styles.label}>Mortandad</Text>
          <Text style={styles.value}>
            {indicators.mortalityPct !== null ? `${indicators.mortalityPct.toFixed(2)}%` : '-'}
          </Text>
        </View>
        <View style={styles.kpi}>
          <Text style={styles.label}>Costo/kg</Text>
          <Text style={styles.value}>
            {indicators.costPerKgProduced !== null ? `$${indicators.costPerKgProduced.toFixed(2)}` : '-'}
          </Text>
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[16],
  },
  kpi: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[4],
  },
  value: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
});

export default KpiCard;
