import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAuditService } from './ai-audit.service';
import { AiInteraction } from '../entities/ai-interaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AiInteraction])],
  providers: [AiAuditService],
  exports: [AiAuditService],
})
export class AiAuditModule {}
