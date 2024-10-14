import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/order.controller";
import { inFoUserOrder } from "../../validates/admin/order.validate";
router.get("/", controller.index);
router.patch("/change-status/:statusChange/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  inFoUserOrder,
  controller.editPatch
);
router.get("/delete-item/:id", controller.deleteItem);
export const orderRoutes: Router = router;