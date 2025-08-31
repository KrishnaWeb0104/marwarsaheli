// src/routes/product.routes.js
import { Router } from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.js";
import { requireAdminAccess, requirePermission } from "../middlewares/auth.js";

const router = Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected
router.post(
    "/add-product",
    verifyJWT,
    requireAdminAccess,
    requirePermission("PRODUCTS", "CREATE"),
    upload.fields([
        { name: "image_url", maxCount: 1 },
        { name: "additional_images", maxCount: 5 },
    ]),
    createProduct
);
router.patch(
    "/update-product/:id",
    verifyJWT,
    requireAdminAccess,
    requirePermission("PRODUCTS", "UPDATE"),
    upload.fields([
        { name: "image_url", maxCount: 1 },
        { name: "additional_images", maxCount: 5 },
    ]),
    updateProduct
);
router.delete(
    "/delete-product/:id",
    verifyJWT,
    requireAdminAccess,
    requirePermission("PRODUCTS", "DELETE"),
    deleteProduct
);

export default router;
