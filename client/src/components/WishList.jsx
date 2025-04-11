import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getWishList,
  resetProductSlice,
  removeFromWishList,
  addToCart,
} from "../store/slices/productSlice.js";
import { Trash2, Package, CircleDollarSign, Headphones } from "lucide-react";

const WishList = () => {
  const dispatch = useDispatch();
  const { products, loading, error, message } = useSelector(
    (state) => state.product
  );
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getWishList());
  }, [dispatch, message]);

  const handleRemoveFromWishList = (productId) => {
    dispatch(removeFromWishList(productId));
  };

  const handleAddToCart = async (id) => {
    await dispatch(addToCart(id));
    await dispatch(removeFromWishList(id));
  };

  const handleAddAllToCart = async () => {
    const products1 = products;
    for (const product of products1) {
      await dispatch(addToCart(product.productId));
      await dispatch(removeFromWishList(product.productId));
    }
  };

  const handleClearWishlist = async () => {
    const products1 = products;
    for (const product of products1) {
      await dispatch(removeFromWishList(product.productId));
    }
  };

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

  const formattedDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 min-h-screen">
        {/* Top Header */}
        {!user && (
          <div className="bg-blue-900 text-gray-300 text-center py-2 text-sm font-medium">
            Sign up and GET 25% OFF for your first order:{" "}
            <a draggable="false" href="#" className="underline">
              Sign up now
            </a>
          </div>
        )}

        <div className="container mx-auto px-1 md:px-3 py-10">
          <h2 className="text-2xl font-semibold mb-4 text-center">Wishlist</h2>

          <div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {products && products?.length !== 0 ? (
                  <table className="w-full text-left border border-black-10 dark:border-white/10">
                    <thead>
                      <tr className="bg-blue-900 text-gray-300 text-xs md:text-base">
                        <th className="px-2 md:px-4 py-2 "></th>
                        <th className="px-2 md:px-4 py-2">Product</th>
                        <th className="px-2 md:px-4 py-2">Price</th>
                        <th className="px-2 md:px-4 py-2 w-10 md:w-31">
                          Date Added
                        </th>
                        <th className="px-2 md:px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {products?.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-b-black/20 dark:border-b-white/20"
                        >
                          <td>
                            <button
                              onClick={() =>
                                handleRemoveFromWishList(item.productId)
                              }
                              className="pl-2 md:pl-4 ld:pl-6 text-red-500"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                          <td className="px-2 py-3 flex items-center gap-2">
                            <img
                              draggable="false"
                              src={item?.images[0]}
                              className="h-18 rounded"
                            />
                            <p>
                              <span>{item?.name}</span>
                              <span className="text-sm text-gray-500">
                                {item?.weight}
                              </span>
                            </p>
                          </td>
                          <td className="text-xs md:text-base px-2 md:px-4 py-3">
                            {item?.price}
                          </td>
                          <td className="text-xs md:text-base px-2 md:px-4 py-3">
                            {formattedDate(item?.date)}
                          </td>
                          <td className="text-xs md:text-base px-1 md:px-4 md:py-3">
                            <button
                              onClick={() => handleAddToCart(item.productId)}
                              className="bg-blue-500/20 text-blue-500 px-2 py-0.5 md:px-4 md:py-1 rounded"
                            >
                              Add to Cart
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="w-[100%] min-h-[70vh] m-1 p-10 border border-white/10 rounded flex flex-col md:flex-row items-center justify-center">
                    <img
                      draggable="false"
                      loading="lazy"
                      src="/not-found.svg"
                      width="250"
                      height="250"
                      alt="Icon"
                    />
                    <div className="w-[100%] md:w-[40%] text-center">
                      <p className="text-red-500 font-semibold text-5xl m-2">
                        OOPS!
                      </p>
                      <p className="text-lg">your wishlist is empty....</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Wishlist actions */}
          {products?.length > 0 && (
            <div className="mt-6 flex gap-4 justify-center items-center">
              <button
                onClick={handleClearWishlist}
                className="bg-red-500/15 text-red-500/90 hover:bg-red-500/15 px-4 py-2 rounded-full"
              >
                Clear Wishlist
              </button>
              <button
                onClick={handleAddAllToCart}
                className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/15 px-4 py-2 rounded"
              >
                Add All to Cart
              </button>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="py-3 md:py-10 border-t border-t-black-10 dark:border-t-white/10">
          <div className="container mx-auto px-4 flex flex-col gap-6 md:gap-0 md:flex-row justify-between text-center text-sm">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
              <Package
                strokeWidth={1.5}
                size="40"
                className="text-blue-500/90 bg-blue-500/20 p-1 rounded-lg"
              />
              <div className="text-center md:text-left">
                <div className="font-semibold">Free Shipping</div>
                <p>Free shipping for order above $50</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
              <CircleDollarSign
                strokeWidth={1.5}
                size="40"
                className="text-blue-500/90 bg-blue-500/20 p-1 rounded-lg"
              />
              <div className="text-center md:text-left">
                <div className="font-semibold">Flexible Payment</div>
                <p>Multiple secure payment options</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
              <Headphones
                strokeWidth={1.5}
                size="40"
                className="text-blue-500/90 bg-blue-500/20 p-1 rounded-lg"
              />
              <div className="text-center md:text-left">
                <div className="font-semibold">24×7 Support</div>
                <p>We support online all days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gray-800/30 py-10 px-5 md:px-3">
          <div className="text-center">
            <h3 className="text-xl font-semibold">
              Subscribe to Our Newsletter to Get{" "}
              <span className="text-green-500">
                Updates on Our Latest Offers
              </span>
            </h3>
            <p className="mt-2">
              Get 25% off on your first order just by subscribing to our
              newsletter
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <input
                type="email"
                placeholder="Enter Email Address"
                className="px-4 py-2 border rounded w-64"
              />
              <button className="bg-blue-900 px-6 py-2 rounded">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WishList;
