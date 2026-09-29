import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as argon2 from 'argon2';

dotenv.config();

import { User } from './entities/user.entity';
import { Establishment } from './entities/establishment.entity';
import { Herd } from './entities/herd.entity';
import { Animal } from './entities/animal.entity';
import { Weighing } from './entities/weighing.entity';
import { LivestockEvent } from './entities/livestock-event.entity';
import { IndicatorSnapshot } from './entities/indicator-snapshot.entity';

if (process.env.NODE_ENV === 'production') {
  console.error('❌ FATAL: Cannot run seed in production environment.');
  process.exit(1);
}

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'agro_user',
  password: process.env.DB_PASSWORD || 'agro_pass',
  database: process.env.DB_NAME || 'agro_db',
  entities: [
    User,
    Establishment,
    Herd,
    Animal,
    Weighing,
    LivestockEvent,
    IndicatorSnapshot,
    __dirname + '/entities/*.entity{.ts,.js}'
  ],
  synchronize: true,
  dropSchema: true,
});

const DEMO_LOCATIONS = [
  // Rural areas outside cities
  { province: 'Corrientes', loc: 'Zona Rural Mercedes', lat: -29.2, lng: -58.1 },
  { province: 'Corrientes', loc: 'Zona Rural Curuzú Cuatiá', lat: -29.8, lng: -58.2 },
  { province: 'Chaco', loc: 'Zona Rural Pampa del Infierno', lat: -26.5, lng: -61.1 },
  { province: 'Chaco', loc: 'Zona Rural Las Breñas', lat: -27.1, lng: -61.0 },
  { province: 'Formosa', loc: 'Zona Rural Las Lomitas', lat: -24.6, lng: -60.6 },
  { province: 'Formosa', loc: 'Zona Rural Pirané', lat: -25.7, lng: -59.1 },
];

const ESTABLISHMENT_NAMES = ['El Ombú', 'Los Pinos', 'San Expedito', 'La Tranquera', 'Don Joaquín', 'Las Marías', 'Estancia Yaguareté', 'El Relincho', 'La Esperanza', 'Los Alerces', 'La Candelaria', 'El Carpincho', 'La Rosada', 'San Ignacio', 'Los Sauces'];

async function runSeed() {
  await AppDataSource.initialize();
  console.log('📦 Database connected');

  const userRepository = AppDataSource.getRepository(User);
  const establishmentRepository = AppDataSource.getRepository(Establishment);
  const herdRepository = AppDataSource.getRepository(Herd);
  const animalRepository = AppDataSource.getRepository(Animal);
  const weighingRepository = AppDataSource.getRepository(Weighing);
  const eventRepository = AppDataSource.getRepository(LivestockEvent);
  const indicatorSnapshotRepository = AppDataSource.getRepository(IndicatorSnapshot);

  console.log('🧹 Clearing old data...');
  await AppDataSource.query('DELETE FROM indicator_snapshots CASCADE;');
  await AppDataSource.query('DELETE FROM livestock_events CASCADE;');
  await AppDataSource.query('DELETE FROM weighings CASCADE;');
  await AppDataSource.query('DELETE FROM animals CASCADE;');
  await AppDataSource.query('DELETE FROM herds CASCADE;');
  await AppDataSource.query('DELETE FROM establishments CASCADE;');
  await AppDataSource.query('DELETE FROM users CASCADE;');

  console.log('👤 Creating Users...');
  const passwordHash = await argon2.hash('123456');
  
  // Create Main User
  const mainUser = userRepository.create({
    email: 'demo@agro.com',
    passwordHash: passwordHash,
    name: 'Usuario Demo',
  });
  await userRepository.save(mainUser);

  // Create Peer Users
  const peers = [];
  for (let i = 1; i <= 20; i++) {
    const p = userRepository.create({
      email: `peer${i}@agro.com`,
      passwordHash: passwordHash,
      name: `Productor ${i}`,
    });
    peers.push(p);
  }
  await userRepository.save(peers);

  console.log('🏡 Creating Establishments...');
  const usersToAssign = [mainUser, ...peers];
  const establishments: Establishment[] = [];
  
  let nameIndex = 0;

  for (const user of usersToAssign) {
    // 3 establishments per user
    for (let e = 0; e < 3; e++) {
      let data = DEMO_LOCATIONS[Math.floor(Math.random() * DEMO_LOCATIONS.length)];
      let estName = ESTABLISHMENT_NAMES[nameIndex % ESTABLISHMENT_NAMES.length];
      
      // Explicit distinct locations for the demo user
      if (user.id === mainUser.id) {
         if (e === 0) {
           data = { lat: -27.30, lng: -59.20, province: 'Chaco', loc: 'Resistencia (Rural)' };
           estName = 'La Candelaria';
         } else if (e === 1) {
           data = { lat: -29.35, lng: -58.30, province: 'Corrientes', loc: 'Mercedes (Rural)' };
           estName = 'El Ombú';
         } else {
           data = { lat: -24.40, lng: -60.70, province: 'Formosa', loc: 'Las Lomitas (Rural)' };
           estName = 'San Expedito';
         }
      } else {
         estName = estName + ' ' + (e + 1);
      }
      nameIndex++;
      
      // Randomize coordinates slightly (approx up to ~25km away) for peers
      const latOffset = user.id === mainUser.id ? 0 : (Math.random() - 0.5) * 0.4;
      const lngOffset = user.id === mainUser.id ? 0 : (Math.random() - 0.5) * 0.4;

      const est = establishmentRepository.create({
        userId: user.id,
        name: estName,
        normalizedName: estName.toLowerCase().replace(/ /g, '-'),
        superficieHa: 1000 + Math.floor(Math.random() * 4000), // Random surface 1000 to 5000 ha
        latitude: data.lat + latOffset,
        longitude: data.lng + lngOffset,
        province: data.province,
        locality: data.loc,
        activity: 'CRIA',
        productionSystem: 'EXTENSIVO',
        participatesInBenchmark: true,
      });
      establishments.push(est);
    }
  }
  await establishmentRepository.save(establishments);

  console.log('🐄 Creating Herds, Animals, Weighings, and Events...');
  const today = new Date();
  
  for (const est of establishments) {
    // 2 herds per establishment
    for (let h = 1; h <= 2; h++) {
      const herd = herdRepository.create({
        establishmentId: est.id,
        name: `Rodeo ${h}`,
        activity: 'CRIA',
        productionSystem: 'PASTOREO',
        active: true,
      });
      await herdRepository.save(herd);

      const animals = [];
      const animalCount = 25 + Math.floor(Math.random() * 20); // 25 to 44 animals per herd
      
      for (let j = 1; j <= animalCount; j++) {
        animals.push(
          animalRepository.create({
            establishmentId: est.id,
            herdId: herd.id,
            tag: `V-${est.id.substring(0,4)}-${h}-${j}`,
            sex: j % 2 === 0 ? 'F' : 'M',
            birthDate: new Date(today.getTime() - (24 + Math.random() * 36) * 30 * 24 * 60 * 60 * 1000), // 2 to 5 years old
            status: 'ACTIVE',
          })
        );
      }
      await animalRepository.save(animals);

      const weighings = [];
      const events = [];

      for (let i = 0; i < animals.length; i++) {
        const animal = animals[i];
        
        // Simulate some mortality (approx 2 per herd)
        if (i < 2) {
            animal.status = 'DEAD';
            const deathDate = new Date(today.getTime() - Math.floor(Math.random() * 100) * 24 * 60 * 60 * 1000);
            animal.updatedAt = deathDate;
            
            events.push(
              eventRepository.create({
                establishmentId: est.id,
                herdId: herd.id,
                animalId: animal.id,
                type: 'DEATH',
                notes: 'Causa natural',
                occurredAt: deathDate
              })
            );
        } else {
            // Generamos pesajes semanales por los ultimos 6 meses
            // 26 semanas
            let baseWeight = 200 + Math.random() * 150;
            // Realistic GMD for this specific animal (e.g. 0.3 to 0.9 kg/day)
            const animalGmd = 0.3 + Math.random() * 0.6; 
            
            for (let week = 26; week >= 0; week--) {
              const weighDate = new Date(today);
              weighDate.setDate(weighDate.getDate() - (week * 7));
              
              // Add slight random fluctuation to the weight (± 5kg)
              const fluctuation = (Math.random() - 0.5) * 10;
              const currentWeight = baseWeight + fluctuation;
              
              weighings.push(
                weighingRepository.create({
                  establishmentId: est.id,
                  herdId: herd.id,
                  animalId: animal.id,
                  weightKg: Number(currentWeight.toFixed(1)),
                  weighedAt: weighDate,
                })
              );
              
              baseWeight += animalGmd * 7; // gain per week
            }
        }

        // Si es hembra, registrar eventos reproductivos realistas
        if (animal.sex === 'F' && animal.status === 'ACTIVE') {
          // Embarazo? (70-90% chance)
          const isPregnant = Math.random() < 0.85;
          if (isPregnant) {
            const pregnancyDate = new Date(today);
            pregnancyDate.setMonth(pregnancyDate.getMonth() - Math.floor(Math.random() * 6));
            events.push(
              eventRepository.create({
                establishmentId: est.id,
                herdId: herd.id,
                animalId: animal.id,
                type: 'PREGNANCY',
                notes: 'Tacto positivo',
                occurredAt: pregnancyDate
              })
            );

            // Destete? (solo si el parto/embarazo fue hace tiempo)
            // Asumimos un destete con 80% de chance sobre la preñez
            const isWeaned = Math.random() < 0.80;
            if (isWeaned) {
              const weaningDate = new Date(today);
              weaningDate.setDate(weaningDate.getDate() - Math.floor(Math.random() * 30));
              events.push(
                eventRepository.create({
                  establishmentId: est.id,
                  herdId: herd.id,
                  animalId: animal.id,
                  type: 'WEANING',
                  notes: 'Destete de ternero',
                  occurredAt: weaningDate
                })
              );
            }
          }
        }
      }
      await animalRepository.save(animals); 
      // Insert in chunks to avoid blowing up memory
      for (let i = 0; i < events.length; i += 500) {
        await eventRepository.save(events.slice(i, i + 500));
      }
      for (let i = 0; i < weighings.length; i += 1000) {
        await weighingRepository.save(weighings.slice(i, i + 1000));
      }
    }

    // Create Indicator Snapshots for benchmarking
    // The snapshot simulates the previous year's performance to compare against
    const snapshots = [];
    const fromDate = new Date(today);
    fromDate.setFullYear(fromDate.getFullYear() - 1); // 12 months ago
    
    // We make them randomly distributed around realistic averages
    snapshots.push(
      indicatorSnapshotRepository.create({
        establishmentId: est.id,
        periodFrom: fromDate,
        periodTo: today,
        calculatedAt: today,
        gmdGramsDay: 400 + Math.random() * 350,
        mortalityPct: 1 + Math.random() * 4,
        stockingRateHeadsHa: 0.7 + Math.random() * 0.8,
        costPerKgProduced: 0.8 + Math.random() * 1.0,
        pregnancyPct: 70 + Math.random() * 20,
        weaningPct: 65 + Math.random() * 20,
      })
    );
    await indicatorSnapshotRepository.save(snapshots);
  }

  console.log('✅ Seeding completed successfully!');
  await AppDataSource.destroy();
}

runSeed().catch((err) => {
  console.error('❌ Error during seeding:', err);
  process.exit(1);
});
