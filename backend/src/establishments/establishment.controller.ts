import { Controller, Post, Get, Put, Delete, Body, UseGuards, Req, Param } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { UpdateBenchmarkSettingsDto } from './dto/update-benchmark-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EstablishmentOwnershipGuard } from './guards/establishment-ownership.guard';

@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Post()
  async create(@Req() req: any, @Body() createDto: CreateEstablishmentDto) {
    return this.establishmentService.create(req.user.userId, createDto);
  }

  @Get()
  async findAll(@Req() req: any) {
    return this.establishmentService.findAll(req.user.userId);
  }

  @Get(':id')
  @UseGuards(EstablishmentOwnershipGuard)
  async findOne(@Req() req: any) {
    // The establishment was attached by the guard
    return req.establishment;
  }

  @Put(':id')
  @UseGuards(EstablishmentOwnershipGuard)
  async update(@Param('id') id: string, @Body() updateDto: UpdateEstablishmentDto) {
    return this.establishmentService.update(id, updateDto);
  }

  @Put(':id/benchmark-settings')
  @UseGuards(EstablishmentOwnershipGuard)
  async updateBenchmarkSettings(@Param('id') id: string, @Body() updateDto: UpdateBenchmarkSettingsDto) {
    return this.establishmentService.updateBenchmarkSettings(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(EstablishmentOwnershipGuard)
  async remove(@Param('id') id: string) {
    await this.establishmentService.delete(id);
  }
}
