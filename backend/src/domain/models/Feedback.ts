export class Notification {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly message: string,
    public isRead: boolean,
    public readonly createdAt: Date
  ) {}

  public markAsRead(): void {
    this.isRead = true;
  }
}

export class Rating {
  constructor(
    public readonly id: string,
    public readonly rentalId: string,
    public readonly fromUserId: string,
    public readonly toUserId: string,
    public readonly score: number,
    public readonly comment: string | null,
    public readonly createdAt: Date
  ) {
    if (score < 1 || score > 5) {
      throw new Error("Rating score must be between 1 and 5.");
    }
  }
}
