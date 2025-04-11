import React, { useEffect, useState } from "react";
import {
  addToCart,
  addToWishList,
  getWishList,
  resetProductSlice,
  removeFromWishList,
} from "../store/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [isInWishlist, setIsInWishlist] = useState(false);
  const dispatch = useDispatch();

  const { products, loading, error, message } = useSelector(
    (state) => state.product
  );

  const handleAddToCart = () => {
    if (!user) {
      toast.warning("please register to add into cart");
      return;
    }
    dispatch(addToCart(product._id));
  };

  const handleWishListClick = () => {
    if (!user) {
      toast.warning("please register to add into wishlist");
      return;
    }
    const newValue = !isInWishlist;
    setIsInWishlist(newValue);
    if (newValue) {
      dispatch(addToWishList(product._id));
    } else {
      dispatch(removeFromWishList(product._id));
    }
  };

  if (user?.role === "customer") {
    useEffect(() => {
      dispatch(getWishList());
    }, [dispatch]);
  }

  useEffect(() => {
    const found = products.some((item) => item.productId === product._id);
    setIsInWishlist(found);
  }, [products, product._id]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetProductSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetProductSlice());
    }
  }, [dispatch, message, error]);

  return (
    <div className="relative max-w-sm w-full rounded-xl overflow-hidden border border-black/5 dark:border-white/10 hover:shadow-lg transition-shadow duration-300 group">
      {/* Heart Button */}
      {user?.role !== "admin" && user?.role !== "seller" && (
        <button
          onClick={handleWishListClick}
          className="absolute top-2 right-2 z-10 p-1 rounded-full hover:scale-110 transition-transform duration-200"
        >
          {isInWishlist ? (
            <svg width="22" height="22" fill="white" className="text-rose-500">
              <use xlinkHref="/icons.svg#fill-heart-icon"></use>
            </svg>
          ) : (
            <svg width="22" height="22" fill="white" className="text-rose-500">
              <use xlinkHref="/icons.svg#heart-icon"></use>
            </svg>
          )}
        </button>
      )}

      <a
        draggable={false}
        href={`/product/${product?._id}`}
        key={product?._id}
        rel="noopener noreferrer"
      >
        {/* Product Image */}
        {product?.images && (
          <div className="overflow-hidden">
            <img
              draggable="false"
              loading="lazy"
              src={product?.images[0] || "/images/shoes.jpg"}
              alt={product?.name}
              className="w-full aspect-square object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Product Info */}
        <div className="p-4 space-y-1">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
            {product?.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            Brand: {product?.brand}
          </p>

          <div className="flex items-center justify-between mt-1">
            <div className="text-green-600 font-semibold text-sm">
              ${product?.finalPrice}
              <span className="ml-2 line-through text-gray-400 text-xs">
                ${product?.price}
              </span>
            </div>
            <span className="text-red-500 text-xs font-semibold">
              {product?.discount}% OFF
            </span>
          </div>

          <div className="text-yellow-500 text-sm">{product?.ratings} ★</div>
        </div>
      </a>

      {/* Add to Cart Button */}
      {user?.role !== "admin" && user?.role !== "seller" && (
        <div className="p-4 pt-0">
          <button
            onClick={handleAddToCart}
            className="w-full bg-green-500/10 text-green-600 border border-green-500/20 
        hover:bg-green-500/20 transition px-3 py-1.5 rounded-md text-sm"
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
