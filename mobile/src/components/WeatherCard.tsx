import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AppCard } from './AppCard';
import { apiClient } from '../apiClient';
import { theme } from '../theme/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface WeatherProps {
  establishmentId: string;
}

const getWeatherIconInfo = (code?: number) => {
  if (code === undefined) return { name: 'weather-partly-cloudy', color: theme.colors.primary[600] };
  if (code === 0) return { name: 'weather-sunny', color: '#F59E0B' };
  if (code >= 1 && code <= 3) return { name: 'weather-partly-cloudy', color: '#6B7280' };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { name: 'weather-pouring', color: '#3B82F6' };
  if (code >= 71 && code <= 86) return { name: 'weather-snowy', color: '#60A5FA' };
  if (code >= 95) return { name: 'weather-lightning', color: '#8B5CF6' };
  return { name: 'weather-cloudy', color: '#6B7280' };
};

const formatDate = (dateString: string, index: number) => {
  if (index === 0) return 'Hoy';
  if (index === 1) return 'Mañana';
  const d = new Date(dateString);
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return days[d.getUTCDay()];
};

const formatDateNumber = (dateString: string) => {
  const d = new Date(dateString);
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]}`;
};

const WeatherCard: React.FC<WeatherProps> = ({ establishmentId }) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/establishments/${establishmentId}/weather`);
        if (mounted) {
          if (response.data.status === 'UNAVAILABLE') {
            setError(true);
          } else {
            setWeather(response.data);
            setError(false);
          }
        }
      } catch (err) {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchWeather();
    return () => { mounted = false; };
  }, [establishmentId]);

  if (loading) {
    return (
      <AppCard style={styles.card}>
        <ActivityIndicator size="large" color={theme.colors.primary[600]} style={{ margin: 24 }} />
      </AppCard>
    );
  }

  if (error || !weather) {
    return (
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Clima actual</Text>
        </View>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="weather-cloudy-alert" size={40} color={theme.colors.neutral[300]} style={{marginBottom: 8}} />
          <Text style={styles.errorText}>Información meteorológica no disponible temporalmente.</Text>
        </View>
      </AppCard>
    );
  }

  const { current, daily } = weather;
  const iconInfo = getWeatherIconInfo(current.weatherCode);

  return (
    <View>
      {/* Current Weather Card */}
      <AppCard style={styles.card} contentStyle={{ padding: 0 }}>
        <View style={styles.currentSection}>
          <View style={styles.header}>
            <Text style={styles.title}>Clima actual</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
          </View>

          <View style={styles.currentContainer}>
            <MaterialCommunityIcons name={iconInfo.name as any} size={72} color={iconInfo.color} style={styles.mainIcon} />
            <View style={styles.tempContainer}>
              <Text style={styles.temp}>{current.temperatureC}°</Text>
              <Text style={styles.feelsLike}>Sensación {current.apparentTemperatureC}°</Text>
            </View>
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="weather-windy" size={16} color={theme.colors.neutral[500]} />
                <Text style={styles.detailText}>{current.windSpeedKmh} km/h</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="water-outline" size={16} color={theme.colors.neutral[500]} />
                <Text style={styles.detailText}>{current.precipitationMm} mm</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="water-percent" size={16} color={theme.colors.neutral[500]} />
                <Text style={styles.detailText}>{current.humidityPct ?? '--'}%</Text>
              </View>
            </View>
          </View>
        </View>
      </AppCard>

      {/* Forecast Card */}
      {daily && daily.length > 1 && (
        <AppCard style={styles.card} contentStyle={{ padding: 0 }}>
          <View style={styles.forecastSection}>
            <Text style={styles.forecastTitle}>Pronóstico</Text>
            {daily.slice(1, 4).map((day: any, index: number) => {
              const realIndex = index + 1;
              const dayIconInfo = getWeatherIconInfo(day.weatherCode);
              return (
                <View key={day.date} style={styles.forecastRow}>
                  <View style={styles.forecastDayContainer}>
                    <Text style={styles.forecastDay}>{formatDate(day.date, realIndex)}</Text>
                    <Text style={styles.forecastDateText}>{formatDateNumber(day.date)}</Text>
                  </View>
                  
                  <View style={styles.forecastIconContainer}>
                    <MaterialCommunityIcons name={dayIconInfo.name as any} size={24} color={dayIconInfo.color} />
                  </View>

                  <View style={styles.forecastTemps}>
                    <Text style={styles.tempMin}>{Math.round(day.tempMinC)}°</Text>
                    <View style={styles.tempBar}>
                      <View style={styles.tempBarInner} />
                    </View>
                    <Text style={styles.tempMax}>{Math.round(day.tempMaxC)}°</Text>
                  </View>

                  <View style={styles.forecastRain}>
                    <MaterialCommunityIcons 
                      name="water-outline" 
                      size={14} 
                      color={day.precipitationProbabilityPct > 0 ? theme.colors.primary[600] : theme.colors.neutral[400]} 
                    />
                    <Text style={[
                      styles.forecastProb, 
                      day.precipitationProbabilityPct > 0 && { color: theme.colors.primary[700], fontWeight: 'bold' }
                    ]}>
                      {day.precipitationProbabilityPct}%
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View style={styles.footer}>
            <Text style={styles.provider}>Provisto por {weather.provider}</Text>
          </View>
        </AppCard>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.lg,
  },
  currentSection: {
    padding: theme.spacing.xl,
    backgroundColor: '#F3F7F5', // Very subtle green/gray tint
    borderRadius: theme.radius.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.neutral[900],
  },
  date: {
    fontSize: theme.typography.label.fontSize,
    color: theme.colors.neutral[500],
    textTransform: 'capitalize',
  },
  currentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainIcon: {
    marginRight: theme.spacing.md,
  },
  tempContainer: {
    flex: 1,
  },
  temp: {
    fontSize: 42,
    fontWeight: 'bold',
    color: theme.colors.neutral[900],
    lineHeight: 48,
  },
  feelsLike: {
    fontSize: theme.typography.label.fontSize,
    color: theme.colors.neutral[500],
    marginTop: -2,
  },
  details: {
    justifyContent: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.neutral[600],
    marginLeft: 6,
  },
  forecastSection: {
    padding: theme.spacing.lg,
  },
  forecastTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.md,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[100],
  },
  forecastDayContainer: {
    width: 70,
  },
  forecastDay: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.neutral[900],
    fontWeight: '500',
  },
  forecastDateText: {
    fontSize: 11,
    color: theme.colors.neutral[500],
    marginTop: 2,
  },
  forecastIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  forecastTemps: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  forecastRain: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 50,
    justifyContent: 'flex-end',
  },
  forecastProb: {
    fontSize: theme.typography.label.fontSize,
    color: theme.colors.neutral[500],
    marginLeft: 4,
  },
  tempMin: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.neutral[500],
    minWidth: 36,
    textAlign: 'right',
  },
  tempBar: {
    width: 32,
    height: 4,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 2,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  tempBarInner: {
    width: '60%',
    height: '100%',
    backgroundColor: theme.colors.primary[300],
    marginLeft: '20%',
    borderRadius: 2,
  },
  tempMax: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.neutral[900],
    fontWeight: '500',
    minWidth: 36,
    textAlign: 'right',
  },
  footer: {
    padding: theme.spacing.md,
    paddingTop: 0,
    alignItems: 'flex-end',
  },
  provider: {
    fontSize: 10,
    color: theme.colors.neutral[400],
  },
  errorContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.neutral[500],
    textAlign: 'center',
  }
});

export default WeatherCard;
