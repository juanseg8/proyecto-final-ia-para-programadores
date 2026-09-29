import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiInteraction } from '../entities/ai-interaction.entity';

@Injectable()
export class AiAuditService {
  constructor(
    @InjectRepository(AiInteraction)
    private readonly interactionRepository: Repository<AiInteraction>,
  ) {}

  async logInteraction(data: {
    userId: string;
    establishmentId: string;
    question: string;
    answer: string | null;
    contextJson: any;
    toolsJson: any;
    model: string | null;
    guardrailPassed: boolean;
    errorCode: string | null;
  }): Promise<void> {
    const interaction = this.interactionRepository.create(data);
    await this.interactionRepository.save(interaction);
  }
}
