import express from "express";
import multer from "multer";
const router = express.Router();
import { editPatchAccount } from "../../validates/admin/account.validate";
import { createPostAccount } from "../../validates/admin/account.validate";
import * as controller from "../../controllers/admin/account.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
const upload = multer();
router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single('avatar'),
  uploadCloud.uploadSingle,
  createPostAccount,
  controller.createPost
);
// router.get("/edit/:id",controller.edit);
// router.patch(
//   "/edit/:id",
//   upload.single('avatar'),
//   uploadCloud.uploadSingle,
//   editPatchAccount,
//   controller.editPatch
// );
// router.get("/detail/:id",controller.detail);
// router.patch("/delete/:id",controller.deleteItem);
// router.patch("/change-status/:statusChange/:id", controller.changeStatus);
// router.patch("/change-multi", controller.changeMulti);
export const accountRoute = router;
