import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  tag!: string;

  @IsEnum(['M', 'F'])
  sex!: 'M' | 'F';

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsEnum(['ACTIVE', 'SOLD', 'DEAD', 'TRANSFERRED'])
  status!: 'ACTIVE' | 'SOLD' | 'DEAD' | 'TRANSFERRED';
}

export class UpdateAnimalDto {
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
