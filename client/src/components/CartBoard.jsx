import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  resetProductSlice,
  removeFromCart,
} from "../store/slices/productSlice.js";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Trash2,
  Package,
  CircleDollarSign,
  Headphones,
  Plus,
  Minus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const CartBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, message } = useSelector(
    (state) => state.product
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch, message]);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleProceedToCheckout = () => {
    navigate(`/add-order/${products[0]?.productId}`);
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

  const [quantity, setQuantity] = useState(1);
  const incrementquantity = () => {
    setQuantity(quantity + 1);
  };
  const decrementquantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const items = products?.length || 0;
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState(0);
  const taxes = 3;

  const subTotal = useMemo(() => {
    return products?.reduce(
      (acc, product) => acc + product.quantity * product.price,
      0
    );
  }, [products]);

  const shipping = useMemo(() => items * 5, [items]);

  const total = useMemo(() => {
    const result = subTotal + shipping + taxes - discount;
    return parseFloat(result.toFixed(2));
  }, [subTotal, shipping, taxes, discount]);

  const handleCouponCodeChange = (e) => {
    setCouponCode(e.target.value);
  };
  const handleApplyCouponCode = () => {
    if (couponCode != 75 && couponCode != 50) {
      toast.warning(`${couponCode} is not valid coupon code`);
    } else {
      let off = couponCode == 75 ? (total > 80 ? 75 : total) : total / 2;
      off = parseFloat(off.toFixed(2));
      setDiscount(off);
      toast.success(`coupon code ${couponCode} applied`);
    }
  };

  return (
    <>
      <div className="font-sans text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900">
        {/* Top Info Bar */}
        {!user && (
          <div className="bg-blue-900 text-white text-sm text-center py-2">
            <p>
              Hello! | Sign up and GET 25% OFF for your first order.{" "}
              <NavLink
                draggable="false"
                to="/register"
                className="underline cursor-pointer"
              >
                Sign up now
              </NavLink>
            </p>
          </div>
        )}

        {/* Page Title */}
        <section className="py-10 text-center">
          <h2 className="text-3xl font-bold">Shopping Cart</h2>
          <p className="text-sm text-gray-500">Home / Shopping Cart</p>
        </section>

        <main className="px-1 md:px-4 flex flex-col lg:flex-row gap-8 mb-16">
          <>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {products && products?.length !== 0 ? (
                  <div className="w-full flex flex-col md:flex-row gap-8 md:gap-4">
                    <div className="w-full">
                      <table className="w-full text-left border border-black-10 dark:border-white/10">
                        <thead>
                          <tr className="bg-blue-900 text-gray-300 text-xs font-semibold md:text-base">
                            <th className="px-1 md:px-2 lg:px-4 py-2 "></th>
                            <th className="px-1 md:px-2 lg:px-4 py-2">
                              Product
                            </th>
                            <th className="px-1 md:px-2 lg:px-4 py-2 w-10 md:w-31">
                              Date Added
                            </th>
                            <th className="px-1 md:px-2 lg:px-4 py-2">Price</th>
                            <th className="px-1 md:px-2 lg:px-4 py-2">
                              Quantity
                            </th>
                            <th className="px-1 md:px-2 lg:px-4 py-2">
                              Subtotal
                            </th>
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
                                    handleRemoveFromCart(item.productId)
                                  }
                                  className="pl-2 md:pl-3 text-red-500"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </td>
                              <td className="px-2 py-3 flex items-center gap-2">
                                <img
                                  draggable="false"
                                  src={item?.images[0]}
                                  className="h-14 md:h-18 rounded"
                                />
                                <div>
                                  <p className="font-semibold">{item?.name}</p>
                                  <span className="flex items-center gap-1.5">
                                    <p className="text-gray-500 text-xs">
                                      Color: {item?.color}
                                    </p>
                                    <div
                                      className="h-3 w-3 rounded-full"
                                      style={{ backgroundColor: item?.color }}
                                    ></div>
                                  </span>
                                </div>
                              </td>
                              <td className="text-xs lg:text-base px-1 md:px-2 lg:px-4 py-3">
                                {formattedDate(item?.date)}
                              </td>
                              <td className="text-xs md:text-base px-1 md:px-2 lg:px-4 py-3">
                                {item?.price}
                              </td>
                              <td className="text-xs md:text-base">
                                <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-2">
                                  <button
                                    onClick={decrementquantity}
                                    className="h-4 md:h-7 w-7 bg-gray-500/20 rounded flex justify-center items-center"
                                  >
                                    <Minus
                                      size={18}
                                      className="hidden md:flex"
                                    />
                                    <ChevronDown
                                      size={18}
                                      className="md:hidden"
                                    />
                                  </button>
                                  <span>{quantity}</span>
                                  <button
                                    onClick={incrementquantity}
                                    className="h-4 md:h-7 w-7 bg-gray-500/20 rounded flex justify-center items-center"
                                  >
                                    <Plus
                                      size={18}
                                      className="hidden md:flex"
                                    />
                                    <ChevronUp
                                      size={18}
                                      className="md:hidden"
                                    />
                                  </button>
                                </div>
                              </td>
                              <td className="text-xs lg:text-base px-1 md:px-2 lg:px-4 py-3">
                                ${item?.price * item?.quantity}.00
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Coupon */}
                      <div className="flex gap-4 items-center mt-4">
                        <input
                          type="number"
                          onChange={handleCouponCodeChange}
                          placeholder="Coupon Code"
                          className="w-full border border-blue-500/30 rounded px-4 py-2"
                        />
                        <button
                          onClick={handleApplyCouponCode}
                          className="w-60 border border-blue-500/20 bg-blue-500/15 text-blue-500 hover:bg-blue-500/20 py-2 rounded"
                        >
                          Apply Coupon
                        </button>
                      </div>
                    </div>

                    {/* Right: Summary */}
                    <aside className="w-full md:w-70 lg:w-100 bg-blue-900/15 p-6 border border-black/10 dark:border-white/5 rounded space-y-4">
                      <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Items:</span>
                          <span>{items}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sub Total:</span>
                          <span>${subTotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>${shipping}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxes:</span>
                          <span>${taxes}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>Coupon Discount:</span>
                          <span>−${discount}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>${total}</span>
                        </div>
                      </div>
                      <button
                        onClick={handleProceedToCheckout}
                        className="bg-blue-800 w-full text-white py-3 rounded mt-4"
                      >
                        Proceed to Checkout
                      </button>
                    </aside>
                  </div>
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
                      <p className="text-lg">your cart is empty....</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        </main>

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

export default CartBoard;
