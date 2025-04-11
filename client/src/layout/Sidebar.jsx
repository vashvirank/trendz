import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import {
  toggleSettingPopup,
  toggleaddOrderPopup,
} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();
  // const { toggleSettingPopup, toggleaddOrderPopup } = useSelector(
  //   (state) => state.popup
  // );
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <aside
        className={`${
          isSidebarOpen ? "left-0" : "-left-full"
        } z-10 md:relative md:left-0 flex flex-col h-full w-64 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300`}
        style={{ position: "fixed" }}
      >
        <div className="px-6 py-4 my-8 flex items-end gap-1">
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-gray-400"> ({user?.role})</p>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          <button
            className="w-full py-2 font-medium rounded:md hover:cursor-pointer flex items-center space-x-2"
            onClick={() => setSelectedComponent("Dashboard")}
          >
            <span>⊞</span>
            <span>Dashboard</span>
          </button>
          <button
            className="w-full py-2 font-medium rounded:md hover:cursor-pointer flex items-center space-x-2"
            onClick={() => setSelectedComponent("CartBoard")}
          >
            <span>🛍️</span>
            <span>CartBoard</span>
          </button>
          {isAuthenticated && user.role == "admin" && (
            <>
              <button
                className="w-full py-2 font-medium rounded:md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => dispatch(toggleaddOrderPopup)}
              >
                <span>🛒</span>
                <span>Order</span>
              </button>
              <button
                className="w-full py-2 font-medium rounded:md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => setSelectedComponent("MyOrders")}
              >
                <span>🛒</span>
                <span>MyOrders</span>
              </button>
            </>
          )}
          {isAuthenticated && user.role == "admin" && (
            <>
              <button
                className="w-full py-2 font-medium rounded:md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => setSelectedComponent("Orders")}
              >
                <span>🛒</span>
                <span>Orders</span>
              </button>
              <button
                className="w-full py-2 font-medium rounded:md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => setSelectedComponent("Users")}
              >
                <span>👥</span>
                <span>Users</span>
              </button>
            </>
          )}
          <button
            className="w-full py-2 font-medium rounded:md hover:cursor-pointer flex items-center space-x-2"
            onClick={() => dispatch(toggleSettingPopup())}
          >
            <span>⚙️</span>
            <span>Update Credentials</span>
          </button>
          {!user && (
            <>
              <NavLink
                draggable="false"
                to="/login"
                className="w-full py-0.5 rounded-md hover:cursor-pointer flex items-center justify-center bg-sky-500/10 border border-sky-500/10 text-sky-500 space-x-2 hover:bg-sky-500/15"
              >
                Login
              </NavLink>
              <NavLink
                draggable="false"
                to="/register"
                className="w-full py-0.5 rounded-md hover:cursor-pointer flex items-center justify-center border border-sky-500/20 text-sky-500 space-x-2 hover:bg-sky-500/15"
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
        {user && (
          <div className="px-6 py-4">
            <button
              onClick={handleLogout}
              className="py-2 font-medium text-center flex justify-center items-center space-x-5 mx-auto w-fit"
            >
              <span>↩</span>
              <span>Logout</span>
            </button>
          </div>
        )}
        <span
          onClick={() => setIsSidebarOpen(false)}
          className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden cursor-pointer"
        >
          ✖
        </span>
      </aside>
    </>
  );
};

export default Sidebar;
