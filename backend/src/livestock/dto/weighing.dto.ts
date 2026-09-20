import {
  IsDateString,
  IsNumber,
  IsString,
  IsOptional,
  IsUUID,
  IsPositive,
} from 'class-validator';

export class CreateWeighingDto {
  @IsUUID()
  herdId!: string;

  @IsUUID()
  animalId!: string;

  @IsDateString()
  weighedAt!: string;

  @IsNumber()
  @IsPositive()
  weightKg!: number;

  @IsString()
  @IsOptional()
  notes?: string;
}