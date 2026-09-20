import { IsEnum, IsDateString, IsNumber, IsString, IsOptional, IsObject, IsUUID } from 'class-validator';

export class CreateLivestockEventDto {
  @IsEnum(['MOVEMENT', 'HEALTH', 'FEEDING', 'PURCHASE', 'SALE', 'DEATH', 'COST', 'OTHER'])
  type!: 'MOVEMENT' | 'HEALTH' | 'FEEDING' | 'PURCHASE' | 'SALE' | 'DEATH' | 'COST' | 'OTHER';

  @IsDateString()
  occurredAt!: string;

  @IsNumber()
  @IsOptional()
  animalCount?: number;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsUUID()
  @IsOptional()
  herdId?: string;

  @IsUUID()
  @IsOptional()
  animalId?: string;
}
