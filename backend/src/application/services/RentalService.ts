import { v4 as uuidv4 } from "uuid";
import { RentalRepository } from "../../infrastructure/repositories/RentalRepository";
import { ResourceRepository } from "../../infrastructure/repositories/ResourceRepository";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { Rental } from "../../domain/models/Rental";
import { RentalStatus } from "../../domain/models/RentalStatus";
import { IPaymentStrategy, IFineStrategy } from "../../domain/strategies/Strategy";

export class RentalService {
  constructor(
    private rentalRepo: RentalRepository,
    private resourceRepo: ResourceRepository,
    private studentRepo: StudentRepository,
    private paymentStrategy: IPaymentStrategy,
    private fineStrategy: IFineStrategy
  ) {}

  public async requestRental(renterId: string, resourceId: string, startDate: Date, endDate: Date): Promise<Rental> {
    const resource = await this.resourceRepo.findById(resourceId);
    if (!resource) throw new Error("Resource not found");
    if (resource.ownerId === renterId) throw new Error("You cannot rent your own resource.");

    const renter = await this.studentRepo.findById(renterId);
    if (!renter) throw new Error("Renter not found");

    const existingRentals = await this.rentalRepo.findByResourceId(resourceId);
    if (!resource.isAvailable(startDate, endDate, existingRentals)) {
      throw new Error("Resource is not available for the selected dates.");
    }

    const depositRequired = this.paymentStrategy.calculateDeposit(resource.depositAmount);
    if (renter.walletBalance < depositRequired) {
      throw new Error("Insufficient wallet balance for deposit.");
    }

    const rental = new Rental(
      uuidv4(),
      renterId,
      resourceId,
      startDate,
      endDate,
      RentalStatus.REQUESTED,
      0,
      new Date(),
      new Date()
    );

    return await this.rentalRepo.save(rental);
  }

  public async approveRental(rentalId: string, ownerId: string): Promise<Rental> {
    const rental = await this.rentalRepo.findById(rentalId);
    if (!rental) throw new Error("Rental not found");

    const resource = await this.resourceRepo.findById(rental.resourceId);
    if (!resource || resource.ownerId !== ownerId) {
      throw new Error("Unauthorized to approve this rental.");
    }

    if (rental.status !== RentalStatus.REQUESTED) {
      throw new Error("Only REQUESTED rentals can be approved.");
    }

    const renter = await this.studentRepo.findById(rental.renterId);
    if (!renter) throw new Error("Renter not found");

    renter.deductBalance(resource.depositAmount);
    await this.studentRepo.save(renter);

    rental.status = RentalStatus.ACTIVE; 

    rental.status = RentalStatus.APPROVED;

    return await this.rentalRepo.save(rental);
  }

  public async startRental(rentalId: string, renterId: string): Promise<Rental> {
    const rental = await this.rentalRepo.findById(rentalId);
    if (!rental || rental.renterId !== renterId) throw new Error("Rental not found or unauthorized");
    if (rental.status !== RentalStatus.APPROVED) throw new Error("Rental must be approved before starting");

    rental.status = RentalStatus.ACTIVE;
    return await this.rentalRepo.save(rental);
  }

  public async completeRental(rentalId: string, actualReturnDate: Date): Promise<Rental> {
    const rental = await this.rentalRepo.findById(rentalId);
    if (!rental) throw new Error("Rental not found");
    if (rental.status !== RentalStatus.ACTIVE && rental.status !== RentalStatus.LATE) {
        throw new Error("Only ACTIVE or LATE rentals can be completed.");
    }

    const resource = await this.resourceRepo.findById(rental.resourceId);
    if (!resource) throw new Error("Resource not found");

    const renter = await this.studentRepo.findById(rental.renterId);
    if (!renter) throw new Error("Renter not found");

    const owner = await this.studentRepo.findById(resource.ownerId);
    if (!owner) throw new Error("Owner not found");

    const days = rental.calculateRentalDays();
    const rentalCost = this.paymentStrategy.calculateRental(days, resource.rentPerDay);

    let fine = 0;
    if (actualReturnDate > rental.endDate) {
        const lateDays = rental.calculateLateDays(actualReturnDate);
        fine = this.fineStrategy.calculateFine(lateDays, resource.rentPerDay);
    }

    const totalCost = rentalCost + fine;

    renter.deductBalance(totalCost);
    owner.addBalance(rentalCost); 

    owner.addBalance(fine);

    renter.addBalance(resource.depositAmount);

    await this.studentRepo.save(renter);
    await this.studentRepo.save(owner);

    rental.status = RentalStatus.COMPLETED;
    rental.fineAmount = fine;

    return await this.rentalRepo.save(rental);
  }
}
