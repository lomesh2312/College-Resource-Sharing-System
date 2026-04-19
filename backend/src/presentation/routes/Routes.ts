import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { ResourceController } from "../controllers/ResourceController";
import { RentalController } from "../controllers/RentalController";
import { UserService } from "../../application/services/UserService";
import { ResourceService } from "../../application/services/ResourceService";
import { RentalService } from "../../application/services/RentalService";
import { StudentRepository } from "../../infrastructure/repositories/StudentRepository";
import { ResourceRepository } from "../../infrastructure/repositories/ResourceRepository";
import { RentalRepository } from "../../infrastructure/repositories/RentalRepository";
import { StandardPaymentStrategy, ProgressiveFineStrategy } from "../../domain/strategies/Strategy";
import { authMiddleware } from "../middlewares/AuthMiddleware";

export function createRouter(): Router {
  const router = Router();

  const studentRepo = new StudentRepository();
  const resourceRepo = new ResourceRepository();
  const rentalRepo = new RentalRepository();

  const paymentStrategy = new StandardPaymentStrategy();
  const fineStrategy = new ProgressiveFineStrategy();

  const userService = new UserService(studentRepo);
  const resourceService = new ResourceService(resourceRepo, rentalRepo);
  const rentalService = new RentalService(
    rentalRepo,
    resourceRepo,
    studentRepo,
    paymentStrategy,
    fineStrategy
  );

  const userController = new UserController(userService);
  const resourceController = new ResourceController(resourceService);
  const rentalController = new RentalController(rentalService);

  router.post("/auth/register", userController.register);
  router.post("/auth/login", userController.login);
  router.get("/auth/profile", authMiddleware, userController.getProfile);

  router.get("/resources/my", authMiddleware, async (req, res) => {
    const items = await new ResourceRepository().findByOwnerId((req as any).user.id);
    res.json(items);
  });
  router.get("/rentals/my", authMiddleware, async (req, res) => {
    const items = await new RentalRepository().findByRenterId((req as any).user.id);
    res.json(items);
  });

  router.get("/resources", resourceController.list);
  router.get("/resources/:id", resourceController.getById);
  router.post("/resources", authMiddleware, resourceController.create);
  router.put("/resources/:id", authMiddleware, resourceController.update);
  router.delete("/resources/:id", authMiddleware, resourceController.delete);

  router.post("/rentals/request", authMiddleware, rentalController.request);
  router.post("/rentals/:id/approve", authMiddleware, rentalController.approve);
  router.post("/rentals/:id/start", authMiddleware, rentalController.start);
  router.post("/rentals/:id/complete", authMiddleware, rentalController.complete);

  return router;
}
