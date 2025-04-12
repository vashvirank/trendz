import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Schema for product specifications (e.g., Material, Weight, etc.)
const SpecificationSchema = new mongoose.Schema({
  key: { type: String, required: true }, // Example: "Material"
  value: { type: String, required: true }, // Example: "Cotton"
});

// Main Product Schema
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },

    category: {
      type: String,
      required: true,
      enum: [
        "Men",
        "Women",
        "Kids",
        "Beauty",
        "Electronics",
        "Home-furniture",
        "Grocery",
        "Art-crafts",
        "Books",
      ],
    },

    subCategory: {
      type: String,
      required: true,
    },

    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number },
    offers: [{ type: String }],

    images: [{ type: String }],
    color: { type: String },

    variants: [
      {
        size: { type: String },
        color: { type: String },
        material: { type: String },
        stock: { type: Number, default: 0 },
      },
    ],

    stock: { type: Number, default: 0 },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    isBestSeller: { type: Boolean, default: false },

    ratings: { type: Number, default: 0 },
    reviews: [ReviewSchema],
    questionsAndAnswers: [
      {
        question: { type: String, required: true },
        answer: { type: String },
      },
    ],

    specifications: [SpecificationSchema],

    deliveryOptions: {
      isCOD: { type: Boolean, default: false },
      estimatedDelivery: { type: String },
    },
    available: { type: Boolean, default: false },
    returnPolicy: {
      returnable: { type: Boolean, default: false },
      returnDays: { type: Number, default: 0 },
      warranty: { type: String },
    },
  },
  { timestamps: true }
);

ProductSchema.pre("save", function (next) {
  this.finalPrice = this.price - (this.price * this.discount) / 100;

  if (this.variants && this.variants.length > 0) {
    const totalStock = this.variants.reduce(
      (sum, variant) => sum + (variant.stock || 0),
      0
    );
    this.stock = totalStock;
    this.available = this.stock > 0 ? true : false;
  }

  next();
});

export const Product = mongoose.model("Product", ProductSchema);
