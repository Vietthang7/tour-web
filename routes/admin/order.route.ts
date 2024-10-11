import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/order.controller";
router.get("/", controller.index);
// router.get("/create", controller.create);
// router.post(
//   "/create",
//   upload.fields([
//     {
//       name: "images",
//       maxCount: 6
//     }
//   ]),
//   uploadCloud.uploadFields,
//   controller.createPost
// );
export const orderRoutes: Router = router;