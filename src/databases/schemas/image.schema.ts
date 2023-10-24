import { randomBytes } from "crypto";
import { Schema } from "mongoose";
import { type TImageSchema } from "./types";

const ImageSchema = new Schema<TImageSchema>({
    uid: {
        type: String,
        default: () => randomBytes(16).toString("hex")
    },
    file: {
        name: {
            type: String,
            required: true
        },
        originalName: {
            type: String,
            required: true
        },
        mimeType: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        }
    },
    uploadDate: {
        type: String,
        default: () => new Date().toISOString()
    }
});

export default ImageSchema;
