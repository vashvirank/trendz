import React, { useEffect, useState } from "react";
import { addOrder, resetOrderSlice } from "../store/slices/orderSlice";
import { getProductById } from "../store/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Order = () => {
  const dispatch = useDispatch();
  const { error: error1, message: message1 } = useSelector(
    (state) => state.order
  );
  let { product } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);

  const { id } = useParams();
  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (message1) {
      toast.success(message1);
      dispatch(resetOrderSlice());
    }
    if (error1) {
      toast.error(error1);
      dispatch(resetOrderSlice());
    }
  }, [message1, error1, dispatch]);

  const [step, setStep] = useState(1);
  const [quantity, setQuantity] = useState(0);
  const [formData, setFormData] = useState({
    name: "minesh",
    email: "minesh@uxdwe.wdxwdx",
    phone: "1234567890",
    address: "ecd",
    zip: "123456",
    country: "india",
    city: "anand",
    quantity: 1,
    size: "None",
  });
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const validateStep = () => {
    const { name, email, phone, city, address, zip, country, size } = formData;
    if (step === 1) {
      if (size === "None") {
        toast.warning("please select valid size");
      } else if (quantity <= 0) {
        toast.warning("please select quantity more than 0");
      }
      return size !== "None" && quantity > 0;
    }
    if (step === 2) {
      if (name === "") {
        toast.warning("please enter name");
      } else if (email === "") {
        toast.warning("please enter email");
      } else if (phone === "") {
        toast.warning("please enter phone");
      } else if (address === "") {
        toast.warning("please enter address");
      } else if (city === "") {
        toast.warning("please enter city");
      } else if (country === "") {
        toast.warning("please enter country");
      } else if (zip === "") {
        toast.warning("please enter zip");
      }
      return name && email && phone && city && address && zip && country;
    }
    if (step === 3) {
      return selectedShipping;
    }
    // if (step === 4)
    //   return deliveryOptions.isCOD && deliveryOptions.estimatedDelivery;
    return false;
  };

  const nextStep = () => {
    if (validateStep() && step < 4) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [couponCode, setCouponCode] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    formData.quantity = Number(quantity);
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    dispatch(addOrder({ id: product._id, data: formData }));
    if (message1) {
      setIsSubmitting(false);
      setIsComplete(true);
    } else {
      setIsSubmitting(false);
    }
  };

  const allSizes = [
    "XXS",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "2XL",
    "3XL",
    "4XL",
    "5XL",
    "6XL",
  ];

  const availableSizesWithStock = allSizes
    .map((size) => {
      const variant = product?.variants?.find((v) => v.size === size);
      if (variant) {
        return { size, stock: variant.stock };
      }
      return null;
    })
    .filter(Boolean);

  const productPrice = product?.price;
  const shippingCost = selectedShipping === "express" ? 12.99 : 4.99;
  const totalPrice = productPrice * quantity + shippingCost;

  return (
    <>
      <div className="min-h-screen p-4 md:p-4 bg-sky-50 dark:bg-gray-950 text-gray-600 dark:text-gray-300">
        <div className="max-w-4xl mx-auto">
          {!isComplete ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
              {/* Progress bar */}
              <div
                className="h-2 bg-gradient-to-r 
              from-blue-500/10 to-green-500/10"
              >
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 ease-out"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>

              {/* Header */}
              <div
                className="p-4 text-white bg-gradient-to-r 
              from-blue-500/10 to-green-500/10"
              >
                <h1 className="text-2xl md:text-3xl font-semibold dark:font-normal tracking-tight">
                  Complete Your Order
                </h1>
                <div className="flex mt-3 space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                        i === step
                          ? "border-blue-500 bg-blue-500/10 text-blue-500 scale-110"
                          : i < step
                          ? "border-green-500/10 bg-green-500/10 text-green-500"
                          : "border-blue-500/20 text-blue-500/70"
                      }`}
                    >
                      {i < step ? <CheckCircle className="w-5 h-5" /> : i}
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-4">
                {/* Step 1: Product Selection */}
                <div
                  className={`transition-all duration-500 ${
                    step === 1
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full absolute"
                  }`}
                >
                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold dark:font-normal flex items-center">
                        <ShoppingBag className="mr-2 text-blue-500" />
                        Product Information
                      </h2>

                      <div
                        className="bg-gradient-to-r rounded-xl p-2 transition-all duration-300 hover:-translate-y-1
                      from-blue-500/10 to-sky-500/10"
                      >
                        <div className="flex items-center">
                          <div className="w-28 h-28 bg-white rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
                            <img
                              draggable="false"
                              loading="lazy"
                              src={product?.images[0]}
                              alt={product?.name}
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="font-medium dark:text-gray-300dark:text-gray-300">
                              {product?.name}
                            </h3>
                            <p className="text-green-500 font-bold">
                              ${product?.price?.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {product?.description
                                ?.split(" ")
                                .slice(0, 30)
                                .join(" ") + "..."}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-5">
                        <div className="flex items-center gap-1 border p-0.5 rounded border-black/10 dark:border-white/10">
                          <p className="py-1 px-3">Size</p>
                          <select
                            name="size"
                            value={formData.size}
                            onChange={handleInputChange}
                            className="bg-gray-800 p-1 rounded"
                          >
                            <option value="None">-</option>
                            {availableSizesWithStock?.map((variant, ind) => (
                              <option key={ind} value={variant.size}>
                                {variant.size}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-1 border p-0.5 rounded border-black/10 dark:border-white/10">
                          <p className="bg-gray-800 py-1 px-3 rounded">
                            Quantity
                          </p>
                          <div className="flex items-center overflow-hidden">
                            <button
                              type="button"
                              onClick={decrementQuantity}
                              className="p-1 hover:bg-black/5 dark:hover:bg-white/10 "
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <span className="py-1 px-3 font-medium ">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={incrementQuantity}
                              className="p-1 hover:bg-black/5 dark:hover:bg-white/10 "
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-500/10 animate-pulse duration-200 rounded-lg p-4 border border-emerald-500/10">
                        <p className="text-emerald-500 text-sm">
                          🎉 Special offer: Free 2-year warranty included!
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Customer Information */}
                <div
                  className={`transition-all duration-500 ${
                    step === 2
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full absolute"
                  }`}
                >
                  {step === 2 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold dark:font-normal flex items-center">
                        <MapPin className="mr-2 text-blue-500" />
                        Your Information
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium ">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            // value={user?.name || formData.name}
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-black/15 dark:border-white/15 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            placeholder="John Doe"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium ">
                            Mobile Number
                          </label>
                          <input
                            type="number"
                            minLength={10}
                            maxLength={10}
                            name="phone"
                            // value={user?.phone || formData.phone}
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-black/15 dark:border-white/15 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            placeholder="john@example.com"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="block text-sm font-medium ">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            // value={user?.email || formData.email}
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-black/15 dark:border-white/15 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            placeholder="john@example.com"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="block text-sm font-medium ">
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-black/15 dark:border-white/15 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            placeholder="123 Main St"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium ">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-black/15 dark:border-white/15 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            placeholder="New York"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium ">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="zip"
                            value={formData.zip}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-black/15 dark:border-white/15 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            placeholder="10001"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 3: Shipping Options */}
                <div
                  className={`transition-all duration-500 ${
                    step === 3
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full absolute"
                  }`}
                >
                  {step === 3 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold dark:font-normal flex items-center">
                        <Truck className="mr-2 text-blue-500" />
                        Shipping Options
                      </h2>

                      <div className="space-y-3">
                        <div
                          className={`border border-black/15 dark:border-white/15 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                            selectedShipping === "standard"
                              ? "border-blue-500 dark:border-blue-500 bg-blue-500/10 shadow-sm"
                              : "hover:border-blue-500/10"
                          }`}
                          onClick={() => setSelectedShipping("standard")}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                                selectedShipping === "standard"
                                  ? "border-blue-500"
                                  : "border-black/15 dark:border-white/15"
                              }`}
                            >
                              {selectedShipping === "standard" && (
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium ">
                                Standard Shipping
                              </h3>
                              <p className="text-sm text-gray-500">
                                Delivery in 5-7 business days
                              </p>
                            </div>
                            <div className="font-medium">$4.99</div>
                          </div>
                        </div>

                        <div
                          className={`border border-black/15 dark:border-white/15 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                            selectedShipping === "express"
                              ? "border-blue-500 bg-blue-500/10 shadow-sm"
                              : "hover:border-blue-500/10"
                          }`}
                          onClick={() => setSelectedShipping("express")}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                                selectedShipping === "express"
                                  ? "border-blue-500"
                                  : "border-black/15 dark:border-white/15"
                              }`}
                            >
                              {selectedShipping === "express" && (
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium ">Express Shipping</h3>
                              <p className="text-sm text-gray-500">
                                Delivery in 1-2 business days
                              </p>
                            </div>
                            <div className="font-medium">$12.99</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 items-center mt-4 rounded-xl p-3 border border-black/15 dark:border-white/15">
                        <label
                          className={`${
                            couponCode == 0 ? "bg-blue-500/20" : ""
                          }  rounded-full py-2 px-2.5 pr-15 flex items-center space-x-2 cursor-pointer hover:bg-blue-500/10`}
                        >
                          <input
                            type="radio"
                            name="code"
                            value="0"
                            checked={couponCode == 0}
                            onChange={() => setCouponCode(0)}
                            className="appearance-none w-4 h-4 border-2 border-blue-500 rounded-full checked:ring-3 checked:ring-blue-500/40 checked:bg-blue-500 transition-all duration-200"
                          />
                          <span className="text-sm text-gray-800 dark:text-gray-200">
                            None
                          </span>
                        </label>
                        <label
                          className={`${
                            couponCode == 50 ? "bg-blue-500/20" : ""
                          }  rounded-full py-2 px-2.5 pr-15 flex items-center space-x-2 cursor-pointer hover:bg-blue-500/10`}
                        >
                          <input
                            type="radio"
                            name="code"
                            value="50"
                            checked={couponCode == 50}
                            onChange={() => setCouponCode(50)}
                            className="appearance-none w-4 h-4 border-2 border-blue-500 rounded-full checked:ring-3 checked:ring-blue-500/40 checked:bg-blue-500 transition-all duration-200"
                          />
                          <span className="text-sm text-gray-800 dark:text-gray-200">
                            50
                          </span>
                        </label>
                        <label
                          className={`${
                            couponCode == 75 ? "bg-blue-500/20" : ""
                          }  rounded-full py-2 px-2.5 pr-15 flex items-center space-x-2 cursor-pointer hover:bg-blue-500/10`}
                        >
                          <input
                            type="radio"
                            name="code"
                            value="75"
                            checked={couponCode == 75}
                            onChange={() => setCouponCode(75)}
                            className="appearance-none w-4 h-4 border-2 border-blue-500 rounded-full checked:ring-3 checked:ring-blue-500/40 checked:bg-blue-500 transition-all duration-200"
                          />
                          <span className="text-sm text-gray-800 dark:text-gray-200">
                            75
                          </span>
                        </label>
                      </div>

                      <div
                        className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20"
                        style={{ animation: "pulse 2s infinite" }}
                      >
                        <p className="text-emerald-500 text-sm">
                          🚚 Free shipping on orders over $100!
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 4: Payment Information */}
                <div
                  className={`transition-all duration-500 ${
                    step === 4
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full absolute"
                  }`}
                >
                  {step === 4 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold dark:font-normal flex items-center">
                        <CreditCard className="mr-2 text-blue-500" />
                        Payment Details
                      </h2>

                      <div className="mt-6 bg-gray-100/80 dark:bg-gray-800/50 rounded-xl p-4">
                        <h3 className="font-medium mb-3">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="">
                              {product?.name} x {quantity}
                            </span>
                            <span className="">
                              ${(product?.price * quantity).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="">
                              {selectedShipping === "express"
                                ? "Express"
                                : "Standard"}{" "}
                              Shipping
                            </span>
                            <span className="">${shippingCost.toFixed(2)}</span>
                          </div>
                          <div className="border-t pt-2 mt-2 flex justify-between font-medium ">
                            <span>Total</span>
                            <span className="text-blue-600">
                              ${totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={`px-4 py-2 border border-black/15 dark:border-white/15 rounded-lg dark:text-gray-300hover:bg-gray-50 transition-all duration-300 ${
                      step === 1
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100"
                    }`}
                  >
                    Back
                  </button>

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-lg hover:from-violet-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-md"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-lg hover:from-violet-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-md disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Complete Order"
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden transition-all duration-500"
              style={{ animation: "fadeIn 0.5s ease-out forwards" }}
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                <p className="mb-6">
                  Thank you for your purchase. Your order has been received.
                </p>
                <div className="bg-gray-100/80 dark:bg-gray-800/50 rounded-xl p-4 max-w-md mx-auto">
                  <h3 className="font-medium mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between ">
                      <span>
                        {product?.name} x {quantity}
                      </span>
                      <span>${(productPrice * quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between ">
                      <span>
                        {selectedShipping === "express"
                          ? "Express"
                          : "Standard"}{" "}
                        Shipping
                      </span>
                      <span>${shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-blue-600">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsComplete(false)}
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-lg hover:from-violet-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-md"
                >
                  Place Another Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Order;
