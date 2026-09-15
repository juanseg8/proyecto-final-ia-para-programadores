import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Establishment } from '../entities/establishment.entity';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
@Injectable()
export class EstablishmentService {
  constructor(
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
  ) {}

  async create(userId: string, createDto: CreateEstablishmentDto): Promise<Establishment> {
    const normalizedName = createDto.name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, ' ');

    const establishment = this.establishmentRepository.create({
      name: createDto.name,
      normalizedName,
      superficieHa: createDto.superficieHa,
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      province: createDto.province,
      locality: createDto.locality,
      userId: userId,
    });

    try {
      return await this.establishmentRepository.save(establishment);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Establishment name already exists for this user.');
      }
      throw new InternalServerErrorException('Error saving establishment.');
    }
  }

  async findAll(userId: string): Promise<Establishment[]> {
    return this.establishmentRepository.find({ where: { userId } });
  }

  async findById(id: string): Promise<Establishment | null> {
    return this.establishmentRepository.findOne({ where: { id } });
  }

  async update(id: string, updateDto: UpdateEstablishmentDto): Promise<Establishment> {
    const establishment = await this.findById(id);
    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    if (updateDto.name !== undefined) {
      establishment.name = updateDto.name;
      establishment.normalizedName = updateDto.name
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, ' ');
    }

    if (updateDto.superficieHa !== undefined) {
      establishment.superficieHa = updateDto.superficieHa;
    }
    if (updateDto.latitude !== undefined) {
      establishment.latitude = updateDto.latitude;
    }
    if (updateDto.longitude !== undefined) {
      establishment.longitude = updateDto.longitude;
    }
    if (updateDto.province !== undefined) {
      establishment.province = updateDto.province;
    }
    if (updateDto.locality !== undefined) {
      establishment.locality = updateDto.locality;
    }

    try {
      return await this.establishmentRepository.save(establishment);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Establishment name already exists for this user.');
      }
      throw new InternalServerErrorException('Error updating establishment.');
    }
  }

  async delete(id: string): Promise<void> {
    await this.establishmentRepository.delete(id);
  }
}
