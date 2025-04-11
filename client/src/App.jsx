import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SellerRegister from "./pages/SellerRegister";
import ForgotPassword from "./pages/ForgotPassword";
import OTP from "./pages/OTP";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./store/slices/authSlice";
import { fetchAllUsers } from "./store/slices/userSlice";
import ProductDetails from "./components/ProductDetails";
import Men from "./categories/Men";
import Women from "./categories/Women";
import Kids from "./categories/Kids";
import Beauty from "./categories/Beauty";
import Electronics from "./categories/Electronics";
import HomeFurniture from "./categories/HomeFurniture";
import Grocery from "./categories/Grocery";
import ArtCrafts from "./categories/ArtCrafts";
import Books from "./categories/Books";
import Store from "./categories/Store";
import CartBoard from "./components/CartBoard";
import MyOrders from "./components/MyOrders";
import WishList from "./components/WishList";
import ProtectedRoute from "./ProtectedRoute";
import SellerStore from "./pages/SellerStore";
import AddProduct from "./components/AddProduct";
import Orders from "./components/Orders";
import Order from "./components/Order";
import Sales from "./components/Sales";
import { ToastProvider } from "./context/ToastContext";
import SearchProducts from "./components/SearchProducts";
import SelectLocation from "./pages/SelectLocation";
import MainNavbar from "./layout/MainNavbar";
import AllProducts from "./pages/AllProducts";
import AllOrders from "./pages/AllOrders";
import AllUsers from "./pages/AllUsers";
import Dashboard from "./components/Dashboard";
import AllSales from "./pages/AllSales";

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();

  return (
    <ToastProvider>
      <Router>
        <MainNavbar />
        <Routes>
          <Route
            path="/"
            element={
              user?.role === "seller" ? (
                <SellerStore />
              ) : user?.role === "admin" ? (
                <AllProducts />
              ) : (
                <Store />
              )
            }
          />
          <Route
            path="/store"
            element={
              user?.role === "seller" || user?.role === "admin" ? (
                <SellerStore />
              ) : (
                <Store />
              )
            }
          />
          <Route
            path="/store/All"
            element={
              user?.role === "seller" || user?.role === "admin" ? (
                <SellerStore />
              ) : (
                <Store />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/seller-register" element={<SellerRegister />} />
          <Route path="/search" element={<SearchProducts />} />
          <Route path="/select-location" element={<SelectLocation />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/otp-verification/:email" element={<OTP />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route path="/profile" element={user ? <Dashboard /> : <Login />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/all-orders" element={<AllOrders />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/all-sales" element={<AllSales db={1} />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute user={user}>
                <CartBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wish-list"
            element={
              <ProtectedRoute user={user}>
                <WishList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute user={user}>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/add-order/:id" element={<Order />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/sales" element={<Sales db={1} />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/store/Men/:subCategory1?/:type1?" element={<Men />} />
          <Route
            path="/store/Women/:subCategory1?/:type1?"
            element={<Women />}
          />
          <Route path="/store/Kids/:subCategory1?/:type1?" element={<Kids />} />
          <Route
            path="/store/Beauty/:subCategory1?/:type1?"
            element={<Beauty />}
          />
          <Route
            path="/store/Electronics/:subCategory1?/:type1?"
            element={<Electronics />}
          />
          <Route
            path="/store/Home-furniture/:subCategory1?/:type1?"
            element={<HomeFurniture />}
          />
          <Route
            path="/store/Grocery/:subCategory1?/:type1?"
            element={<Grocery />}
          />
          <Route
            path="/store/Art-crafts/:subCategory1?/:type1?"
            element={<ArtCrafts />}
          />
          <Route
            path="/store/Books/:subCategory1?/:type1?"
            element={<Books />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer theme="dark" />
      </Router>
    </ToastProvider>
  );
}

export default App;
