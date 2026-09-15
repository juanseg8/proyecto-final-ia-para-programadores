import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { EstablishmentService } from '../establishment.service';

@Injectable()
export class EstablishmentOwnershipGuard implements CanActivate {
  constructor(private readonly establishmentService: EstablishmentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const establishmentId = request.params.id;
    const userId = request.user.userId;

    if (!establishmentId) {
      return true; // No route param, skip guard
    }

    const establishment = await this.establishmentService.findById(establishmentId);

    if (!establishment || establishment.userId !== userId) {
      throw new NotFoundException(); // Apply strict INV-05 logic: return 404 for not found or not owned
    }

    // Attach to request so controller doesn't need to fetch it again
    request.establishment = establishment;
    
    return true;
  }
}
