import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { EstablishmentOwnershipGuard } from '../establishments/guards/establishment-ownership.guard';

import { CreateHerdDto, UpdateHerdDto } from './dto/herd.dto';
import { CreateAnimalDto, UpdateAnimalDto } from './dto/animal.dto';
import { CreateWeighingDto } from './dto/weighing.dto';
import { CreateLivestockEventDto } from './dto/livestock-event.dto';

import { LivestockService } from './livestock.service';

@Controller('establishments/:establishmentId')
@UseGuards(EstablishmentOwnershipGuard)
export class LivestockController {
  constructor(private readonly livestockService: LivestockService) {}

  // ============================================================
  // HERDS
  // ============================================================

  @Get('herds')
  async findHerds(
    @Param('establishmentId') establishmentId: string,
  ) {
    return this.livestockService.findHerds(establishmentId);
  }

  @Post('herds')
  async createHerd(
    @Param('establishmentId') establishmentId: string,
    @Body() createHerdDto: CreateHerdDto,
  ) {
    return this.livestockService.createHerd(establishmentId, createHerdDto);
  }

  @Get('herds/:herdId')
  async findHerd(
    @Param('establishmentId') establishmentId: string,
    @Param('herdId') herdId: string,
  ) {
    return this.livestockService.findHerd(establishmentId, herdId);
  }

  @Put('herds/:herdId')
  async updateHerd(
    @Param('establishmentId') establishmentId: string,
    @Param('herdId') herdId: string,
    @Body() updateHerdDto: UpdateHerdDto,
  ) {
    return this.livestockService.updateHerd(establishmentId, herdId, updateHerdDto);
  }

  @Delete('herds/:herdId')
  async deleteHerd(
    @Param('establishmentId') establishmentId: string,
    @Param('herdId') herdId: string,
  ) {
    return this.livestockService.deleteHerd(establishmentId, herdId);
  }

  // ============================================================
  // ANIMALS
  // ============================================================

  @Get('animals')
  async findAnimals(
    @Param('establishmentId') establishmentId: string,
  ) {
    return this.livestockService.findAnimals(establishmentId);
  }

  @Post('animals')
  async createAnimal(
    @Param('establishmentId') establishmentId: string,
    @Body() createAnimalDto: CreateAnimalDto,
  ) {
    return this.livestockService.createAnimal(establishmentId, createAnimalDto);
  }

  @Get('animals/:animalId')
  async findAnimal(
    @Param('establishmentId') establishmentId: string,
    @Param('animalId') animalId: string,
  ) {
    return this.livestockService.findAnimal(establishmentId, animalId);
  }

  @Put('animals/:animalId')
  async updateAnimal(
    @Param('establishmentId') establishmentId: string,
    @Param('animalId') animalId: string,
    @Body() updateAnimalDto: UpdateAnimalDto,
  ) {
    return this.livestockService.updateAnimal(establishmentId, animalId, updateAnimalDto);
  }

  // ============================================================
  // WEIGHINGS
  // ============================================================

  @Get('weighings')
  async findWeighings(
    @Param('establishmentId') establishmentId: string,
  ) {
    return this.livestockService.findWeighings(establishmentId);
  }

  @Post('weighings')
  async createWeighing(
    @Param('establishmentId') establishmentId: string,
    @Body() createWeighingDto: CreateWeighingDto,
  ) {
    return this.livestockService.createWeighing(establishmentId, createWeighingDto);
  }

  // ============================================================
  // LIVESTOCK EVENTS
  // ============================================================

  @Get('events')
  async findLivestockEvents(
    @Param('establishmentId') establishmentId: string,
  ) {
    return this.livestockService.findLivestockEvents(establishmentId);
  }

  @Post('events')
  async createLivestockEvent(
    @Param('establishmentId') establishmentId: string,
    @Body() createLivestockEventDto: CreateLivestockEventDto,
  ) {
    return this.livestockService.createLivestockEvent(establishmentId, createLivestockEventDto);
  }
}
