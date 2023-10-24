import { randomBytes, randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { ApiError } from "../classes";
import { Image } from "../databases/models";
import { type TImageSchema } from "../databases/schemas/types";

type MulterFileType = Express.Multer.File;
type CheckFileOptions = {
    errorMessage?: string;
    errorCode?: number;
};

const allowedFileExtensions = [".jpg", ".jpeg", ".png", ".webp"];
const uploadPath = path.resolve(process.cwd(), "upload");

/**
 * Check the upload folder
 */
const checkFolder = () => {
    if (!fs.existsSync(uploadPath)) {
        // Create upload directory if it doesn't exist
        fs.mkdirSync(uploadPath);
    }
};

/**
 * Check files on disk
 * @param {String} filepath filepath
 */
const checkFile = (filepath: string, options?: CheckFileOptions) => {
    if (!fs.existsSync(filepath)) {
        throw new ApiError(
            options?.errorMessage || "File not found",
            options?.errorCode || 404
        );
    }
};

const deleteFile = (filepath: string) => {
    fs.unlinkSync(filepath);
};

/**
 * Upload image to server
 * @param {MulterFileType} file file object
 * @returns {Promise<string>} uid of the file
 */
export const uploadImage = async (file?: MulterFileType): Promise<string> => {
    if (!file) {
        throw new ApiError("No file provided", 400);
    }

    checkFolder();

    const fileExtension = path.extname(file.originalname).toLowerCase();
    const newFileName = randomBytes(64).toString("base64url") + fileExtension;
    const newFilePath = path.resolve(uploadPath, newFileName);

    if (allowedFileExtensions.indexOf(fileExtension) === -1) {
        throw new ApiError("Extensions are not allowed", 400);
    }

    // Save the file buffer to upload folder
    fs.writeFileSync(newFilePath, file.buffer);

    checkFile(newFilePath, {
        errorMessage: "File failed to save on disk",
        errorCode: 500
    });

    const newImage = new Image({
        uid: randomUUID(),
        file: {
            name: newFileName,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size
        }
    });
    const image = await newImage.save();

    if (!image) {
        throw new ApiError("Could not save image", 500);
    }

    return image._id;
};

/**
 * Get image by file id
 * @param {String} id id of the file
 * @returns {Promise<TImageSchema["file"]>} filepath
 */
export const getImage = async (id: string): Promise<TImageSchema["file"]> => {
    if (!id) {
        throw new ApiError("No id provided", 400);
    }

    const image = await Image.findById(id);

    if (!image) {
        throw new ApiError("Image not found", 404);
    }

    const filepath = path.resolve(uploadPath, image.file.name);

    checkFile(filepath);

    return image.file;
};

/**
 * Delete image by file id
 * @param {String} id id of the file
 */
export const deleteImage = async (id: string) => {
    if (!id) {
        throw new ApiError("No id provided", 400);
    }

    const image = await Image.findById(id);

    if (!image) {
        throw new ApiError("Image not found", 404);
    }

    const filepath = path.resolve(uploadPath, image.file.name);

    checkFile(filepath);

    // delete file from disk
    deleteFile(filepath);

    // also delete file data from database
    await image.deleteOne();
};
