import { IsDateString, IsNumber, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateWeighingDto {
  @IsDateString()
  weighedAt!: string;

  @IsNumber()
  weightKg!: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsUUID()
  herdId!: string;

  @IsUUID()
  animalId!: string;
}
