import { Express } from "express";
import { categoryRoutes } from "./category.route";
import { systemConfig } from "../../config/system";
import { tourRoutes } from "./tour.route";
import { orderRoutes } from "./order.route";
import { accountRoute } from "./account.route";
import { roleRoute } from "./role.route";
export const adminRoutes = (app: Express): void => {
  const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

  app.use(`${PATH_ADMIN}/categories`, categoryRoutes);
  app.use(`${PATH_ADMIN}/tours`, tourRoutes);
  app.use(`${PATH_ADMIN}/orders`, orderRoutes);
  app.use(`${PATH_ADMIN}/accounts`, accountRoute);
  app.use(`${PATH_ADMIN}/roles`, roleRoute);
};