import { Rental } from "../../domain/models/Rental";
import { RentalStatus as DomainRentalStatus } from "../../domain/models/RentalStatus";
import { IRepository } from "../../domain/interfaces/IRepository";
import { Database } from "../Database";
import { RentalStatus as PrismaRentalStatus } from "@prisma/client";

export class RentalRepository implements IRepository<Rental> {
  private prisma = Database.getInstance();

  public async findById(id: string): Promise<Rental | null> {
    const item = await this.prisma.rental.findUnique({ where: { id } });
    if (!item) return null;
    return this.mapToDomain(item);
  }

  public async findAll(): Promise<Rental[]> {
    const items = await this.prisma.rental.findMany();
    return items.map(item => this.mapToDomain(item));
  }

  public async findByRenterId(renterId: string): Promise<Rental[]> {
    const items = await this.prisma.rental.findMany({ where: { renterId } });
    return items.map(item => this.mapToDomain(item));
  }

  public async findByResourceId(resourceId: string): Promise<Rental[]> {
    const items = await this.prisma.rental.findMany({ where: { resourceId } });
    return items.map(item => this.mapToDomain(item));
  }

  public async save(rental: Rental): Promise<Rental> {
    const data = {
      renterId: rental.renterId,
      resourceId: rental.resourceId,
      startDate: rental.startDate,
      endDate: rental.endDate,
      status: rental.status as PrismaRentalStatus,
      fineAmount: rental.fineAmount,
    };

    const item = await this.prisma.rental.upsert({
      where: { id: rental.id || "" },
      update: data,
      create: { ...data, id: rental.id },
    });

    return this.mapToDomain(item);
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.rental.delete({ where: { id } });
  }

  private mapToDomain(item: any): Rental {
    return new Rental(
      item.id,
      item.renterId,
      item.resourceId,
      item.startDate,
      item.endDate,
      item.status as DomainRentalStatus,
      item.fineAmount,
      item.createdAt,
      item.updatedAt
    );
  }
}
