"use strict";
import express from "express";
const router = express.Router();
import { asyncHandler } from "../../helpers/asyncHandler.js";
import CheckAuth from "../../auth/checkAuth.js";
import ProductController from "../../controllers/product.controller.js";
import AuthUtils from "../../auth/authUtils.js";

//> X_API_KEY
router.use(CheckAuth.apiKey);
// > PRemission
router.use(CheckAuth.checkPremission("0000"));

console.log(1);
//> authorzition
router.use(asyncHandler(AuthUtils.authenzicationv3));

router.post("/", asyncHandler(ProductController.createProduct));

export default router;
