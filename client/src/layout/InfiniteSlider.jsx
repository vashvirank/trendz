import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMultipleProductsById } from "../store/slices/productSlice";
import { NavLink } from "react-router-dom";

const InfiniteSlider = () => {
  const dispatch = useDispatch();

  const ids = [
    "67e8fd587090e3ff6167d24a",
    "67e8fd587090e3ff6167d250",
    "67e6e24274ecf5e790a5b419",
    "67e6e23c74ecf5e790a5b415",
    "67e6e1b474ecf5e790a5b3de",
    "67e6e28274ecf5e790a5b567",
    "67e6e28274ecf5e790a5b54a",
    "67e6e2c874ecf5e790a5b5e7",
    "67e6e2c874ecf5e790a5b5d0",
    "67e6e2c874ecf5e790a5b5ca",
    "67e6e2c874ecf5e790a5b5cc",
    "67e6e2c874ecf5e790a5b5c3",
    "67e8fe367090e3ff6167d300",
    "67e8fe367090e3ff6167d2f3",
  ];

  let { products } = useSelector((state) => state.product);
  useEffect(() => {
    dispatch(getMultipleProductsById(ids));
  }, [dispatch]);

  return (
    <div className="relative overflow-hidden m-0 md:m-3 py-2 -mb-8">
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
        <div className="flex sm:hidden gap-2 mb-10 w-max scrolling-mobile">
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
