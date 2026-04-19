import { RentalStatus } from "./RentalStatus";

export class Rental {
  constructor(
    public readonly id: string,
    public readonly renterId: string,
    public readonly resourceId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public status: RentalStatus,
    public fineAmount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public calculateRentalDays(): number {
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  public calculateLateDays(actualReturnDate: Date): number {
    if (actualReturnDate <= this.endDate) return 0;
    const diffTime = Math.abs(actualReturnDate.getTime() - this.endDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
