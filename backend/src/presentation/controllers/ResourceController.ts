import { Request, Response } from "express";
import { ResourceService } from "../../application/services/ResourceService";

export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const ownerId = (req as any).user.id;
      const resource = await this.resourceService.createResource({ ...req.body, ownerId });
      res.status(201).json(resource);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const ownerId = (req as any).user.id;
      const { id } = req.params;
      const resource = await this.resourceService.updateResource(id as string, ownerId, req.body);
      res.status(200).json(resource);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const ownerId = (req as any).user.id;
      const { id } = req.params;
      await this.resourceService.deleteResource(id as string, ownerId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public list = async (req: Request, res: Response): Promise<void> => {
    try {
      const resources = await this.resourceService.getAllResources();
      res.status(200).json(resources);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const resource = await this.resourceService.getResourceDetails(id as string);
      if (!resource) {
        res.status(404).json({ error: "Resource not found" });
        return;
      }
      res.status(200).json(resource);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
