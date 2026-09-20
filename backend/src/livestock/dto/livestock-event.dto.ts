import {
  IsEnum,
  IsDateString,
  IsNumber,
  IsString,
  IsOptional,
  IsObject,
  IsUUID,
  IsInt,
} from 'class-validator';

export class CreateLivestockEventDto {
  @IsUUID()
  @IsOptional()
  herdId?: string;

  @IsUUID()
  @IsOptional()
  animalId?: string;

  @IsEnum([
    'MOVEMENT',
    'HEALTH',
    'FEEDING',
    'PURCHASE',
    'SALE',
    'DEATH',
    'COST',
    'OTHER',
  ])
  type!:
    | 'MOVEMENT'
    | 'HEALTH'
    | 'FEEDING'
    | 'PURCHASE'
    | 'SALE'
    | 'DEATH'
    | 'COST'
    | 'OTHER';

  @IsDateString()
  occurredAt!: string;

  @IsInt()
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
  metadata?: Record<string, unknown>;
}