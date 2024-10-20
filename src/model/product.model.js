import { Schema, model } from "mongoose";

const DOCCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productShema = new Schema(
    {
        product_name: { type: String, required: true },
        product_thumb: { type: String, required: true },
        product_description: String,
        product_price: { type: Number, required: true },
        product_quanlity: { type: Number, required: true },
        product_type: {
            type: String,
            required: true,
            enum: ["Electronics", "Clothing", "Furniture"],
        },
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        product_attributes: { type: Schema.Types.Mixed, required: true },
        product_slug: { type: String },
        // more
        product_ratingAverage: {
            type: Number,
            min: [1, "above is more a 1"],
            max: [5, "above is more a 5"],
            set: (val) => Math.round(val),
        },
        product_variations: { type: Array, default: [] },
        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
    },
    {
        collection: COLLECTION_NAME,
    }
);

//! define the "product_type = closthing"

const clothingSchema = new Schema(
    {
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        brand: { type: String, require: true },
        size: String,
        meterial: String,
    },
    {
        collection: "clothes",
    }
);

const electronicSchema = new Schema(
    {
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        brand: { type: String, require: true },
        size: String,
        meterial: String,
    },
    {
        collection: "electronics",
    }
);

const furnitureSchema = new Schema({
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    brand: { type: String, require: true },
    size: String,
    meterial: String,
});

const product = model(DOCCUMENT_NAME, productShema);
const electronic = model("Electronics", electronicSchema);
const clothing = model("Closthing", clothingSchema);
const furniture = model("Furniture", furnitureSchema);

export { product, electronic, clothing, furniture };
