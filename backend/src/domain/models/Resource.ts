import { RentalStatus } from "./RentalStatus";
import { Rental } from "./Rental";

export class Resource {
  constructor(
    public readonly id: string,
    public readonly ownerId: string,
    public name: string,
    public description: string,
    public category: string,
    public depositAmount: number,
    public rentPerDay: number,
    public quantity: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public isAvailable(startDate: Date, endDate: Date, existingRentals: Rental[]): boolean {
    const overlappingRentals = existingRentals.filter(rental => {
      if (rental.status === RentalStatus.CANCELLED) return false;
      return rental.startDate < endDate && rental.endDate > startDate;
    });

    const activeOverlapCount = overlappingRentals.length;
    return activeOverlapCount < this.quantity;
  }
}
