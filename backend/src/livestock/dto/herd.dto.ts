import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';

export class CreateHerdDto {
  @IsString()
  name!: string;

  @IsEnum(['CRIA', 'RECRIA', 'ENGORDE'])
  activity!: 'CRIA' | 'RECRIA' | 'ENGORDE';

  @IsEnum(['PASTOREO', 'SEMI_INTENSIVO', 'INTENSIVO'])
  productionSystem!: 'PASTOREO' | 'SEMI_INTENSIVO' | 'INTENSIVO';

  @IsBoolean()
  @IsOptional()
  active!: boolean;
}

export class UpdateHerdDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(['CRIA', 'RECRIA', 'ENGORDE'])
  @IsOptional()
  activity?: 'CRIA' | 'RECRIA' | 'ENGORDE';

  @IsEnum(['PASTOREO', 'SEMI_INTENSIVO', 'INTENSIVO'])
  @IsOptional()
  productionSystem?: 'PASTOREO' | 'SEMI_INTENSIVO' | 'INTENSIVO';

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
