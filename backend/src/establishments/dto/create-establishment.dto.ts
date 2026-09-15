import { IsNumber, IsString, Max, Min, IsPositive } from 'class-validator';

export class CreateEstablishmentDto {
  @IsString()
  name!: string;

  @IsNumber()
  @IsPositive()
  superficieHa!: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @IsString()
  province!: string;

  @IsString()
  locality!: string;
}
