import express from "express";

const router = express.Router();
import * as controller from "../../controllers/client/cart.controller";

router.get("/",controller.index);
router.post("/list-json",controller.listJson);
export const cartRoute = router;
