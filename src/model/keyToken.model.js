import { Schema, model } from "mongoose";
import { createdDate, updatedDate } from "../utils/timezone.utils.js";

const DOCCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

const TokenKeyModel = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: "Shop",
        },
        privateKey: { type: String, required: true },
        publicKey: { type: String, required: true },
        refreshTokenUsed: { type: Array, default: [] },
        refreshToken: { type: String, required: true },
        createdDate,
        updatedDate,
    },
    {
        collection: COLLECTION_NAME,
    }
);

export default model(DOCCUMENT_NAME, TokenKeyModel);
