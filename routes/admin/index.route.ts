import { Express } from "express";
import { categoryRoutes } from "./category.route";
import { systemConfig } from "../../config/system";
import { tourRoutes } from "./tour.route";
import { orderRoutes } from "./order.route";
import { accountRoute } from "./account.route";
import { roleRoute } from "./role.route";
import { authRoute } from "./auth.route";
import { requireAuth } from "../../middlewares/admin/auth.middleware";
export const adminRoutes = (app: Express): void => {
  const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

  app.use(`${PATH_ADMIN}/categories`,requireAuth, categoryRoutes);
  app.use(`${PATH_ADMIN}/tours`,requireAuth, tourRoutes);
  app.use(`${PATH_ADMIN}/orders`,requireAuth, orderRoutes);
  app.use(`${PATH_ADMIN}/accounts`,requireAuth, accountRoute);
  app.use(`${PATH_ADMIN}/roles`,requireAuth, roleRoute);
  app.use(`${PATH_ADMIN}/auth`, authRoute);
};