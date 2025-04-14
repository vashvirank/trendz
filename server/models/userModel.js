import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      // required: true,
    },
    orders: [
      {
        order_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
        zip: {
          type: String,
          required: true,
        },
        product: {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          images: [{ type: String }],
          price: {
            type: Number,
            required: true,
          },
          seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          sellerName: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          size: {
            type: String,
            required: true,
          },
        },
        totalPrice: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: [
            "pending",
            "processing",
            "shipped",
            "out for delivery",
            "delivered",
            "cancelled",
          ],
          default: "pending",
        },
        orderDate: {
          type: Date,
          default: Date.now,
        },
        expectedDeliveryDate: {
          type: Date,
        },
      },
    ],
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: {
          type: String,
        },
        images: [{ type: String }],
        price: {
          type: Number,
          required: true,
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        totalPrice: {
          type: Number,
        },
      },
    ],
    wishlist: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        name: {
          type: String,
          required: true,
        },
        images: [{ type: String }],
        price: {
          type: Number,
          required: true,
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        totalPrice: {
          type: Number,
        },
      },
    ],
    avatar: {
      public_id: String,
      url: String,
      // default: "default.jpg",
    },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
  },
  { timestamps: true }
);

userSchema.methods.generateVerificationCode = function () {
  function generateRandomFiveDegitNumber() {
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const remainingDigits = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, 0);
    return parseInt(firstDigit + remainingDigits);
  }
  const verificationCode = generateRandomFiveDegitNumber();
  this.verificationCode = verificationCode;
  this.verificationCodeExpire = new Date(Date.now() + 10 * 60 * 1000);
  return verificationCode;
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordTokenExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model("User", userSchema);
