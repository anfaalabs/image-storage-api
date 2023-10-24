import { Router, type Request, type Response } from "express";
import ImageRouter from "./image.route";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
    res.sendResponse("success", 200, {
        message: "Welcome to the API"
    });
});

router.use("/image", ImageRouter);

export default router;
