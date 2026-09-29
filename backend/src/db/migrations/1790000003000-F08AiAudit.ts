import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class F08AiAudit1790000003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ai_interactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()'
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false
          },
          {
            name: 'establishmentId',
            type: 'uuid',
            isNullable: false
          },
          {
            name: 'question',
            type: 'text',
            isNullable: false
          },
          {
            name: 'answer',
            type: 'text',
            isNullable: true
          },
          {
            name: 'contextJson',
            type: 'jsonb',
            isNullable: false
          },
          {
            name: 'toolsJson',
            type: 'jsonb',
            isNullable: false
          },
          {
            name: 'model',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'guardrailPassed',
            type: 'boolean',
            isNullable: false
          },
          {
            name: 'errorCode',
            type: 'varchar',
            isNullable: true
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
            name: 'FK_ai_interactions_user',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['userId'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          },
          {
            name: 'FK_ai_interactions_establishment',
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
    await queryRunner.dropTable('ai_interactions');
  }
}
