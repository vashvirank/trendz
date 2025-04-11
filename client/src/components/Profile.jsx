import React, { useState } from "react";
import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import SellerDashboard from "./SellerDashboard";
import Login from "../pages/Login";

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  return (
    <>
      {user?.role === "admin" ? (
        <AdminDashboard />
      ) : user?.role === "seller" ? (
        <SellerDashboard />
      ) : user?.role === "customer" ? (
        <UserDashboard />
      ) : (
        <Login />
      )}
    </>
  );
};

export default Profile;
