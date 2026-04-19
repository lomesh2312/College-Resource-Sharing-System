export abstract class User {
  protected constructor(
    public readonly id: string,
    public readonly email: string,
    public name: string,
    protected passwordHash: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public getPasswordHash(): string {
    return this.passwordHash;
  }

  public setPasswordHash(hash: string): void {
    this.passwordHash = hash;
  }
}

export class Student extends User {
  public walletBalance: number;

  constructor(
    id: string,
    email: string,
    name: string,
    passwordHash: string,
    walletBalance: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, email, name, passwordHash, createdAt, updatedAt);
    this.walletBalance = walletBalance;
  }

  public deductBalance(amount: number): void {
    if (this.walletBalance < amount) {
      throw new Error("Insufficient wallet balance.");
    }
    this.walletBalance -= amount;
  }

  public addBalance(amount: number): void {
    this.walletBalance += amount;
  }
}
