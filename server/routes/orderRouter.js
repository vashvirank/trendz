import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";
import {
  getMyOrder,
  addOrder,
  getAllOrderes,
  cancelOrder,
  getOrderById,
  getSellerOrderes,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/all", isAuthenticated, isAuthorized("admin"), getAllOrderes);

router.get("/my-orders", isAuthenticated, isAuthorized("customer"), getMyOrder);

router.post(
  "/add-order/:id",
  isAuthenticated,
  isAuthorized("customer"),
  addOrder
);

router.put(
  "/cancel/:id",
  isAuthenticated,
  isAuthorized("customer"),
  cancelOrder
);

router.get("/:id", isAuthenticated, getOrderById);

router.get(
  "/seller/all",
  isAuthenticated,
  isAuthorized("seller"),
  getSellerOrderes
);

export default router;
