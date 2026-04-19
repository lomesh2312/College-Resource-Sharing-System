import express from "express";
import cors from "cors";
import { createRouter } from "./presentation/routes/Routes";

export class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    const router = createRouter();
    router.get("/health", (req, res) => {
      res.status(200).json({ status: "ok" });
    });
    this.express.use("/api", router);
  }
}
