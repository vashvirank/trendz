import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";
import { cloudinaryConnect } from "./config/cloudinary.js";

const app = express();
dotenv.config({ path: ".env" });
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 6999;

app.listen(PORT, () => {
  console.log(`running at🎃 http://localhost:${PORT}`);
});

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/order", orderRouter);

app.use("/api/v1/product", productRouter);

removeUnverifiedAccounts();
connectDB();
cloudinaryConnect();

app.use(errorMiddleware);
