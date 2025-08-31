// src/controllers/product.controller.js
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Product from "../models/product.models.js";
import mongoose from "mongoose";
import { Review } from "../models/review.model.js";
// @desc    Get all products (with pagination & search)
export const getProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search, category, brand } = req.query;
    const query = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { sku: { $regex: search, $options: "i" } },
        ];
    }
    if (category && mongoose.isValidObjectId(category))
        query.category = category;
    if (brand && mongoose.isValidObjectId(brand)) query.brand = brand;
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
        Product.find(query)
            .populate("category")
            .populate("brand")
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 }),
        Product.countDocuments(query),
    ]);

    const pagination = {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
    };

    res.status(200).json(
        new ApiResponse(
            200,
            { products, pagination },
            "Products fetched successfully"
        )
    );
});

// @desc    Get single product

export const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        throw new ApiError(400, "Valid Product ID is required");

    const product = await Product.findById(id)
        .populate("category")
        .populate("brand")
        .lean(); // necessary to attach reviews manually

    if (!product) throw new ApiError(404, "Product not found");

    const reviews = await Review.find({ productId: id })
        .populate("userId", "name")
        .sort({ createdAt: -1 });

    product.reviews = reviews;

    res.status(200).json(
        new ApiResponse(200, product, "Product fetched successfully")
    );
});

// @desc    Create new product
export const createProduct = asyncHandler(async (req, res) => {
    let {
        name,
        description,
        price,
        discount,
        stock_quantity,
        sku,
        category,
        brand,
        product_id,
    } = req.body;

    // ➊ Coerce SKU to string and trim
    const skuStr = sku !== undefined ? String(sku).trim() : "";

    // 1️⃣ Basic validation
    if (!name?.trim()) throw new ApiError(400, "Product name is required");
    if (!price) throw new ApiError(400, "Price is required");
    if (!skuStr) throw new ApiError(400, "SKU is required");
    if (product_id !== undefined && isNaN(Number(product_id))) {
        throw new ApiError(400, "product_id must be a number");
    }

    // 2️⃣ Uniqueness checks: SKU & product_id
    const conflict = await Product.findOne({
        $or: [
            { sku: skuStr },
            ...(product_id !== undefined
                ? [{ product_id: Number(product_id) }]
                : []),
        ],
    });
    if (conflict) throw new ApiError(409, "SKU or product_id already exists");

    // 3️⃣ Upload images
    let mainImage = "";
    const gallery = [];

    if (req.files?.image_url?.[0]) {
        const { url } = await uploadOnCloudinary(req.files.image_url[0].path);
        mainImage = url;
    }
    if (req.files?.additional_images) {
        for (const file of req.files.additional_images) {
            const { url } = await uploadOnCloudinary(file.path);
            gallery.push(url);
        }
    }

    // 4️⃣ Build & create
    const product = await Product.create({
        product_id: product_id !== undefined ? Number(product_id) : undefined,
        name: name.trim(),
        description: description?.trim() || "",
        price: mongoose.Types.Decimal128.fromString(Number(price).toFixed(2)),
        discount: mongoose.Types.Decimal128.fromString(
            Number(discount || 0).toFixed(2)
        ),
        stock_quantity: Number(stock_quantity) || 0,
        sku: skuStr,
        category: mongoose.isValidObjectId(category) ? category : undefined,
        brand: mongoose.isValidObjectId(brand) ? brand : undefined,
        image_url: mainImage,
        additional_images: gallery,
        // rest take defaults
    });

    res.status(201).json(
        new ApiResponse(201, product, "Product created successfully")
    );
});

// @desc    Update product
export const updateProduct = asyncHandler(async (req, res) => {
    const rawId = req.params.id?.trim();
    if (!mongoose.isValidObjectId(rawId))
        throw new ApiError(400, "Valid Product ID is required");

    let {
        name,
        description,
        price,
        discount,
        stock_quantity,
        sku,
        category,
        brand,
        product_id,
    } = req.body;

    // ➋ Coerce SKU to string if provided
    const skuStr = sku !== undefined ? String(sku).trim() : undefined;

    const product = await Product.findById(rawId);
    if (!product) throw new ApiError(404, "Product not found");
    if (product_id !== undefined && isNaN(Number(product_id))) {
        throw new ApiError(400, "product_id must be a number");
    }

    // Uniqueness
    const conflict = await Product.findOne({
        _id: { $ne: rawId },
        $or: [
            ...(skuStr ? [{ sku: skuStr }] : []),
            ...(product_id !== undefined
                ? [{ product_id: Number(product_id) }]
                : []),
        ],
    });
    if (conflict) throw new ApiError(409, "SKU or product_id already exists");

    // Image uploads
    let mainImage = product.image_url;
    const gallery = [...product.additional_images];

    if (req.files?.image_url?.[0]) {
        const { url } = await uploadOnCloudinary(req.files.image_url[0].path);
        mainImage = url;
    }
    if (req.files?.additional_images) {
        for (const file of req.files.additional_images) {
            const { url } = await uploadOnCloudinary(file.path);
            gallery.push(url);
        }
    }

    // Build update payload
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (description) updateData.description = description.trim();
    if (price)
        updateData.price = mongoose.Types.Decimal128.fromString(
            Number(price).toFixed(2)
        );
    if (discount !== undefined)
        updateData.discount = mongoose.Types.Decimal128.fromString(
            Number(discount).toFixed(2)
        );
    if (stock_quantity) updateData.stock_quantity = Number(stock_quantity);
    if (skuStr !== undefined) updateData.sku = skuStr;
    if (category)
        updateData.category = mongoose.isValidObjectId(category)
            ? category
            : product.category;
    if (brand)
        updateData.brand = mongoose.isValidObjectId(brand)
            ? brand
            : product.brand;
    if (product_id !== undefined) updateData.product_id = Number(product_id);
    updateData.image_url = mainImage;
    updateData.additional_images = gallery;

    const updated = await Product.findByIdAndUpdate(
        rawId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    res.status(200).json(
        new ApiResponse(200, updated, "Product updated successfully")
    );
});

// @desc    Delete product
export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        throw new ApiError(400, "Valid Product ID is required");

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) throw new ApiError(404, "Product not found");

    res.status(200).json(
        new ApiResponse(200, {}, "Product deleted successfully")
    );
});
