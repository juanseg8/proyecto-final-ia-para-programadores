import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateHerdDto, UpdateHerdDto } from './dto/herd.dto';
import { CreateAnimalDto, UpdateAnimalDto } from './dto/animal.dto';

import { Herd } from '../entities/herd.entity';
import { Animal } from '../entities/animal.entity';

@Injectable()
export class LivestockService {
  constructor(
    @InjectRepository(Herd)
    private readonly herdRepository: Repository<Herd>,

    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  // ============================================================
  // HERDS
  // ============================================================

  async createHerd(
    establishmentId: string,
    createHerdDto: CreateHerdDto,
  ): Promise<Herd> {
    const herd = this.herdRepository.create({
      ...createHerdDto,
      establishmentId,
    });

    return this.herdRepository.save(herd);
  }

  async findHerds(establishmentId: string): Promise<Herd[]> {
    return this.herdRepository.find({
      where: {
        establishmentId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findHerd(
    establishmentId: string,
    herdId: string,
  ): Promise<Herd> {
    const herd = await this.herdRepository.findOne({
      where: {
        id: herdId,
        establishmentId,
      },
    });

    if (!herd) {
      throw new NotFoundException('Rodeo no encontrado');
    }

    return herd;
  }

  async updateHerd(
    establishmentId: string,
    herdId: string,
    updateHerdDto: UpdateHerdDto,
  ): Promise<Herd> {
    const herd = await this.findHerd(
      establishmentId,
      herdId,
    );

    Object.assign(herd, updateHerdDto);

    return this.herdRepository.save(herd);
  }

  async deleteHerd(
    establishmentId: string,
    herdId: string,
  ): Promise<void> {
    // Primero valida existencia + ownership.
    // Un rodeo inexistente o perteneciente a otro establecimiento => 404.
    const herd = await this.findHerd(
      establishmentId,
      herdId,
    );

    const animalCount = await this.animalRepository.count({
      where: {
        herdId,
        establishmentId,
      },
    });

    if (animalCount > 0) {
      throw new ConflictException(
        'No se puede eliminar un rodeo que contiene animales',
      );
    }

    await this.herdRepository.remove(herd);
  }

  // ============================================================
  // ANIMALS
  // ============================================================

  async createAnimal(
    establishmentId: string,
    createAnimalDto: CreateAnimalDto,
  ): Promise<Animal> {
    // El rodeo debe existir dentro del mismo establecimiento.
    const herd = await this.herdRepository.findOne({
      where: {
        id: createAnimalDto.herdId,
        establishmentId,
      },
    });

    if (!herd) {
      throw new NotFoundException('Rodeo no encontrado');
    }

    const animal = this.animalRepository.create({
      ...createAnimalDto,
      establishmentId,
    });

    return this.animalRepository.save(animal);
  }

  async findAnimals(
    establishmentId: string,
  ): Promise<Animal[]> {
    return this.animalRepository.find({
      where: {
        establishmentId,
      },
      relations: {
        herd: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findAnimal(
    establishmentId: string,
    animalId: string,
  ): Promise<Animal> {
    const animal = await this.animalRepository.findOne({
      where: {
        id: animalId,
        establishmentId,
      },
      relations: {
        herd: true,
      },
    });

    if (!animal) {
      throw new NotFoundException('Animal no encontrado');
    }

    return animal;
  }

  async updateAnimal(
    establishmentId: string,
    animalId: string,
    updateAnimalDto: UpdateAnimalDto,
  ): Promise<Animal> {
    // Primero valida existencia + ownership del animal.
    const animal = await this.findAnimal(
      establishmentId,
      animalId,
    );

    // Si se mueve de rodeo, el nuevo rodeo también debe
    // pertenecer al mismo establecimiento.
    if (updateAnimalDto.herdId) {
      const herd = await this.herdRepository.findOne({
        where: {
          id: updateAnimalDto.herdId,
          establishmentId,
        },
      });

      if (!herd) {
        throw new NotFoundException('Rodeo no encontrado');
      }
    }

    Object.assign(animal, updateAnimalDto);

    return this.animalRepository.save(animal);
  }
}