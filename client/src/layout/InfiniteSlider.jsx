import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMultipleProductsById } from "../store/slices/productSlice";
import { NavLink } from "react-router-dom";

const InfiniteSlider = () => {
  const dispatch = useDispatch();

  const ids = [
    "67e6e27b74ecf5e790a5b511",
    "67e6e27374ecf5e790a5b4d4",
    "67e6e27b74ecf5e790a5b51d",
    "67e6e27374ecf5e790a5b4c6",
    "67e6e27b74ecf5e790a5b4f4",
    "67e6e27b74ecf5e790a5b507",
    "67e6e27374ecf5e790a5b4b2",
    "67e6e27b74ecf5e790a5b4fc",
    "67e6e27b74ecf5e790a5b4fd",
    "67e6e27374ecf5e790a5b4cc",
    "67e6e27374ecf5e790a5b4b5",
    "67e6e27b74ecf5e790a5b4e2",
    "67e6e27b74ecf5e790a5b527",
    "67e6e27374ecf5e790a5b4cd",
  ];

  let { products } = useSelector((state) => state.product);
  useEffect(() => {
    dispatch(getMultipleProductsById(ids));
  }, [dispatch]);

  return (
    <div className="overflow-hidden w-full">
      <div className="infinite-slider flex w-max gap-x-1 md:gap-x-2">
        {products &&
          products[0]?.images &&
          [...products].map((product, index) => (
            <NavLink
              draggable="false"
              to={`/product/${product?._id}`}
              key={index}
              className="w-30 md:w-54 rounded-lg shadow-lg flex-shrink-0"
            >
              <img
                draggable="false"
                loading="lazy"
                src={product?.images[0]}
                alt={`Product ${index}`}
                className="w-full rounded-lg"
              />
            </NavLink>
          ))}
      </div>
    </div>
  );
};

export default InfiniteSlider;
