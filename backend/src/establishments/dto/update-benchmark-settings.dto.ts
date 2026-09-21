import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateBenchmarkSettingsDto {
  @IsOptional()
  @IsBoolean()
  participatesInBenchmark?: boolean;

  @IsOptional()
  @IsString()
  activity?: string;

  @IsOptional()
  @IsString()
  productionSystem?: string;
}
