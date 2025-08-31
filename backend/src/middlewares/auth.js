import asyncHandler from "./../utils/asyncHandler.js";
import ApiError from "./../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "./../models/user.models.js";
import Admin from "../models/admin.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return next(new ApiError(401, "No access token provided"));
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken -emailVerificationExpiry -emailVerificationToken -forgotPasswordExpiry -forgotPasswordToken -refreshToken -isEmailVerified"
        );

        if (!user) {
            return next(new ApiError(401, "User not found for this token"));
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Error:", error);
        return next(
            new ApiError(401, error?.message || "Invalid access token")
        );
    }
});

export const authorizeRoles = (...allowedRoles) => {
    return (req, _res, next) => {
        try {
            if (!req.user || !allowedRoles.includes(req.user.role)) {
                return next(new ApiError(403, "insufficient permissions"));
            }
            next();
        } catch (error) {
            return next(new ApiError(403, " insufficient permissions"));
        }
    };
};

// Ensure only SUPER_ADMIN / ADMIN / SUB_ADMIN can access admin dashboard endpoints
export const requireAdminAccess = asyncHandler(async (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, "Unauthorized"));
    const role = req.user.role;

    if (role === "CUSTOMER") {
        return next(
            new ApiError(403, "Customers cannot access admin dashboard")
        );
    }

    if (role === "SUPER_ADMIN") {
        return next();
    }

    // For ADMIN/SUB_ADMIN ensure an active Admin profile exists
    const admin = await Admin.findOne({ user: req.user._id });
    if (!admin || admin.isActive === false) {
        return next(
            new ApiError(
                403,
                "Your admin account is inactive or not configured"
            )
        );
    }

    req.adminProfile = admin;
    next();
});

// Check if the current user has a specific module/right permission
export const requirePermission = (module, right = "VIEW") =>
    asyncHandler(async (req, _res, next) => {
        if (!req.user) return next(new ApiError(401, "Unauthorized"));

        // SUPER_ADMIN bypasses permissions
        if (req.user.role === "SUPER_ADMIN") return next();

        // Load admin profile if not already loaded
        let admin = req.adminProfile;
        if (!admin) {
            admin = await Admin.findOne({ user: req.user._id });
            if (!admin) {
                return next(new ApiError(403, "Admin profile not found"));
            }
            if (admin.isActive === false) {
                return next(
                    new ApiError(403, "Your admin account is inactive")
                );
            }
        }

        const has = (admin.permissions || []).some(
            (p) =>
                p.module === String(module).toUpperCase() &&
                (p.rights || [])
                    .map((r) => String(r).toUpperCase())
                    .includes(String(right).toUpperCase())
        );

        if (!has) {
            return next(
                new ApiError(403, `Missing permission ${module}:${right}`)
            );
        }

        next();
    });
