import express from "express";

const router = express.Router();
import * as controller from "../../controllers/client/tour.controller";

router.get("/:slugCategory", controller.index);
export const tourRoute = router;
