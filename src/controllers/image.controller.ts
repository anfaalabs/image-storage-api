import { type NextFunction, type Request, type Response } from "express";
import path from "path";
import { ApiError } from "../classes";
import { ImageService } from "../services";

const uploadPath = path.resolve(process.cwd(), "upload");

export const getImage = async (
    req: Request<{ id?: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!id || id === ":id") {
            throw new ApiError("No file id provided", 400);
        }

        const image = await ImageService.getImage(id);

        return res
            .status(200)
            .set("Content-Type", image.mimeType)
            .sendFile(path.resolve(uploadPath, image.name));
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

        const fileId = await ImageService.uploadImage(file);

        return res.sendResponse("success", 200, {
            message: "Image uploaded successfully",
            data: {
                id: fileId,
                url: `${
                    process.env.BASE_URL || "http://localhost:5000"
                }/image/${fileId}`
            }
        });
    } catch (error: any) {
        next(error);
    }
};

export const deleteImage = async (
    req: Request<{ id?: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!id || id === ":id") {
            res.sendResponse("error", 400, {
                message: "No file id provided"
            });
            return;
        }

        await ImageService.deleteImage(id);

        return res.sendResponse("success", 200, {
            message: "Image deleted successfully"
        });
    } catch (error: any) {
        next(error);
    }
};
