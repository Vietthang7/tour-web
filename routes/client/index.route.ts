import { Express } from "express";
import { tourRoute } from "./tour.route";
export const routesClient = (app: Express) => {
  app.use("/tours", tourRoute);
}