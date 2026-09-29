import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class F05Benchmark1790000002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add missing columns to establishments
    await queryRunner.addColumns('establishments', [
      new TableColumn({
        name: 'activity',
        type: 'varchar',
        isNullable: true
      }),
      new TableColumn({
        name: 'productionSystem',
        type: 'varchar',
        isNullable: true
      }),
      new TableColumn({
        name: 'participatesInBenchmark',
        type: 'boolean',
        default: false,
        isNullable: false
      })
    ]);

    // Create benchmark_snapshots table
    await queryRunner.createTable(
      new Table({
        name: 'benchmark_snapshots',
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
            name: 'median',
            type: 'numeric',
            isNullable: false
          },
          {
            name: 'p25',
            type: 'numeric',
            isNullable: false
          },
          {
            name: 'p75',
            type: 'numeric',
            isNullable: false
          },
          {
            name: 'peerGroupSize',
            type: 'integer',
            isNullable: false
          },
          {
            name: 'relativePosition',
            type: 'numeric',
            isNullable: false
          },
          {
            name: 'criteria',
            type: 'jsonb',
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
            name: 'FK_benchmark_snapshots_establishment',
            referencedTableName: 'establishments',
            referencedColumnNames: ['id'],
            columnNames: ['establishmentId'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('benchmark_snapshots');
    await queryRunner.dropColumn('establishments', 'participatesInBenchmark');
    await queryRunner.dropColumn('establishments', 'productionSystem');
    await queryRunner.dropColumn('establishments', 'activity');
  }
}
