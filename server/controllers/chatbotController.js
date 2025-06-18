import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";
import { Order } from "../models/orderModel.js";
import fetch from "node-fetch";

export const chatWithGemini = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRoleFromReq = req.body.role; // optional override from frontend

    // Fetch user info excluding sensitive fields
    const userRaw = await User.findById(userId)
      .select(
        "-password -resetPasswordToken -resetPasswordTokenExpire -verificationCode -verificationCodeExpire"
      )
      .lean();

    if (!userRaw) {
      return res.status(404).json({ error: "User not found" });
    }

    const userMessage = req.body.message;
    if (!userMessage || userMessage.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Fetch recent products and orders for context
    const productsRaw = await Product.find().limit(10).lean();
    const ordersRaw = await Order.find({ "user.id": userId }).limit(5).lean();

    // Summarize user data
    const summarizeUser = (user) => ({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    });

    // Summarize product data
    const summarizeProducts = (products) =>
      products.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        price: p.price,
        discount: p.discount || 0,
        finalPrice: p.price - (p.discount || 0),
        variants: p.variants?.map((v) => ({
          size: v.size,
          color: v.color,
          stock: v.stock,
        })),
        stock: p.stock,
      }));

    // Summarize order data
    const summarizeOrders = (orders) =>
      orders.map((o) => ({
        id: o._id.toString(),
        status: o.status,
        expectedDelivery: o.expectedDeliveryDate,
        totalPrice: o.totalPrice,
        orderDate: o.orderDate,
        product: {
          id: o.product.id.toString(),
          name: o.product.name,
          images: o.product.images,
          price: o.product.price,
          quantity: o.product.quantity,
          size: o.product.size,
          category: o.product.category,
          sellerName: o.product.sellerName,
        },
      }));

    const user = summarizeUser(userRaw);
    const products = summarizeProducts(productsRaw);
    const orders = summarizeOrders(ordersRaw);

    // Determine user role: from frontend or DB fallback
    const role = userRoleFromReq || user.role || "customer";

    // Role-based instructions for assistant
    let roleInstructions = "";
    if (role === "seller") {
      roleInstructions = `
You are assisting a seller. Focus on managing products, orders, and sales data. 
Provide relevant information for sellers only. Do not provide customer-specific info unless asked.
      `;
    } else if (role === "customer") {
      roleInstructions = `
You are assisting a customer. Focus on order tracking, product info, and shopping assistance. 
Do not reveal seller-only information.
      `;
    }

    // System prompt for AI
    const systemPrompt = `
You are an expert AI assistant specialized in handling queries for an e-commerce platform. 
Answer ONLY using the provided summarized USER, PRODUCT, and ORDER data. Do not guess or assume beyond this. Avoid printing raw order IDs.

${roleInstructions}

-------------------------------
USER DATA:
${JSON.stringify(user, null, 2)}

-------------------------------
PRODUCTS DATA (Top 10):
${JSON.stringify(products, null, 2)}

-------------------------------
ORDERS DATA (Recent 5 for the user):
${JSON.stringify(orders, null, 2)}

-------------------------------
Instructions:
- Do NOT guess or make up any information.
- If the data is missing, reply: "Sorry, I don't have enough information to answer that."
- Be helpful, professional, and concise.
`;

    // Compose chat messages for the model
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ];

    // Call Groq / Gemini API
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages,
          max_tokens: 512,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return res.status(500).json({ error: "Groq API error" });
    }

    const data = await response.json();
    const assistantReply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    // Save chat messages to user chatHistory (latest 50 only)
    await User.findByIdAndUpdate(userId, {
      $push: {
        chatHistory: {
          $each: [
            {
              type: "user",
              content: userMessage,
              timestamp: new Date(),
              role, // store user role with message if needed
            },
            {
              type: "assistant",
              content: assistantReply,
              timestamp: new Date(),
            },
          ],
          $slice: -50,
        },
      },
    });

    return res.json({ answer: assistantReply });
  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch chat history only for authenticated user
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("chatHistory").lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return chat history or empty array if none
    res.json({ history: user.chatHistory || [] });
  } catch (error) {
    console.error("Chat history error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
