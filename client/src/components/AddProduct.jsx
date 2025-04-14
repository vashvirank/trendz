import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, resetProductSlice } from "../store/slices/productSlice";
import { toast } from "react-toastify";
import SellerNavbar from "../layout/SellerNavbar.jsx";
import axios from "axios";
import { category } from "../data/products.js";
import {
  CheckCircle,
  CreditCard,
  ShoppingBag,
  Truck,
  Image,
} from "lucide-react";
import AdminNavbar from "../layout/AdminNavbar.jsx";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

const steps = [
  "Category details",
  "Price & color",
  "Images",
  "Delivery options",
];
const icons = [ShoppingBag, CreditCard, Image, Truck];

const initialData = {
  name: "",
  brand: "",
  color: "",
  description: "",
  category: "None",
  subCategory: "",
  price: "",
  discount: "",
  stock: "",
  images: [],
  isBestSeller: "false",
  returnPolicy: {
    returnable: "false",
    returnDays: "",
    warranty: "",
  },
  deliveryOptions: {
    isCOD: "false",
    estimatedDelivery: "",
  },
};

const AddProduct = () => {
  const data = {
    Men: category.Men.subCategories,
    Women: category.Women.subCategories,
    Kids: category.Kids.subCategories,
    Beauty: category.Beauty.subCategories,
    Electronics: category.Electronics.subCategories,
    "Home-furniture": category["Home-furniture"].subCategories,
    Grocery: category.Grocery.subCategories,
    "Art-crafts": category["Art-crafts"].subCategories,
    Books: category.Books.subCategories,
  };

  const [step, setStep] = useState(0);
  const [productData, setProductData] = useState(
    () => JSON.parse(localStorage.getItem("productDraft")) || initialData
  );
  const [images1, setImages] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const dispatch = useDispatch();
  const { loading, message, error } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);

  // Autosave to localStorage
  useEffect(() => {
    localStorage.setItem("productDraft", JSON.stringify(productData));
  }, [productData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("returnPolicy.")) {
      const key = name.split(".")[1];
      setProductData((prev) => ({
        ...prev,
        returnPolicy: {
          ...prev.returnPolicy,
          [key]: value,
        },
      }));
    } else if (name.includes("deliveryOptions.")) {
      const key = name.split(".")[1];
      setProductData((prev) => ({
        ...prev,
        deliveryOptions: {
          ...prev.deliveryOptions,
          [key]: value,
        },
      }));
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleImageUpload = async (e) => {
    console.log("loading open...👀");
    if (!images1 || images1.length === 0) {
      toast.warning("Please select images to upload.");
      return;
    }

    if (
      !productData?.category ||
      productData?.category === "None" ||
      !productData?.subCategory
    ) {
      toast.warning("Please select valid categories to upload.");
      return;
    }

    const folder = `trendz/products/${productData?.category}/${productData?.subCategory}`;
    // const folder = `trendz/static/all/collection-banners`;
    const formData = new FormData();
    images1.forEach((image) => {
      formData.append(`images_${folder}`, image);
    });

    try {
      const response = await axios.post(
        `${BACKEND_URL}/product/admin/upload-images`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setUploadedUrls(response.data.imageUrls);
    } catch (error) {
      toast.error(error.response?.data || "Error, uploading image fail");
      console.log(error);
      console.error("Image upload failed🎃: ", error.response?.data || error);
    } finally {
      console.log("loading closed...😒");
    }
  };

  const validateStep = () => {
    const {
      name,
      brand,
      description,
      category,
      subCategory,
      price,
      stock,
      color,
      discount,
      images,
      deliveryOptions,
    } = productData;
    if (step === 0) return category !== "None" && subCategory && name && brand;
    if (step === 1) return price && discount && stock && color && description;
    if (step === 2) return 1 || images.length > 0;
    if (step === 3)
      return deliveryOptions.isCOD && deliveryOptions.estimatedDelivery;
    return false;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    } else {
      toast.warning("Please fill all fields before proceeding.");
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    // if (uploadedUrls.length === 0) {
    //   toast.error("Please upload images before submitting.");
    //   return;
    // }

    if (productData.category === "None") {
      toast.error("Please select valid category.");
      return;
    }

    if (
      !productData.name ||
      !productData.brand ||
      !productData.description ||
      !productData.category ||
      !productData.price
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      typeof productData.name !== "string" ||
      typeof productData.brand !== "string" ||
      typeof productData.description !== "string" ||
      typeof productData.category !== "string"
    ) {
      toast.error(
        "Invalid data types for name, brand, description, or category"
      );
      return;
    }

    const price = parseInt(productData.price, 10);
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a positive integer.");
      return;
    }

    const discount = parseInt(productData.discount);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      toast.error("Discount must be a number between 0 and 100");
      return;
    }

    const stock = parseInt(productData.stock);
    if (isNaN(stock) || stock < 0) {
      toast.error("Stock must be a non-negative number");
      return;
    }

    const finalProductData = { ...productData, images: uploadedUrls };
    dispatch(addProduct(finalProductData));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      setProductData({
        name: "",
        brand: "",
        description: "",
        category: "",
        subCategory: "",
        price: "",
        discount: "",
        stock: "",
        images: [],
        isBestSeller: false,
        returnPolicy: {
          returnable: false,
          returnDays: "",
          warranty: "",
        },
        deliveryOptions: {
          isCOD: false,
          estimatedDelivery: "",
        },
      });
      setUploadedUrls([]);
      dispatch(resetProductSlice());
    }

    if (error) {
      toast.error(error);
      dispatch(resetProductSlice());
    }
  }, [dispatch, message, error]);

  return (
    <>
      {user?.role == "admin" ? <AdminNavbar /> : <SellerNavbar />}

      <div className="min-h-[90vh] flex justify-center items-center p-4 md:p-8 bg-sky-50 dark:bg-gray-950/70 text-gray-700 dark:text-gray-300">
        {loading && <p className="text-green-500">Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {message && <p className="text-blue-500">{message}</p>}

        {step < 4 ? (
          <div className="w-full md:w-160 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-blue-500/10">
            {/* Header */}
            <div
              className="p-4 text-gray-600 dark:text-gray-300 
        bg-gradient-to-r from-blue-500/30 to-violet-500/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-end gap-1">
                  <svg width="27" height="27" className="text-blue-500">
                    <use xlinkHref="/icons.svg#sparkle-icon" />
                  </svg>
                  <h1 className="text-xl md:text-2xl font-semibold dark:font-normal">
                    Add product...
                  </h1>
                </div>
                <img
                  draggable="false"
                  src="/images/bag-logo1.png"
                  className="h-8"
                />
              </div>
              <div className="flex items-center gap-3 mt-4">
                {steps.map((label, index) => {
                  const Icon = icons[index];
                  const completed = index < step;
                  const active = index === step;
                  return (
                    <div
                      key={label}
                      className={`flex flex-col items-center rounded-full p-2 text-sm ${
                        completed
                          ? "text-green-500 bg-green-500/20"
                          : active
                          ? "text-blue-500 bg-blue-500/20 ring-2"
                          : "text-gray-400 bg-gray-400/10"
                      }`}
                    >
                      {completed ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 p-5">
              <h2 className="text-blue-400 text-xl font-semibold">
                {steps[step]}
              </h2>

              {step === 0 && (
                <div className="space-y-6 p-4 text-gray-600 dark:text-gray-300 rounded-lg shadow-md">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={productData.category}
                      onChange={handleInputChange}
                      className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
                    >
                      <option value="None">-- Select Category --</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Home-furniture">Home Furniture</option>
                      <option value="Grocery">Grocery</option>
                      <option value="Art-crafts">Art & Crafts</option>
                      <option value="Books">Books</option>
                    </select>
                  </div>

                  {/* Subcategory */}
                  {productData.category !== "None" && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Subcategory
                      </label>
                      <select
                        name="subCategory"
                        value={productData.subCategory}
                        onChange={handleInputChange}
                        className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
                      >
                        <option value="">-- Select Subcategory --</option>
                        {data[productData.category]?.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Product Name */}
                  {productData.subCategory && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Product Name
                      </label>
                      <select
                        name="name"
                        value={productData.name || ""}
                        onChange={handleInputChange}
                        className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
                      >
                        <option value="">-- Select Product Name --</option>
                        {category?.[productData.category]?.subCategoryTypes?.[
                          productData.subCategory
                        ]?.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Brand */}
                  {productData.subCategory && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Brand
                      </label>
                      <select
                        name="brand"
                        value={productData.brand || ""}
                        onChange={handleInputChange}
                        className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
                      >
                        <option value="">-- Select Brand --</option>
                        {category?.[productData.category]?.subCategoryBrands?.[
                          productData.subCategory
                        ]?.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6 p-4 text-gray-600 dark:text-gray-300 rounded-lg shadow-md">
                  {/* Price & Discount */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        placeholder="Enter product price"
                        value={productData.price}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        name="discount"
                        placeholder="Enter discount"
                        value={productData.discount}
                        onChange={handleInputChange}
                        className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
                      />
                    </div>
                  </div>

                  {/* Stock & Color */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Stock
                      </label>
                      <input
                        type="number"
                        name="stock"
                        placeholder="Available stock"
                        value={productData.stock}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Color
                      </label>
                      <select
                        name="color"
                        value={productData.color || ""}
                        onChange={handleInputChange}
                        className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
                      >
                        <option value="">-- Select Color --</option>
                        {category?.[productData.category]?.colours?.map(
                          (col) => (
                            <option
                              key={col}
                              value={col}
                              style={{ backgroundColor: col, color: "#fff" }}
                            >
                              {col}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Write a brief description"
                      value={productData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 resize-none"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 p-4 text-gray-600 dark:text-gray-300 rounded-lg">
                  {/* File Input */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Choose Images
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleImageChange}
                      className="w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
          dark:file:bg-gray-800 dark:file:text-white dark:hover:file:bg-gray-700"
                    />
                  </div>

                  {/* Upload Button */}
                  <div>
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={!images1}
                      className={`px-5 py-2 rounded-lg font-medium transition 
          ${
            images1
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
                    >
                      Upload
                    </button>
                  </div>

                  {/* Uploaded Image Preview */}
                  {uploadedUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {uploadedUrls.map((url, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-lg border border-black/10 dark:border-white/10 shadow-sm"
                        >
                          <img
                            src={url}
                            alt={`Uploaded ${index}`}
                            draggable="false"
                            loading="lazy"
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 text-gray-600 dark:text-gray-300 rounded-lg">
                  {/* Return Policy */}
                  <div className="bg-gray-500/5 p-3 rounded-xl">
                    <h3 className="text-base font-semibold mb-2">
                      Return Policy
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Returnable */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Returnable
                        </label>
                        <select
                          name="returnPolicy.returnable"
                          value={productData.returnPolicy.returnable}
                          onChange={handleInputChange}
                          className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>

                      {/* Return Days */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Return Days
                        </label>
                        <input
                          type="number"
                          name="returnPolicy.returnDays"
                          placeholder="e.g. 7"
                          value={productData.returnPolicy.returnDays}
                          onChange={handleInputChange}
                          className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Warranty */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">
                        Warranty
                      </label>
                      <input
                        type="text"
                        name="returnPolicy.warranty"
                        placeholder="e.g. 1 Year"
                        value={productData.returnPolicy.warranty}
                        onChange={handleInputChange}
                        className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Delivery Options */}
                  <div className="bg-gray-500/5 p-3 rounded-xl">
                    <h3 className="text-base font-semibold mb-2">
                      Delivery Options
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* COD */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Cash on Delivery
                        </label>
                        <select
                          name="deliveryOptions.isCOD"
                          value={productData.deliveryOptions.isCOD}
                          onChange={handleInputChange}
                          className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>

                      {/* Estimated Delivery */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Estimated Delivery Time
                        </label>
                        <input
                          type="text"
                          name="deliveryOptions.estimatedDelivery"
                          placeholder="e.g. 3-5 days"
                          value={productData.deliveryOptions.estimatedDelivery}
                          onChange={handleInputChange}
                          className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Best Seller */}
                  <div className="bg-gray-500/5 p-3 rounded-xl">
                    <label className="block text-sm font-medium mb-1">
                      Best Seller
                    </label>
                    <select
                      name="isBestSeller"
                      value={productData.isBestSeller}
                      onChange={handleInputChange}
                      className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={handlePrev}
                  className="px-4 py-1 border border-blue-500 text-gray-200 rounded disabled:opacity-40"
                >
                  Previous
                </button>
                {step < steps.length ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-1 bg-blue-500 text-white rounded"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-1 bg-green-500 text-white rounded"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-8 items-center rounded-xl bg-gray-500/10 p-14">
            <div className="rounded-full p-3 text-green-500 hover:bg-green-500/25 bg-green-500/20">
              <CheckCircle size={36} />
            </div>
            <span className="text-center">
              <p className="text-xl font-semibold">Amazing!</p>
              <p className="tracking-[1px]"> Product created successfully...</p>
            </span>
            <button
              className="hover:scale-95 hover:bg-blue-500/25 transition-transform bg-blue-500/20 text-blue-500 rounded-lg py-1.5 px-8"
              onClick={() => setStep(0)}
            >
              Add another product
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AddProduct;
