import { Request, Response } from "express";
import { UserService } from "../../application/services/UserService";

export class UserController {
  constructor(private userService: UserService) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, name, password } = req.body;
      const result = await this.userService.register(email, name, password);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };

  public getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const profile = await this.userService.getProfile(userId);
      if (!profile) {
        res.status(404).json({ error: "Profile not found" });
        return;
      }
      res.status(200).json({ student: profile });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
