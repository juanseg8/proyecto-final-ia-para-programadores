export interface BenchmarkConfig {
  K_MIN: number;
  scaleRanges: {
    initial: number;
    relaxed: number;
  };
  regions: {
    province: string;
    region: string;
    national: string;
  };
}

export function validateConfig(config: BenchmarkConfig): void {
  if (config.K_MIN < 10) {
    throw new Error('K_MIN must be at least 10');
  }
  if (config.scaleRanges.initial <= 0 || config.scaleRanges.relaxed <= 0) {
    throw new Error('Scale ranges must be positive');
  }
  if (config.scaleRanges.relaxed <= config.scaleRanges.initial) {
    throw new Error('Relaxed scale range must be greater than initial');
  }
}

export const DEFAULT_BENCHMARK_CONFIG: BenchmarkConfig = {
  K_MIN: 10,
  scaleRanges: {
    initial: 0.3,
    relaxed: 0.5,
  },
  regions: {
    province: 'province',
    region: 'region',
    national: 'national',
  },
};
