import { model } from "mongoose";
import { ImageSchema } from "../schemas";

export const Image = model("image", ImageSchema);
