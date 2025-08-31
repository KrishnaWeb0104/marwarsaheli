import express from "express";
import {
    createOrder,
    getOrderById,
    cancelOrder,
    getUserOrders,
    updateOrderStatus,
    deleteOrder,
    returnOrder,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.js";
import { requireAdminAccess, requirePermission } from "../middlewares/auth.js";

const router = express.Router();

router
    .route("/create-order")
    .post(
        verifyJWT,
        requireAdminAccess,
        requirePermission("ORDERS", "CREATE"),
        createOrder
    );
router
    .route("/get-all")
    .get(
        verifyJWT,
        requireAdminAccess,
        requirePermission("ORDERS", "VIEW"),
        getUserOrders
    );
router
    .route("/:id")
    .get(
        verifyJWT,
        requireAdminAccess,
        requirePermission("ORDERS", "VIEW"),
        getOrderById
    );
router
    .route("/delete-order/:id")
    .delete(
        verifyJWT,
        requireAdminAccess,
        requirePermission("ORDERS", "DELETE"),
        deleteOrder
    );
router.post(
    "/return-order/:id",
    verifyJWT,
    requireAdminAccess,
    requirePermission("ORDERS", "UPDATE"),
    returnOrder
);
router
    .route("/status-order/:id")
    .put(
        verifyJWT,
        requireAdminAccess,
        requirePermission("ORDERS", "UPDATE"),
        updateOrderStatus
    );
router.post(
    "/cancel-order/:id",
    verifyJWT,
    requireAdminAccess,
    requirePermission("ORDERS", "UPDATE"),
    cancelOrder
);

export default router;
