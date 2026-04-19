import { ResourceRepository } from "../../infrastructure/repositories/ResourceRepository";
import { Resource } from "../../domain/models/Resource";
import { v4 as uuidv4 } from "uuid";
import { RentalRepository } from "../../infrastructure/repositories/RentalRepository";

export class ResourceService {
  constructor(
    private resourceRepo: ResourceRepository,
    private rentalRepo: RentalRepository
  ) {}

  public async createResource(data: {
    ownerId: string;
    name: string;
    description: string;
    category: string;
    depositAmount: number;
    rentPerDay: number;
    quantity: number;
  }): Promise<Resource> {
    const resource = new Resource(
      uuidv4(),
      data.ownerId,
      data.name,
      data.description,
      data.category,
      data.depositAmount,
      data.rentPerDay,
      data.quantity,
      new Date(),
      new Date()
    );
    return await this.resourceRepo.save(resource);
  }

  public async updateResource(id: string, ownerId: string, data: Partial<Resource>): Promise<Resource> {
    const resource = await this.resourceRepo.findById(id);
    if (!resource) throw new Error("Resource not found");
    if (resource.ownerId !== ownerId) throw new Error("Unauthorized to update this resource");

    const activeRentals = (await this.rentalRepo.findByResourceId(id)).filter(r => 
      ["ACTIVE", "REQUESTED", "APPROVED"].includes(r.status)
    );

    if (activeRentals.length > 0) {
      throw new Error("Cannot update resource with active or pending rentals");
    }

    Object.assign(resource, data);
    return await this.resourceRepo.save(resource);
  }

  public async deleteResource(id: string, ownerId: string): Promise<void> {
    const resource = await this.resourceRepo.findById(id);
    if (!resource) throw new Error("Resource not found");
    if (resource.ownerId !== ownerId) throw new Error("Unauthorized to delete this resource");

    const activeRentals = (await this.rentalRepo.findByResourceId(id)).filter(r => 
      ["ACTIVE", "REQUESTED", "APPROVED", "LATE"].includes(r.status)
    );

    if (activeRentals.length > 0) {
      throw new Error("Cannot delete resource with active or pending rentals");
    }

    await this.resourceRepo.delete(id);
  }

  public async getAllResources(): Promise<Resource[]> {
    return await this.resourceRepo.findAll();
  }

  public async getResourceDetails(id: string): Promise<Resource | null> {
    return await this.resourceRepo.findById(id);
  }
}
