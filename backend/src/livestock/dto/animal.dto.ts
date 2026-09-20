import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateAnimalDto {
  @IsUUID()
  herdId!: string;

  @IsString()
  tag!: string;

  @IsEnum(['M', 'F'])
  sex!: 'M' | 'F';

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsEnum(['ACTIVE', 'SOLD', 'DEAD', 'TRANSFERRED'])
  @IsOptional()
  status?: 'ACTIVE' | 'SOLD' | 'DEAD' | 'TRANSFERRED';
}

export class UpdateAnimalDto {
  @IsUUID()
  @IsOptional()
  herdId?: string;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsEnum(['M', 'F'])
  @IsOptional()
  sex?: 'M' | 'F';

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsEnum(['ACTIVE', 'SOLD', 'DEAD', 'TRANSFERRED'])
  @IsOptional()
  status?: 'ACTIVE' | 'SOLD' | 'DEAD' | 'TRANSFERRED';
}