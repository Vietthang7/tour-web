import { Express } from "express";
import { tourRoute } from "./tour.route";
import { categoryRoute } from "./category.route";
import { cartRoute } from "./cart.route";
export const routesClient = (app: Express) => {
  app.use("/tours", tourRoute);
  app.use("/categories", categoryRoute);
  app.use("/cart", cartRoute);
}