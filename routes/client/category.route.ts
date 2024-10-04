import express from "express";
const router = express.Router();

import * as controller from "../../controllers/client/category.controller";

router.get("/", controller.index);
export const categoryRoute = router