import { Cart } from "../models/cart.model.js";
import Product from "../models/product.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// ✅ Get user's cart
export const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product"
    );

    if (!cart) throw new ApiError(404, "Cart not found");

    res.status(200).json(
        new ApiResponse(200, cart, "Cart fetched successfully")
    );
});

// ✅ Add item to cart
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity)
        throw new ApiError(400, "Product ID and quantity are required");

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: [{ product: productId, quantity }],
        });
    } else {
        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
    }

    res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

// ✅ Update item quantity
export const updateCartItem = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new ApiError(404, "Cart not found");

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) throw new ApiError(404, "Product not found in cart");

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(new ApiResponse(200, cart, "Cart updated"));
});

// ✅ Remove item from cart
export const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new ApiError(404, "Cart not found");

    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
    );
    await cart.save();

    res.status(200).json(new ApiResponse(200, cart, "Item removed from cart"));
});

// ✅ Clear entire cart
export const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOneAndDelete({ user: req.user._id });

    if (!cart) throw new ApiError(404, "Cart not found");

    res.status(200).json(new ApiResponse(200, {}, "Cart cleared"));
});
