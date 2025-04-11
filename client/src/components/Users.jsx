import React from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

const Users = () => {
  const { users } = useSelector((state) => state.user);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = `${String(date.getDate).padStart(2, "0")}-${String(
      date.getMonth + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    const result = `${formattedDate} ${formattedTime}`;
    return result;
  };

  formatDate;

  return (
    <>
      <main className="bg-gray-800 relative flex-1 p-6 pt-28">
        uyiutiu
        <Header />
        uieyeuiyfwei
      </main>
    </>
  );
};

export default Users;
