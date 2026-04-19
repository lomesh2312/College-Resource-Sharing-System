import { Request, Response } from "express";
import { RentalService } from "../../application/services/RentalService";

export class RentalController {
  constructor(private rentalService: RentalService) {}

  public request = async (req: Request, res: Response): Promise<void> => {
    try {
      const renterId = (req as any).user.id;
      const { resourceId, startDate, endDate } = req.body;
      const rental = await this.rentalService.requestRental(
        renterId,
        resourceId,
        new Date(startDate),
        new Date(endDate)
      );
      res.status(201).json(rental);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public approve = async (req: Request, res: Response): Promise<void> => {
    try {
      const ownerId = (req as any).user.id;
      const { id } = req.params;
      const rental = await this.rentalService.approveRental(id as string, ownerId);
      res.status(200).json(rental);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public start = async (req: Request, res: Response): Promise<void> => {
    try {
      const renterId = (req as any).user.id;
      const { id } = req.params;
      const rental = await this.rentalService.startRental(id as string, renterId);
      res.status(200).json(rental);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public complete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { actualReturnDate } = req.body;
      const rental = await this.rentalService.completeRental(
        id as string,
        actualReturnDate ? new Date(actualReturnDate) : new Date()
      );
      res.status(200).json(rental);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
