import { type NextFunction, type Request, type Response } from "express";
// import path from "path";
// import fs from "fs";
import { ApiError } from "../classes";
import { ImageService } from "../services";

// const uploadPath = path.resolve(process.cwd(), "upload");

export const getImage = async (
    req: Request<{ uid: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { uid } = req.params;

        if (!uid || uid === ":uid") {
            throw new ApiError("No file uid provided", 400);
        }

        const image = await ImageService.getImage(uid);

        res.status(200)
            .setHeader("Content-Type", image.mimeType)
            .sendFile(image.path);
    } catch (error: any) {
        next(error);
    }
};

export const uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const file = req.file;

        if (!file) {
            res.sendResponse("error", 400, {
                message: "No file provided"
            });
            return;
        }

        const fileuId = await ImageService.uploadImage(file);

        return res.sendResponse("success", 200, {
            message: "Image uploaded successfully",
            data: {
                uid: fileuId,
                url: `${
                    process.env.BASE_URL || "http://localhost:5000"
                }/image/${fileuId}`
            }
        });
    } catch (error: any) {
        next(error);
    }
};

export const deleteImage = async (
    req: Request<{ uid: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { uid } = req.params;

        if (!uid || uid === ":uid") {
            res.sendResponse("error", 400, {
                message: "No file uid provided"
            });
            return;
        }

        await ImageService.deleteImage(uid);

        return res.sendResponse("success", 200, {
            message: "Image deleted successfully"
        });
    } catch (error: any) {
        next(error);
    }
};
