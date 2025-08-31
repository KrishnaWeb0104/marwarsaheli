import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from "../controllers/cart.controllers.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyJWT, getCart);
router.post("/add-cart", verifyJWT, addToCart);
router.patch("/update-cart/:id", verifyJWT, updateCartItem);
router.delete("/delete-cart/:id", verifyJWT, removeFromCart);
router.delete("/clear-cart", verifyJWT, clearCart);

export default router;
