import express from "express";

const router = express.Router();
import * as controller from "../../controllers/client/tour.controller";

router.get("/:slugCategory", controller.index);
router.get("/detail/:slugTour", controller.detail);
export const tourRoute = router;
