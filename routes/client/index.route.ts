import { Express } from "express";
import { tourRoute } from "./tour.route";
import { categoryRoute } from "./category.route";
export const routesClient = (app: Express) => {
  app.use("/tours", tourRoute);
  app.use("/categories", categoryRoute);
}