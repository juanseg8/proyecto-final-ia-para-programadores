import * as dotenv from 'dotenv';
dotenv.config();

export interface AlertsConfig {
  ALERT_BEN_GMD_LOW_PCT: number;
  ALERT_BEN_MORTALITY_HIGH_PCT: number;
  ALERT_BEN_COST_HIGH_PCT: number;
  ALERT_HIS_GMD_DROP_PCT: number;
  ALERT_HIS_MORTALITY_RISE_PP: number;
  ALERT_HIS_COST_RISE_PCT: number;
  ALERT_NO_WEIGHING_DAYS: number;
}

export const DEFAULT_ALERTS_CONFIG: AlertsConfig = {
  ALERT_BEN_GMD_LOW_PCT: Number(process.env.ALERT_BEN_GMD_LOW_PCT) || 10,
  ALERT_BEN_MORTALITY_HIGH_PCT: Number(process.env.ALERT_BEN_MORTALITY_HIGH_PCT) || 15,
  ALERT_BEN_COST_HIGH_PCT: Number(process.env.ALERT_BEN_COST_HIGH_PCT) || 10,
  ALERT_HIS_GMD_DROP_PCT: Number(process.env.ALERT_HIS_GMD_DROP_PCT) || 10,
  ALERT_HIS_MORTALITY_RISE_PP: Number(process.env.ALERT_HIS_MORTALITY_RISE_PP) || 0.5,
  ALERT_HIS_COST_RISE_PCT: Number(process.env.ALERT_HIS_COST_RISE_PCT) || 10,
  ALERT_NO_WEIGHING_DAYS: Number(process.env.ALERT_NO_WEIGHING_DAYS) || 30,
};
