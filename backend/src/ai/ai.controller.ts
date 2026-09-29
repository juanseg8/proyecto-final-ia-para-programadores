import { Controller, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EstablishmentOwnershipGuard } from '../establishments/guards/establishment-ownership.guard';

@Controller('establishments/:establishmentId/ai')
@UseGuards(JwtAuthGuard, EstablishmentOwnershipGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ask')
  async ask(
    @Param('establishmentId') establishmentId: string,
    @Body('question') question: string,
    @Req() req: any,
  ) {
    if (!question) {
      throw new Error('La pregunta es requerida');
    }

    const userId = req.user.userId;
    return this.aiService.ask(userId, establishmentId, question);
  }
}
