"use strict";
import apiKeyModel from "../model/apiKey.model.js";

class ApiKeyService {
    static async findByKey(key) {
        return await apiKeyModel.findOne({ key }).lean();
    }
}

export default ApiKeyService;
