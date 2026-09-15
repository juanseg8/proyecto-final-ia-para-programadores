import { MigrationInterface, QueryRunner } from "typeorm";

export class F02Establishment1789429739331 implements MigrationInterface {
    name = 'F02Establishment1789429739331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "establishments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "normalizedName" character varying NOT NULL, "province" character varying NOT NULL, "locality" character varying NOT NULL, "latitude" numeric NOT NULL, "longitude" numeric NOT NULL, "superficieHa" numeric NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7914eff0fec3648a642c0909041" UNIQUE ("userId", "normalizedName"), CONSTRAINT "PK_7fb6da6c365114ccb61b091bbdf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "establishments" ADD CONSTRAINT "FK_e5dea12ff303dbe68a7fc2db425" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "establishments" DROP CONSTRAINT "FK_e5dea12ff303dbe68a7fc2db425"`);
        await queryRunner.query(`DROP TABLE "establishments"`);
    }

}
