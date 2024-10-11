import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/category.controller";
import multer from "multer";
const upload = multer();
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single('image'),
  uploadCloud.uploadSingle,
  controller.createPost
);
router.get("/edit/:id", controller.edit);

export const categoryRoutes: Router = router;