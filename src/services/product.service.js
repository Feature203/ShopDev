"use strict";
import { BadRequest, ErrorResponse } from "../core/error.response.js";
import { product, clothing, electronic } from "../model/product.model.js";

// define Factory class to create product
class ProductFactory {
    static async createProduct(type, payload) {
        switch (type) {
            case "Electronics":
                return await new Electronic(payload).createProduct();
            case "Clothing":
                return await new Clothing(payload).createProduct();
            case "Furniture":
                return await new Furniture(payload).createProduct();
            default:
                throw new BadRequest(`Invalid Product Types ${type}`);
        }
    }
}

//  > Define base product (Sản Phẩm) class
class Product {
    constructor({
        product_thumb,
        product_description,
        product_price,
        product_quanlity,
        product_type,
        product_shop,
        product_attributes,
        product_name,
    }) {
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quanlity = product_quanlity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
        this.product_name = product_name;
    }

    // create new product
    async createProduct(product_id) {
        return await product.create({
            ...this,
            _id: product_id,
        });
    }
}

// > Define sub class for different product types Clothing (Quần áo)

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes);
        if (!newClothing) throw new BadRequest("create new clothing err !!!");

        // Product
        const newProduct = await super.createProduct();
        if (!newProduct) throw new ErrorResponse("create new Product err !!!!");

        return newProduct;
    }
}
// > Define sub class for different product types electronic (điện tử)

class Electronic extends Product {
    async createProduct() {
        //* input :{product_attributes:"Ok"}
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newElectronic) throw new BadRequest("create new clothing err !!!");

        const newProduct = await super.createProduct(newElectronic._id);
        //* Product.createProduct();

        if (!newProduct) throw new ErrorResponse("create new Product err !!!!");

        return newProduct;
    }
}
class Furniture extends Product {
    async createProduct() {
        //* input :{product_attributes:"Ok"}
        const newFurniture = await Furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newFurniture) throw new BadRequest("create new clothing err !!!");

        const newProduct = await super.createProduct(newFurniture._id);
        //* Product.createProduct();

        if (!newProduct) throw new ErrorResponse("create new Product err !!!!");

        return newProduct;
    }
}

export default ProductFactory;
