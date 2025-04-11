import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategory,
  addReview,
  deleteReview,
  searchProducts,
  getProducts,
  getProductById,
  editProduct,
  addProductImage,
  deleteProductImage,
  addToCart,
  removeFromCart,
  getCart,
  addToWishList,
  removeFromWishList,
  getWishList,
  getMultipleProductsById,
} from "../controllers/productController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrorsMiddleware.js";

const router = express.Router();

router.post(
  "/admin/add",
  isAuthenticated,
  isAuthorized("admin", "seller"),
  addProduct
);

router.post(
  "/admin/upload-images",
  isAuthenticated,
  isAuthorized("admin", "seller"),
  upload,
  catchAsyncErrors(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No Images uploaded!" });
    }
    const imageUrls = req.files.map((file) => file.path);

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrls,
    });
  })
);

router.post(
  "/admin/add-images/:id",
  isAuthenticated,
  isAuthorized("admin", "seller"),
  upload,
  addProductImage
);

router.delete(
  "/admin/remove-image/:id",
  isAuthenticated,
  isAuthorized("admin", "seller"),
  deleteProductImage
);

router.delete(
  "/admin/delete/:id",
  isAuthenticated,
  isAuthorized("admin", "seller"),
  deleteProduct
);
router.get("/wishlist", isAuthenticated, isAuthorized("customer"), getWishList);
router.get("/cart", isAuthenticated, isAuthorized("customer"), getCart);
router.get("/search", searchProducts);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/get-multiple", getMultipleProductsById);
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("admin", "seller"),
  editProduct
);

router.post(
  "/add-cart/:id",
  isAuthenticated,
  isAuthorized("customer"),
  addToCart
);

// router.get("/all", isAuthenticated, getAllProducts);
router.get("/:category", getProductsByCategory);

router.delete(
  "/remove-cart/:id",
  isAuthenticated,
  isAuthorized("customer"),
  removeFromCart
);

router.post(
  "/add-wishlist/:id",
  isAuthenticated,
  isAuthorized("customer"),
  addToWishList
);
router.delete(
  "/remove-wishlist/:id",
  isAuthenticated,
  isAuthorized("customer"),
  removeFromWishList
);

router.post("/review/add/:productId", isAuthenticated, addReview);
router.delete(
  "/review/delete/:productId/:reviewId",
  isAuthenticated,
  isAuthorized("customer", "admin"),
  deleteReview
);

export default router;
