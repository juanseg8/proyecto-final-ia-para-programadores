import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppCard } from './AppCard';
import theme from '../theme/theme';

interface Alert {
  code: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
}

interface AlertsCardProps {
  alerts: Alert[];
}

const AlertsCard: React.FC<AlertsCardProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return theme.colors.semantic.error;
      case 'WARNING':
        return theme.colors.semantic.warning;
      case 'INFO':
      default:
        return theme.colors.semantic.info;
    }
  };

  return (
    <AppCard title="Alertas">
      {alerts.map((alert, index) => (
        <View key={`${alert.code}-${index}`} style={styles.alertContainer}>
          <View style={[styles.indicator, { backgroundColor: getSeverityColor(alert.severity) }]} />
          <View style={styles.content}>
            <Text style={styles.title}>{alert.title}</Text>
            <Text style={styles.message}>{alert.message}</Text>
          </View>
        </View>
      ))}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing[12],
    alignItems: 'flex-start',
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: theme.spacing[8],
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  message: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

export default AlertsCard;
