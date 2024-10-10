import { Router } from "express";
import multer from "multer";
const router: Router = Router();
import * as controller from "../../controllers/admin/tour.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
const upload = multer();
router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.fields([
    {
      name: "images",
      maxCount: 6
    }
  ]),
  uploadCloud.uploadFields,
  controller.createPost
);
export const tourRoutes: Router = router;