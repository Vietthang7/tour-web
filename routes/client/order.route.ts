import express from "express";
const router = express.Router();
import * as controller from "../../controllers/client/order.controller";
import { inFoUserOrder } from "../../validates/admin/order.validate";
router.post("/", controller.index);
router.get("/success/:orderCode", controller.success);
export const orderRoute = router;