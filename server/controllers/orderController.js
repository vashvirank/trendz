import { catchAsyncErrors } from "../middlewares/catchAsyncErrorsMiddleware.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";

export const addOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const { name, email, phone, address, city, country, zip, quantity, size } =
    req.body;

  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const variant = product.variants.find((v) => v.size === size);

  if (!variant || variant.stock <= 0) {
    return next(new ErrorHandler(`Product out of stock for size ${size}`, 400));
  }

  if (variant.stock < quantity) {
    return next(
      new ErrorHandler(
        `only ${variant.stock} products left for size ${size}`,
        400
      )
    );
  }

  variant.stock -= quantity;
  await product.save();

  const order = await Order.create({
    user: {
      id: user._id,
      name,
      email,
      phone,
      address,
      city,
      country,
      zip,
    },
    product: {
      id: product._id,
      name: product.name,
      images: product.images,
      price: product.price,
      seller: product.seller,
      sellerName: product.sellerName,
      category: product.category,
      quantity,
      size,
    },
    status: "pending",
    expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  user.orders.push({
    order_id: order._id,
    name,
    email,
    phone,
    address,
    city,
    country,
    zip,
    product: {
      id: product._id,
      name: product.name,
      images: product.images,
      price: product.price,
      seller: product.seller,
      sellerName: product.sellerName,
      quantity,
      size,
    },
    totalPrice: product.price * quantity,
    status: "pending",
    expectedDeliveryDate: order.expectedDeliveryDate,
  });
  await user.save();

  res.status(201).json({
    success: true,
    message: "Order added successfully",
    product,
  });
});

export const cancelOrder = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.status === "cancelled") {
    return next(new ErrorHandler("Order is already cancelled", 400));
  }

  order.status = "cancelled";
  await order.save();

  const product = await Product.findById({ _id: order.product.id });
  if (!product) return next(new ErrorHandler("Product not found", 404));
  if (!product.available) product.available = true;
  product.quantity += 1;
  await product.save();

  const user = await User.findById({
    _id: order.user.id,
    accountVerified: true,
  });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const cancelledOrder = user.orders.find(
    (order) => order.order_id.toString() === id
  );
  cancelledOrder.status = "cancelled";
  await user.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
  });
});

export const getOrderById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (order.user.id !== userId && user.role == "customer") {
    return next(new ErrorHandler("Unauthorized to view this order", 401));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

export const getMyOrder = catchAsyncErrors(async (req, res, next) => {
  const { orders } = req.user;
  res.status(200).json({
    success: true,
    orders,
  });
});

export const getAllOrderes = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({
    success: true,
    orders,
  });
});

export const getSellerOrderes = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const orders = await Order.find({
    "product.seller": user._id,
  });

  res.status(200).json({
    success: true,
    orders,
  });
});
