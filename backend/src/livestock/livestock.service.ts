import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { CreateHerdDto, UpdateHerdDto } from './dto/herd.dto';
import { CreateAnimalDto, UpdateAnimalDto } from './dto/animal.dto';
import { CreateWeighingDto } from './dto/weighing.dto';
import { CreateLivestockEventDto } from './dto/livestock-event.dto';

import { Herd } from '../entities/herd.entity';
import { Animal } from '../entities/animal.entity';
import { Weighing } from '../entities/weighing.entity';
import { LivestockEvent } from '../entities/livestock-event.entity';

@Injectable()
export class LivestockService {
  constructor(
    @InjectRepository(Herd)
    private readonly herdRepository: Repository<Herd>,

    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,

    @InjectRepository(Weighing)
    private readonly weighingRepository: Repository<Weighing>,

    @InjectRepository(LivestockEvent)
    private readonly livestockEventRepository: Repository<LivestockEvent>,
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

  async findHerds(establishmentId: string): Promise<any[]> {
    const herds = await this.herdRepository.find({
      where: { establishmentId },
      order: { createdAt: 'DESC' },
    });

    const animalCounts = await this.animalRepository.createQueryBuilder('animal')
      .select('animal.herdId', 'herdId')
      .addSelect('COUNT(animal.id)', 'count')
      .where('animal.establishmentId = :establishmentId', { establishmentId })
      .andWhere('animal.status != :status', { status: 'SOLD' })
      .groupBy('animal.herdId')
      .getRawMany();

    return herds.map(herd => {
      const countMatch = animalCounts.find(ac => ac.herdId === herd.id);
      return {
        ...herd,
        animalCount: countMatch ? parseInt(countMatch.count, 10) : 0,
      };
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
    herdId?: string,
  ): Promise<any[]> {
    const where: any = { establishmentId };
    if (herdId) where.herdId = herdId;

    const animals = await this.animalRepository.find({
      where,
      relations: {
        herd: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (animals.length === 0) return [];

    const animalIds = animals.map(a => a.id);
    const weighings = await this.weighingRepository.find({
      where: { animalId: In(animalIds) },
      order: { weighedAt: 'DESC' }
    });

    const now = new Date();

    return animals.map(animal => {
      const animalWeighings = weighings.filter(w => w.animalId === animal.id);
      const lastWeighing = animalWeighings[0];

      let ageMonths = null;
      let category = 'Categoría';

      if (animal.birthDate) {
        const bd = new Date(animal.birthDate);
        ageMonths = (now.getFullYear() - bd.getFullYear()) * 12 + now.getMonth() - bd.getMonth();
        if (now.getDate() < bd.getDate()) ageMonths--;
        if (ageMonths < 0) ageMonths = 0;

        if (animal.sex === 'M') {
           category = ageMonths <= 12 ? 'Ternero' : (ageMonths <= 24 ? 'Novillito' : (ageMonths <= 36 ? 'Toro' : 'Toro'));
        } else {
           category = ageMonths <= 12 ? 'Ternera' : (ageMonths <= 24 ? 'Vaquillona' : 'Vaca');
        }
      }

      return {
        ...animal,
        ageMonths,
        category,
        lastWeight: lastWeighing ? lastWeighing.weightKg : 0,
        lastWeightDate: lastWeighing ? new Date(lastWeighing.weighedAt).toLocaleDateString('es-AR') : 'N/A'
      };
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

  // ============================================================
  // WEIGHINGS
  // ============================================================

  async createWeighing(
    establishmentId: string,
    createWeighingDto: CreateWeighingDto,
  ): Promise<Weighing> {
    // Validar que el rodeo y el animal existan y pertenezcan al mismo establecimiento.
    const herd = await this.herdRepository.findOne({
      where: {
        id: createWeighingDto.herdId,
        establishmentId,
      },
    });

    if (!herd) {
      throw new NotFoundException('Rodeo no encontrado');
    }

    const animal = await this.animalRepository.findOne({
      where: {
        id: createWeighingDto.animalId,
        establishmentId,
      },
    });

    if (!animal) {
      throw new NotFoundException('Animal no encontrado');
    }

    const weighing = this.weighingRepository.create({
      ...createWeighingDto,
      establishmentId,
    });

    return this.weighingRepository.save(weighing);
  }

  async findWeighings(
    establishmentId: string,
    animalId?: string,
  ): Promise<Weighing[]> {
    const where: any = { establishmentId };
    if (animalId) where.animalId = animalId;

    return this.weighingRepository.find({
      where,
      relations: {
        herd: true,
        animal: true,
      },
      order: {
        weighedAt: 'DESC',
      },
    });
  }

  // ============================================================
  // LIVESTOCK EVENTS
  // ============================================================

  async createLivestockEvent(
    establishmentId: string,
    createLivestockEventDto: CreateLivestockEventDto,
  ): Promise<LivestockEvent> {
    // Validar que el rodeo y el animal (si se proporcionan) existan y pertenezcan al mismo establecimiento.
    if (createLivestockEventDto.herdId) {
      const herd = await this.herdRepository.findOne({
        where: {
          id: createLivestockEventDto.herdId,
          establishmentId,
        },
      });

      if (!herd) {
        throw new NotFoundException('Rodeo no encontrado');
      }
    }

    if (createLivestockEventDto.animalId) {
      const animal = await this.animalRepository.findOne({
        where: {
          id: createLivestockEventDto.animalId,
          establishmentId,
        },
      });

      if (!animal) {
        throw new NotFoundException('Animal no encontrado');
      }

      let updateAnimal = false;
      if (createLivestockEventDto.type === 'DEATH' && animal.status !== 'DEAD') {
        animal.status = 'DEAD';
        updateAnimal = true;
      } else if (createLivestockEventDto.type === 'SALE' && animal.status !== 'SOLD') {
        animal.status = 'SOLD';
        updateAnimal = true;
      }

      if (updateAnimal) {
        await this.animalRepository.save(animal);
      }
    }

    const livestockEvent = this.livestockEventRepository.create({
      ...createLivestockEventDto,
      establishmentId,
    });

    return this.livestockEventRepository.save(livestockEvent);
  }

  async findLivestockEvents(
    establishmentId: string,
    animalId?: string,
  ): Promise<LivestockEvent[]> {
    const where: any = { establishmentId };
    if (animalId) where.animalId = animalId;

    return this.livestockEventRepository.find({
      where,
      relations: {
        herd: true,
        animal: true,
      },
      order: {
        occurredAt: 'DESC',
      },
    });
  }
}
