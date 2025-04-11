import React, { useState } from "react";
import { useSelector } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from "../layout/Sidebar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import MyOrders from "../components/MyOrders";
import Orders from "../components/Orders";
import Order from "../components/Order";
import Users from "../components/Users";
import CartBoard from "../components/CartBoard";
import Slider from "../layout/Slider";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      <div className="flex min-h-screen dark:bg-gray-900 bg-gray-300">
        {/* <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center items-center bg-black">
          <GiHamburgerMenu
            className="text-2xl"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>
        {(() => {
          switch (selectedComponent) {
            case "Dashboard":
              return (
                isAuthenticated &&
                (user?.role === "user" ? <UserDashboard /> : <AdminDashboard />)
              );
            case "CartBoard":
              return <CartBoard />;
            case "Order":
              return <Order />;
            case "MyOrders":
              return <MyOrders />;
            case "Orders":
              if (user.role == "Admin") {
                return <Orders />;
              } else {
                return <p>not authorized</p>;
              }
              break;
            case "Users":
              if (user.role == "Admin") {
                return <Users />;
              } else {
                return <p>not authorized</p>;
              }
              break;
            default:
              return (
                isAuthenticated &&
                (user && user?.role === "user" ? (
                  <UserDashboard />
                ) : (
                  <AdminDashboard />
                ))
              );
          }
        })()} */}
        <Slider />
      </div>
    </>
  );
};

export default Home;
