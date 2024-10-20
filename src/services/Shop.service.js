"use strict";
import shopModel from "../model/shop.model.js";

class ShopService {
    static async findByEmail({
        email,
        select = {
            _id: 1,
            email: 1,
            name: 1,
            password: 1,
        },
    }) {
        return await shopModel.findOne({ email }).select(select).lean();
    }

    static async findByShopId({ _id }) {
        return await shopModel.findById({ _id }).lean();
    }
}

export default ShopService;
