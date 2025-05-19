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
import { ShoppingCart, Star } from "lucide-react";

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
    <div className="relative rounded-xl overflow-hidden border border-black/5 dark:border-white/10 hover:shadow-lg transition-shadow duration-300 group">
      {/* Heart Button */}
      {user?.role !== "admin" && user?.role !== "seller" && (
        <button
          onClick={handleWishListClick}
          className="absolute top-2 right-2 z-5 p-1 rounded-full hover:scale-110 transition-transform duration-200"
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
          <div className="overflow-hidden relative">
            <img
              draggable="false"
              loading="lazy"
              src={product?.images[0] || "/images/bag-logo.png"}
              alt={product?.name}
              className={`${
                product?.images[0] ? "" : "grayscale opacity-50"
              } w-full aspect-square object-cover transform group-hover:scale-105 transition-transform duration-300`}
            />
            <span className="absolute top-1 left-1 tracking-tighter rounded-tl-lg rounded-br-lg backdrop-blur-[1px] text-xs px-1 bg-rose-500/80 text-white">
              {product?.discount}% OFF
            </span>
          </div>
        )}

        {/* Product Info */}
        <div className="pt-2 px-3 dark:bg-gray-500/10">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              Brand: {product?.brand}
            </p>
            <div className="text-yellow-400 text-xs flex items-center gap-1">
              {product?.ratings?.toFixed(1)}{" "}
              <Star size={14} strokeWidth={0.5} className="fill-yellow-400" />
            </div>
          </div>
          <h2 className="text-lg font-semibold  text-gray-800 dark:text-gray-200 truncate">
            {product?.name}
          </h2>
        </div>
      </a>
      <div className="flex items-center justify-between pb-2 px-3 dark:bg-gray-500/10">
        <div className="text-blue-500/80 font-semibold">
          ${product?.finalPrice}
          <span className="ml-2 font-normal line-through text-gray-400 text-xs">
            ${product?.price}
          </span>
        </div>
        {/* Add to Cart Button */}
        {user?.role !== "admin" && user?.role !== "seller" && (
          <button
            onClick={handleAddToCart}
            className="hover:scale-95 transition bg-green-500/10 p-2 text-green-500/70 hover:bg-green-500/20  rounded text-sm"
          >
            <ShoppingCart size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
