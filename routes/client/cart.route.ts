import express from "express";

const router = express.Router();
import * as controller from "../../controllers/client/cart.controller";

router.get("/",controller.index);
export const cartRoute = router;
