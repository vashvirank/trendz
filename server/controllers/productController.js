import { catchAsyncErrors } from "../middlewares/catchAsyncErrorsMiddleware.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { deleteImageFromCloudinary } from "../services/imageService.js";

export const addProduct = catchAsyncErrors(async (req, res, next) => {
  let {
    name,
    brand,
    description,
    category,
    color,
    price,
    discount,
    offers,
    variants,
    stock,
    isBestSeller,
    specifications,
    deliveryOptions,
    returnPolicy,
    subCategory,
    images,
  } = req.body;
  price = Number(price);
  discount = Number(discount);
  stock = Number(stock);

  const seller = req.user._id;
  const sellerData = await User.findById(seller);
  const sellerName = sellerData.name;

  if (!name || !brand || !description || !category || !price || !seller) {
    return next(new ErrorHandler("Please fill in all required fields", 400));
  }

  if (
    typeof name !== "string" ||
    typeof brand !== "string" ||
    typeof description !== "string" ||
    typeof category !== "string"
  ) {
    return next(
      new ErrorHandler(
        "Invalid data types for name, brand, description, or category",
        400
      )
    );
  }

  if (isNaN(price) || price <= 0) {
    return next(new ErrorHandler("Price must be a positive number", 400));
  }

  if (discount && (isNaN(discount) || discount < 0 || discount > 100)) {
    return next(
      new ErrorHandler("Discount must be a number between 0 and 100", 400)
    );
  }
  if (stock && (isNaN(stock) || stock < 0)) {
    return next(new ErrorHandler("Stock must be a non-negative number", 400));
  }

  if (images && !Array.isArray(images)) {
    return next(new ErrorHandler("Images must be an array", 400));
  }

  // const product = await Product.create({
  //   name,
  //   brand,
  //   description,
  //   subCategory,
  //   category,
  //   price,
  //   discount: discount || 0,
  //   offers: offers || [],
  //   images,
  //   variants: variants || [],
  //   stock: stock || 0,
  //   seller,
  //   isBestSeller: isBestSeller || false,
  //   specifications: specifications || [],
  //   deliveryOptions: {
  //     isCOD: deliveryOptions?.isCOD || false,
  //     estimatedDelivery: deliveryOptions?.estimatedDelivery || "Not specified",
  //   },
  //   returnPolicy: {
  //     returnable: returnPolicy?.returnable || false,
  //     returnDays: returnPolicy?.returnDays || 0,
  //     warranty: returnPolicy?.warranty || "No warranty",
  //   },
  // });
  let product;
  try {
    product = await Product.create({
      name,
      brand,
      description,
      subCategory,
      category,
      price,
      discount: discount || 0,
      offers: offers || [],
      images,
      color,
      variants: variants || [],
      stock: stock || 0,
      seller,
      sellerName,
      isBestSeller: isBestSeller || false,
      specifications: specifications || [],
      deliveryOptions: {
        isCOD: deliveryOptions?.isCOD || false,
        estimatedDelivery:
          deliveryOptions?.estimatedDelivery || "Not specified",
      },
      returnPolicy: {
        returnable: returnPolicy?.returnable || false,
        returnDays: returnPolicy?.returnDays || 0,
        warranty: returnPolicy?.warranty || "No warranty",
      },
    });
  } catch (e) {
    console.log(e);
  }

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const addProductImage = catchAsyncErrors(async (req, res, next) => {
  const { id: productId } = req.params;

  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No images uploaded!" });
  }

  const imageUrls = req.files.map((file) => file.path);

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $push: { images: { $each: imageUrls } } },
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    return next(new ErrorHandler("Product not found", 404));
  }

  if (!updatedProduct) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const dbProduct = await Product.findById(productId).lean();

  res.status(201).json({
    success: true,
    message: "Images added successfully",
    images: dbProduct.images,
  });
});

export const deleteProductImage = catchAsyncErrors(async (req, res, next) => {
  const productId = req.params.id;
  const { imageUrl } = req.body;

  if (!productId || !imageUrl) {
    return next(new ErrorHandler("Product ID or Image URL is missing", 400));
  }

  try {
    try {
      await deleteImageFromCloudinary(imageUrl);
    } catch (cloudinaryError) {
      console.warn(
        "Image not found in Cloudinary or failed to delete👎:",
        cloudinaryError.message
      );
    }

    await Product.findByIdAndUpdate(productId, { $pull: { images: imageUrl } });

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to delete image", 500));
  }
});

export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

export const getProductById = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json({
    success: true,
    product,
  });
});

export const getMultipleProductsById = catchAsyncErrors(
  async (req, res, next) => {
    const { ids } = req.body;

    const Products = await Product.find({ _id: { $in: ids } }).select("images");
    if (!Products) {
      return res.status(404).json({ message: "Products not found" });
    }

    const products = ids
      .map((id) => Products.find((product) => product._id.toString() === id))
      .filter(Boolean);

    res.status(200).json({
      success: true,
      products,
    });
  }
);

export const editProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product.images.forEach((image) => {
    if (!req.body.images.includes(image)) {
      req.body.images.push(image);
    }
  });

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
    message: "Product updated successfully",
  });
});

export const getProductsByCategory = catchAsyncErrors(
  async (req, res, next) => {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.status(200).json({
      success: true,
      products,
    });
  }
);

export const getProducts = catchAsyncErrors(async (req, res, next) => {
  let filter = {};

  if (req.query.category != "All") {
    filter["category"] = req.query.category;
  }

  if (req.query.sellerName) {
    const { sellerName } = req.query;
    const seller = await User.findOne({
      name: sellerName,
      accountVerified: true,
    });
    if (!seller) {
      return next(new ErrorHandler("Seller not found or not verified", 404));
    }
    const sellerId = seller._id;
    filter["seller"] = sellerId;
  }

  if (req.query.color) {
    const colorArray = req.query.color.split(",").filter(Boolean);
    if (colorArray.length > 0) {
      filter["color"] = {
        $in: colorArray.map((color) => new RegExp(`^${color}$`, "i")),
      };
    }
  }

  if (req.query.brand) {
    const brandArray = req.query.brand.split(",").filter(Boolean);
    if (brandArray.length > 0) {
      filter["brand"] = {
        $in: brandArray.map((brand) => new RegExp(`^${brand}$`, "i")),
      };
    }
  }

  if (req.query.type) {
    const typeArray = req.query.type.split(",").filter(Boolean);
    if (typeArray.length > 0) {
      filter["name"] = {
        $in: typeArray.map((type) => new RegExp(`^${type}$`, "i")),
      };
    }
  }

  if (req.query.subCategory) {
    const subCategory = req.query.subCategory;
    const type = req.query.type;
    if (subCategory !== "All") {
      filter["subCategory"] = subCategory;
    } else if (type) {
      filter["subCategory"] = type;
    }
  }

  let order = req.query.order === "ascending" ? 1 : -1;
  let sortBy = "updatedAt";

  if (req.query.sortBy) {
    const sortOptions = {
      price: "price",
      ratings: "ratings",
      "no. of reviews": { reviews: { $size: 1 } },
    };
    sortBy = sortOptions[req.query.sortBy] || "createdAt";
  }

  let page = parseInt(req.query.page) || 1;
  let limit =
    parseInt(req.query.limit) || parseInt(process.env.PAGE_LIMIT) || 10;
  let skip = (page - 1) * limit;

  const total = await Product.countDocuments(filter);

  const productsList = await Product.find(filter)
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  if (!productsList) {
    return next(new ErrorHandler("No products found", 400));
  }

  res.status(200).json({
    success: true,
    products: productsList,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});

export const addReview = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const { rating, comment } = req.body;
  const { productId } = req.params;

  if (!rating || !comment) {
    return next(
      new ErrorHandler("Please provide both rating and comment", 400)
    );
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product.reviews.push({
    user: userId,
    name: req.user.name,
    rating,
    comment,
  });

  const totalRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  product.ratings = totalRating / product.reviews.length;

  await product.save();

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    product,
  });
});

export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const { productId, reviewId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviewIndex = product.reviews.findIndex(
    (rev) => rev._id.toString() === reviewId
  );

  if (reviewIndex === -1) {
    return next(new ErrorHandler("Review not found", 404));
  }

  if (
    product.reviews[reviewIndex].user !== req.user._id &&
    req.user.role !== "admin"
  ) {
    return next(new ErrorHandler("Not authorized to delete this review", 403));
  }

  product.reviews.splice(reviewIndex, 1);

  if (product.reviews.length > 0) {
    const totalRating = product.reviews.reduce(
      (acc, rev) => acc + rev.rating,
      0
    );
    product.ratings = totalRating / product.reviews.length;
  } else {
    product.ratings = 0;
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

export const searchProducts = catchAsyncErrors(async (req, res, next) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res
      .status(400)
      .json({ success: false, message: "enter text to serach" });
  }

  const products = await Product.find({
    name: { $regex: keyword, $options: "i" },
  });
  res.status(200).json({
    success: true,
    products,
  });
});

export const addToCart = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isProductInCart = user.cart.some(
    (item) => item.productId.toString() === id.toString()
  );

  if (isProductInCart) {
    return next(new ErrorHandler("product is alredy in cart", 400));
  }

  user.cart.push({
    productId: product._id,
    name: product.name,
    images: product.images,
    price: product.price,
    color: product.color,
    seller: product.seller,
    totalPrice: product.price,
  });
  await user.save();

  res.status(201).json({
    success: true,
    message: "Product added to cart successfully",
    user,
  });
});

export const removeFromCart = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const initialCartLength = user.cart.length;
  user.cart = user.cart.filter(
    (item) => item.productId.toString() !== id.toString()
  );

  if (user.cart.length === initialCartLength) {
    return next(new ErrorHandler("Product not found in cart", 404));
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "remove from cart successfully",
  });
});

export const getCart = catchAsyncErrors(async (req, res, next) => {
  if (!req.user || !req.user._id) {
    return next(new ErrorHandler("User authentication failed", 401));
  }

  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const products = user.cart;

  res.status(200).json({
    success: true,
    products,
  });
});

export const addToWishList = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isProductInWishList = user.wishlist.some(
    (item) => item.productId.toString() === id.toString()
  );

  if (isProductInWishList) {
    return next(new ErrorHandler("product is alredy in wishlist", 400));
  }

  user.wishlist.push({
    productId: product._id,
    name: product.name,
    images: product.images,
    price: product.price,
    seller: product.seller,
    totalPrice: product.price,
  });
  await user.save();

  res.status(201).json({
    success: true,
    message: "Product added to wishlist successfully",
    user,
  });
});

export const removeFromWishList = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const initialWishListLength = user.wishlist.length;
  user.wishlist = user.wishlist.filter(
    (item) => item.productId.toString() !== id.toString()
  );

  if (user.wishlist.length === initialWishListLength) {
    return next(new ErrorHandler("Product not found in wishlist", 404));
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "remove from wishlist successfully",
  });
});

export const getWishList = catchAsyncErrors(async (req, res, next) => {
  if (!req.user || !req.user._id) {
    return next(new ErrorHandler("User authentication failed", 401));
  }

  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const products = user.wishlist;

  res.status(200).json({
    success: true,
    products,
  });
});
