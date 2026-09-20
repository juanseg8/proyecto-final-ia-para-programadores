import { MigrationInterface, QueryRunner } from 'typeorm';

export class F03Livestock1790000000000 implements MigrationInterface {
  name = 'F03Livestock1790000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "herds" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "activity" character varying NOT NULL CHECK ("activity" IN ('CRIA', 'RECRIA', 'ENGORDE')),
        "productionSystem" character varying NOT NULL CHECK ("productionSystem" IN ('PASTOREO', 'SEMI_INTENSIVO', 'INTENSIVO')),
        "active" boolean NOT NULL DEFAULT true,
        "establishmentId" uuid NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_herds" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "animals" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tag" character varying NOT NULL,
        "sex" character varying NOT NULL CHECK ("sex" IN ('M', 'F')),
        "birthDate" TIMESTAMP WITH TIME ZONE,
        "status" character varying NOT NULL CHECK ("status" IN ('ACTIVE', 'SOLD', 'DEAD', 'TRANSFERRED')),
        "establishmentId" uuid NOT NULL,
        "herdId" uuid NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_animals" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_animals_tag_establishment" UNIQUE ("tag", "establishmentId")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "weighings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "weighedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "weightKg" numeric NOT NULL,
        "notes" character varying,
        "establishmentId" uuid NOT NULL,
        "herdId" uuid NOT NULL,
        "animalId" uuid NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_weighings" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "livestock_events" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "type" character varying NOT NULL CHECK ("type" IN ('MOVEMENT', 'HEALTH', 'FEEDING', 'PURCHASE', 'SALE', 'DEATH', 'COST', 'OTHER')),
        "occurredAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "animalCount" integer,
        "amount" numeric,
        "notes" character varying,
        "metadata" jsonb,
        "establishmentId" uuid NOT NULL,
        "herdId" uuid,
        "animalId" uuid,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_livestock_events" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "herds"
      ADD CONSTRAINT "FK_herds_establishment"
      FOREIGN KEY ("establishmentId") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "animals"
      ADD CONSTRAINT "FK_animals_establishment"
      FOREIGN KEY ("establishmentId") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "animals"
      ADD CONSTRAINT "FK_animals_herd"
      FOREIGN KEY ("herdId") REFERENCES "herds"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "weighings"
      ADD CONSTRAINT "FK_weighings_establishment"
      FOREIGN KEY ("establishmentId") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "weighings"
      ADD CONSTRAINT "FK_weighings_herd"
      FOREIGN KEY ("herdId") REFERENCES "herds"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "weighings"
      ADD CONSTRAINT "FK_weighings_animal"
      FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "livestock_events"
      ADD CONSTRAINT "FK_livestock_events_establishment"
      FOREIGN KEY ("establishmentId") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "livestock_events"
      ADD CONSTRAINT "FK_livestock_events_herd"
      FOREIGN KEY ("herdId") REFERENCES "herds"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "livestock_events"
      ADD CONSTRAINT "FK_livestock_events_animal"
      FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "livestock_events"
      DROP CONSTRAINT "FK_livestock_events_animal"
    `);
    await queryRunner.query(`
      ALTER TABLE "livestock_events"
      DROP CONSTRAINT "FK_livestock_events_herd"
    `);
    await queryRunner.query(`
      ALTER TABLE "livestock_events"
      DROP CONSTRAINT "FK_livestock_events_establishment"
    `);
    await queryRunner.query(`
      ALTER TABLE "weighings"
      DROP CONSTRAINT "FK_weighings_animal"
    `);
    await queryRunner.query(`
      ALTER TABLE "weighings"
      DROP CONSTRAINT "FK_weighings_herd"
    `);
    await queryRunner.query(`
      ALTER TABLE "weighings"
      DROP CONSTRAINT "FK_weighings_establishment"
    `);
    await queryRunner.query(`
      ALTER TABLE "animals"
      DROP CONSTRAINT "FK_animals_herd"
    `);
    await queryRunner.query(`
      ALTER TABLE "animals"
      DROP CONSTRAINT "FK_animals_establishment"
    `);
    await queryRunner.query(`
      ALTER TABLE "herds"
      DROP CONSTRAINT "FK_herds_establishment"
    `);

    await queryRunner.query('DROP TABLE "livestock_events"');
    await queryRunner.query('DROP TABLE "weighings"');
    await queryRunner.query('DROP TABLE "animals"');
    await queryRunner.query('DROP TABLE "herds"');
  }
}
