import { Router } from "express";
import { ImageController } from "../controllers";
import { UploadMiddleware } from "../middlewares";

const router = Router({
    strict: true
});

router.post("/", UploadMiddleware.single("image"), ImageController.uploadImage);
router.delete("/:uid", ImageController.deleteImage);

export default router;
