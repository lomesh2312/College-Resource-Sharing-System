import { Resource } from "../../domain/models/Resource";
import { IRepository } from "../../domain/interfaces/IRepository";
import { Database } from "../Database";

export class ResourceRepository implements IRepository<Resource> {
  private prisma = Database.getInstance();

  public async findById(id: string): Promise<Resource | null> {
    const item = await this.prisma.resource.findUnique({ where: { id } });
    if (!item) return null;
    return this.mapToDomain(item);
  }

  public async findAll(): Promise<Resource[]> {
    const items = await this.prisma.resource.findMany();
    return items.map(item => this.mapToDomain(item));
  }

  public async findByOwnerId(ownerId: string): Promise<Resource[]> {
    const items = await this.prisma.resource.findMany({ where: { ownerId } });
    return items.map(item => this.mapToDomain(item));
  }

  public async save(resource: Resource): Promise<Resource> {
    const data = {
      ownerId: resource.ownerId,
      name: resource.name,
      description: resource.description,
      category: resource.category,
      depositAmount: resource.depositAmount,
      rentPerDay: resource.rentPerDay,
      quantity: resource.quantity,
    };

    const item = await this.prisma.resource.upsert({
      where: { id: resource.id || "" },
      update: data,
      create: { ...data, id: resource.id },
    });

    return this.mapToDomain(item);
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.resource.delete({ where: { id } });
  }

  private mapToDomain(item: any): Resource {
    return new Resource(
      item.id,
      item.ownerId,
      item.name,
      item.description,
      item.category,
      item.depositAmount,
      item.rentPerDay,
      item.quantity,
      item.createdAt,
      item.updatedAt
    );
  }
}
