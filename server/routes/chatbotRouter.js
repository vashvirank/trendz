import express from "express";
import { chatWithGemini } from "../controllers/chatbotController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js"; // Adjust path if needed
import { getChatHistory } from "../controllers/chatbotController.js"; // Adjust path if needed
const router = express.Router();

router.post("/ask", isAuthenticated, chatWithGemini);
router.get("/history", isAuthenticated, getChatHistory);
export default router;
