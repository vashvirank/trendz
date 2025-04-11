import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setItem } from "../store/slices/categorySlice";
import { NavLink } from "react-router-dom";

const SellerNavbar = () => {
  const items = ["Home", "Add Product", "Orders", "Sales"];
  const paths = {
    Home: "/",
    "Add Product": "/add-product",
    Orders: "/orders",
    Sales: "/sales",
  };

  const dispatch = useDispatch();

  const selectedItem = useSelector((state) => state.category.selectedItem);

  const handleCategoryChange = (item) => {
    dispatch(setItem(item));
  };

  return (
    <>
      <nav
        className="
            bg-gradient-to-b from-blue-100 to-blue-200 text-gray-700
            dark:bg-gradient-to-r dark:from-gray-900 dark:to-sky-950 dark:text-gray-300"
      >
        <ul className="flex gap-5">
          {items.map((item, index) => (
            <NavLink
              draggable="false"
              to={paths[item]}
              key={index}
              onClick={() => handleCategoryChange(item)}
              className={`${
                selectedItem === item
                  ? "bg-blue-500/10 text-gray-700 dark:text-gray-200 border-b-blue-500"
                  : "text-gray-600 dark:text-gray-400"
              } px-2 py-1 rounded-b border-b-2 border-transparent`}
            >
              {item}
            </NavLink>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default SellerNavbar;
