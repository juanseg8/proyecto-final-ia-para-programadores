import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppCard } from './AppCard';
import theme from '../theme/theme';

interface BenchmarkCardProps {
  benchmarkSummary: any;
  indicators: any;
}

const BenchmarkCard: React.FC<BenchmarkCardProps> = ({ benchmarkSummary, indicators }) => {
  if (!benchmarkSummary || Object.keys(benchmarkSummary).length === 0) {
    return null;
  }

  const renderComparison = (label: string, indKey: string, formatValue: (v: number) => string) => {
    const b = benchmarkSummary[indKey];
    if (!b || b.status === 'DATOS_INSUFICIENTES') return null;

    const myValue = indicators?.[indKey];

    return (
      <View style={styles.itemContainer} key={indKey}>
        <Text style={styles.itemTitle}>{label}</Text>
        <View style={styles.comparisonRow}>
          <View style={styles.col}>
            <Text style={styles.colLabel}>Tu campo</Text>
            <Text style={styles.colValue}>{myValue !== null && myValue !== undefined ? formatValue(myValue) : '-'}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.colLabel}>Similares</Text>
            <Text style={styles.colValue}>{formatValue(b.median)}</Text>
          </View>
        </View>
        <Text style={styles.peerText}>Basado en {b.peerGroupSize} establecimientos similares</Text>
      </View>
    );
  };

  const hasData = Object.values(benchmarkSummary).some((b: any) => b.status !== 'DATOS_INSUFICIENTES');

  if (!hasData) return null;

  return (
    <AppCard title="Tu campo vs Similares">
      {renderComparison('Ganancia Media Diaria (GMD)', 'gmdGramsDay', (v) => `${Math.round(v)} g/día`)}
      {renderComparison('Carga Animal', 'stockingRateHeadsHa', (v) => `${v.toFixed(2)} cab/ha`)}
      {renderComparison('Mortandad', 'mortalityPct', (v) => `${v.toFixed(2)}%`)}
      {renderComparison('Costo por Kg', 'costPerKgProduced', (v) => `$${v.toFixed(2)}`)}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: theme.spacing[16],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing[12],
  },
  itemTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[8],
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[8],
  },
  col: {
    flex: 1,
  },
  colLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  colValue: {
    fontSize: theme.typography.h3.fontSize,
    color: theme.colors.textPrimary,
  },
  peerText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default BenchmarkCard;
