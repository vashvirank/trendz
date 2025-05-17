# 🛍️ Trendz - online store (Full-stack Web Application)

A full-featured e-commerce platform built using the MERN Stack, styled with Tailwind CSS, and hosted on Render. Features include user authentication with JWT, RBAC(Customer, Seller, Admin), image uploads via Cloudinary, and a clean, responsive design for modern online shopping experiences.

---

## 🚀 Tech Stack

- 💻 Frontend: React.js + Tailwind CSS  
- 🔧 Backend: Node.js + Express.js  
- 🗃️ Database: MongoDB (MongoDB Atlas)  
- ☁️ Media Storage: Cloudinary  
- 🔐 Authentication: JSON Web Tokens (JWT)  
- 🌍 Hosting: Render

---

## ✨ Features

- 👤 User Authentication (Register/Login)
- 🛍️ Browse & Search Products
- 🛒 Shopping Cart
- 💳 Checkout Flow
- 🖼️ Image Upload with Cloudinary
- 🧑‍💼 Admin Dashboard (Manage/Add/Edit/Delete Products)
- 🧑‍💼 Seller Features(Add/Edit/Delete Products)
- 📱 Fully Responsive Design
- 🧾 View/Cancel Order

---

## 🛠️ Installation

### Clone the repo
git clone https://github.com/vashvirank/trendz.git<br>
cd trendz

### Install backend dependencies
cd server<br>
npm install

### Install frontend dependencies
cd ../client<br>
npm install

---

## 🔐 Environment Variables

### ● FRONTEND

Create a .env file in the client/ directory and include the following:

VITE_BASE_URL = your_backend_url<br>
VITE_PAGE_LIMIT = 40<br>
VITE_GA_MEASUREMENT_ID = your_vite_ga_measurement_id


### ● BACKEND

Create a .env file in the server/ directory and include the following:

CLOUDINARY_API_KEY = your_api_key<br>
CLOUDINARY_API_SECRET = your_api_secret<br>
CLOUDINARY_CLOUD_NAME = your_cloud_name<br>
COOKIE_EXPIRE = 3<br>
FRONTEND_URL = your_frontend_url<br>
JWT_EXPIRE = 3d<br>
JWT_SECRET_KEY = your_jwt_secret<br>
MONGO_URI = your_mongodb_connection_string<br>
PAGE_LIMIT = 40<br>
PORT = 7000<br>
SMTP_HOST = smtp_host_name<br>
SMTP_MAIL = your_smtp_mail<br>
SMTP_PASSWORD = your_smtp_password<br>
SMTP_PORT = your_smtp_port<br>
SMTP_SERVICE = gmail<br>

---

## ▶️ Live Demo

Visit: https://trendz-fashion.onrender.com

---

## 📬 Contact

Have questions or feedback? Reach out via:<br>
Email: vashvirank28@gmail.com<br>
GitHub: @vashvirank<br>
