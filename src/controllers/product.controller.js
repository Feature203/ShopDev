"use strict";
import { SuccessReponse } from "../core/succes.response.js";
import ProductFactory from "../services/product.service.js";

class ProductController {
    static async createProduct(req, res) {
        return new SuccessReponse({
            message: "Create new product success !",
            metaData: await ProductFactory.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res);
    }
}

export default ProductController;
