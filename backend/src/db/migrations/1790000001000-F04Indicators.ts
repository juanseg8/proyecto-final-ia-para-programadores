import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class F04Indicators1790000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'indicator_snapshots',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()'
          },
          {
            name: 'establishmentId',
            type: 'uuid',
            isNullable: false
          },
          {
            name: 'herdId',
            type: 'uuid',
            isNullable: true
          },
          {
            name: 'periodFrom',
            type: 'timestamp with time zone',
            isNullable: false
          },
          {
            name: 'periodTo',
            type: 'timestamp with time zone',
            isNullable: false
          },
          {
            name: 'gmdGramsDay',
            type: 'numeric',
            isNullable: true
          },
          {
            name: 'activeHeadCount',
            type: 'integer',
            isNullable: true
          },
          {
            name: 'stockingRateHeadsHa',
            type: 'numeric',
            isNullable: true
          },
          {
            name: 'mortalityPct',
            type: 'numeric',
            isNullable: true
          },
          {
            name: 'costPerKgProduced',
            type: 'numeric',
            isNullable: true
          },
          {
            name: 'calculatedAt',
            type: 'timestamp with time zone',
            isNullable: false
          },
          {
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'now()',
            isNullable: false
          }
        ],
        foreignKeys: [
          {
            name: 'FK_indicator_snapshots_establishment',
            referencedTableName: 'establishments',
            referencedColumnNames: ['id'],
            columnNames: ['establishmentId'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          },
          {
            name: 'FK_indicator_snapshots_herd',
            referencedTableName: 'herds',
            referencedColumnNames: ['id'],
            columnNames: ['herdId'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('indicator_snapshots');
  }
}
