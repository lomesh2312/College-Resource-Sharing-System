export interface IPaymentStrategy {
  calculateDeposit(amount: number): number;
  calculateRental(days: number, ratePerDay: number): number;
}

export class StandardPaymentStrategy implements IPaymentStrategy {
  public calculateDeposit(amount: number): number {
    return amount;
  }

  public calculateRental(days: number, ratePerDay: number): number {
    return days * ratePerDay;
  }
}

export interface IFineStrategy {
  calculateFine(lateDays: number, dailyRate: number): number;
}

export class ProgressiveFineStrategy implements IFineStrategy {
  public calculateFine(lateDays: number, dailyRate: number): number {
    if (lateDays <= 0) return 0;

    if (lateDays <= 3) {
      return lateDays * dailyRate * 2;
    } else {
      return (3 * dailyRate * 2) + ((lateDays - 3) * dailyRate * 5);
    }
  }
}
