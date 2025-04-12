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
    <div className="relative overflow-hidden m-0 md:m-5 py-2 -mb-8">
      {/* Inline animation with responsive speed */}
      <style>
        {`
          @keyframes scroll-slow {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-fast {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .scrolling-desktop {
            animation: scroll-slow 25s linear infinite;
          }

          .scrolling-mobile {
            animation: scroll-fast 20s linear infinite;
          }

          .group:hover .scrolling-desktop,
          .group:hover .scrolling-mobile {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="group">
        {/* Desktop */}
        <div className="hidden sm:flex gap-3 w-max scrolling-desktop">
          {products &&
            products[0]?.images &&
            [...products, ...products].map((product, index) => (
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
                  className="w-full opcaity-90 hover:opacity-100 hover:scale-105 hover:brightness-110 hover:contrast-125 transition-transform duration-200 rounded-lg"
                />
              </NavLink>
            ))}
        </div>

        {/* Mobile */}
        <div className="flex sm:hidden w-max scrolling-mobile">
          {products &&
            products[0]?.images &&
            [...products, ...products].map((product, index) => (
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
    </div>
  );
};

export default InfiniteSlider;
