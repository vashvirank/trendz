import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductById,
  editProduct,
  deleteProduct,
  setEditing,
  cancelEditing,
  updateEditData,
  resetProductSlice,
  addReview,
  addToCart,
} from "../store/slices/productSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { category } from "../data/products.js";
import { BadgeCheck } from "lucide-react";

const ProductDetails = () => {
  const url =
    "https://res.cloudinary.com/dsror8r39/image/upload/v1744352677/user_shodqy.png";
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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  let { product, isEditing, editData, loading, error, message } = useSelector(
    (state) => state.product
  );
  // isEditing = true;
  const { user } = useSelector((state) => state.auth);

  const [tab, setTab] = useState("reviews");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = (id) => {
    dispatch(addToCart(id));
  };

  const reviews = product?.reviews || [];

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
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

  useEffect(() => {
    if (!editData?.variants) return;

    const uniqueSizes = [
      ...new Set(editData?.variants?.map((v) => v.size).filter(Boolean)),
    ];
    const uniqueColors = [
      ...new Set(editData.variants.map((v) => v.color?.trim()).filter(Boolean)),
    ];

    setAvailableSizes(uniqueSizes);
    setAvailableColors(uniqueColors);
  }, [editData]);

  const orderedAvailableSizes = allSizes.filter((size) =>
    availableSizes.includes(size)
  );

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    const reviewData = { rating: Number(rating), comment };

    dispatch(addReview(product._id, reviewData));

    setComment("");
    setRating(5);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateEditData({ [name]: value }));
  };

  const handleSave = () => {
    dispatch(editProduct(id, editData));
  };

  const handleDelete = () => {
    dispatch(deleteProduct(id));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      setTimeout(() => {
        dispatch(resetProductSlice());
        navigate("/");
      }, 1000);
    }
    if (error) {
      toast.error(error);
      dispatch(resetProductSlice());
    }
  }, [dispatch, message, error]);

  const addVariant = () => {
    dispatch(
      updateEditData({
        variants: [
          ...(editData.variants || []),
          { size: "", color: "", material: "", stock: "" },
        ],
      })
    );
  };

  const deleteVariant = (index) => {
    dispatch(
      updateEditData({
        variants: editData.variants.filter((_, i) => i !== index),
      })
    );
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = editData.variants.map((variant, i) =>
      i === index ? { ...variant, [field]: value } : variant
    );
    dispatch(updateEditData({ variants: updatedVariants }));
  };

  const addSpecification = () => {
    dispatch(
      updateEditData({
        specifications: [
          ...(editData.specifications || []),
          { key: "", value: "" },
        ],
      })
    );
  };

  const deleteSpecification = (index) => {
    dispatch(
      updateEditData({
        specifications: editData.specifications.filter((_, i) => i !== index),
      })
    );
  };

  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecifications = editData.specifications.map((spec, i) =>
      i === index ? { ...spec, [field]: value } : spec
    );
    dispatch(updateEditData({ specifications: updatedSpecifications }));
  };

  const [selectedImages, setselectedImages] = useState([]);
  // const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleImageChange = (e) => {
    setselectedImages([...e.target.files]);
  };

  const addImage = async () => {
    console.log("loading open...👀");
    if (!selectedImages || selectedImages.length === 0) {
      alert("Please select images to upload.");
      return;
    }

    if (!product?.category || !product?.subCategory) {
      alert("categories are required to upload images");
      return;
    }

    const folder = `trendz/products/${product?.category}/${product?.subCategory}`;

    const formData = new FormData();
    selectedImages.forEach((image) => {
      formData.append(`images_${folder}`, image);
    });

    try {
      const response = await axios.post(
        `http://localhost:7000/api/v1/product/admin/add-images/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data || "Error, uploading image fail");
      console.error("Image upload failed🎃: ", error.response?.data || error);
    } finally {
      console.log("loading closed...😒");
    }
  };

  const deleteImage = async (index) => {
    const imageUrlToRemove = editData.images[index];

    try {
      const response = await axios.delete(
        `http://localhost:7000/api/v1/product/admin/remove-image/${id}`,
        {
          data: { imageUrl: imageUrlToRemove },
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        dispatch(
          updateEditData({
            images: editData.images.filter((_, i) => i !== index),
          })
        );
        toast.success(response.data.message);
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting image");
    }
  };

  return (
    <div className="max-w-7xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      {loading && <p className="text-green-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="bg-black/5 dark:bg-white/5 text-center p-3 mb-6">
        <h2 className="text-2xl font-semibold">Product Details</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-5 px-5 md:px-10">
        {/* Image Section */}
        <div className="md:min-w-2/5">
          {editData.images && (
            <img
              draggable="false"
              loading="lazy"
              src={editData?.images[0]}
              alt={editData?.name}
              className="rounded-2xl w-full md:w-110 border border-black/5 dark:border-white/5"
            />
          )}

          <div className="flex mt-4 gap-2">
            {editData?.images?.map((url, index) => (
              <div key={index}>
                <img
                  draggable="false"
                  loading="lazy"
                  src={url}
                  alt="Product"
                  width="100px"
                  className="w-22 h-22 object-cover rounded-lg border border-black/5 dark:border-white/5"
                />
                {isEditing && (
                  <button
                    onClick={() => deleteImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="w-full space-y-4">
          <h2 className="text-2xl font-semibold">
            {isEditing ? (
              <select
                name="name"
                value={editData.name || ""}
                onChange={handleChange}
                className="border p-1 rounded bg-gray-800"
              >
                <option value="">Select Name</option>
                {category?.[editData.category]?.subCategoryTypes?.[
                  editData.subCategory
                ]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            ) : (
              product?.name
            )}
          </h2>
          <div className="flex items-center gap-2 border border-black/5 dark:border-white/10 p-2 rounded">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span>{averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">
              ({totalReviews} Reviews)
            </span>
          </div>

          <div className="flex flex-col gap-3 border border-black/5 dark:border-white/10 p-2 rounded">
            {" "}
            <p>
              Discount:{" "}
              {isEditing ? (
                <input
                  type="number"
                  name="discount"
                  value={editData.discount || ""}
                  onChange={handleChange}
                  className="border p-1 rounded"
                />
              ) : (
                product?.discount
              )}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-yellow-600">
                $
                {isEditing ? (
                  <input
                    type="number"
                    name="finalPrice"
                    value={editData.finalPrice || ""}
                    onChange={handleChange}
                    className="border p-1 rounded"
                  />
                ) : (
                  product?.finalPrice?.toFixed(2)
                )}
              </span>
              <span className="line-through text-gray-400">
                $
                {isEditing ? (
                  <input
                    type="number"
                    name="price"
                    value={editData.price || ""}
                    onChange={handleChange}
                    className="border p-1 rounded"
                  />
                ) : (
                  product?.price
                )}
              </span>
            </div>
            {/* Brand */}
            <p>
              Brand:{" "}
              {isEditing ? (
                <select
                  name="brand"
                  value={editData.brand || ""}
                  onChange={handleChange}
                  className="border p-1 rounded bg-gray-800"
                >
                  <option value="">Select Name</option>
                  {category?.[editData.category]?.subCategoryBrands?.[
                    editData.subCategory
                  ]?.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              ) : (
                product?.brand
              )}
            </p>
            {/* description */}
            <p className="text-gray-400">
              {isEditing ? (
                <textarea
                  name="description"
                  value={editData.description || ""}
                  onChange={handleChange}
                  className="border p-1 rounded w-full"
                />
              ) : (
                editData?.description?.split(" ").slice(0, 20).join(" ") + "..."
              )}
            </p>
          </div>

          <div className="flex flex-col gap-4 border border-black/5 dark:border-white/10 p-2 rounded">
            {/* Color Options */}
            {availableColors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium">Available Color</h4>
                <div className="flex gap-2 mt-2">
                  {availableColors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Options */}
            {orderedAvailableSizes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium">available size</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {orderedAvailableSizes.map((size) => (
                    <button
                      key={size}
                      className="px-4 py-2 rounded border border-black/10 dark:border-white/10 bg-white/5 text-gray-300 hover:bg-white/15 text-sm font-medium"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {user?.role !== "seller" && user?.role !== "admin" && (
              <div className="flex items-center gap-4">
                <button className="text-xl w-10 h-10 bg-white/5 flex justify-center items-center rounded-full">
                  -
                </button>
                <span>1</span>
                <button className="text-xl w-10 h-10 bg-white/5 flex justify-center items-center rounded-full">
                  +
                </button>
                <button
                  onClick={handleAddToCart}
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Add to Cart
                </button>

                <NavLink
                  draggable="false"
                  to={`/add-order/${id}`}
                  className="px-4 py-2 bg-yellow-500 text-white rounded"
                >
                  Buy Now
                </NavLink>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 border border-black/5 dark:border-white/10 p-2 rounded">
            {availableColors.length > 0 ? (
              <p className="text-green-500 text-sm font-medium">In Stock</p>
            ) : (
              <p className="text-red-500 text-sm font-medium">Out of stock</p>
            )}

            <p>
              Estimated Delivery:{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="deliveryOptions.estimatedDelivery"
                  value={editData.deliveryOptions?.estimatedDelivery || ""}
                  onChange={handleChange}
                  className="border p-1 rounded"
                />
              ) : (
                product?.deliveryOptions?.estimatedDelivery
              )}
            </p>

            <div>
              Specifications:{" "}
              {editData?.specifications?.map((spec, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-2 flex gap-2 items-center"
                >
                  <p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) =>
                          handleSpecificationChange(
                            index,
                            "key",
                            e.target.value
                          )
                        }
                        className="border p-1 rounded"
                        placeholder="Key"
                      />
                    ) : (
                      spec.key
                    )}
                  </p>
                  <p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) =>
                          handleSpecificationChange(
                            index,
                            "value",
                            e.target.value
                          )
                        }
                        className="border p-1 rounded"
                        placeholder="Value"
                      />
                    ) : (
                      spec.value
                    )}
                  </p>

                  {isEditing && (
                    <button
                      onClick={() => deleteSpecification(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={addSpecification}
                  className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                >
                  Add Specification
                </button>
              )}
            </div>
          </div>

          {isEditing && (
            <select
              name="color"
              value={editData.color || ""}
              onChange={handleChange}
              className="border p-1 rounded bg-gray-800"
            >
              <option value="">Select Color</option>
              {category?.[editData.category]?.colours?.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          )}
          {isEditing && (
            <div>
              Variants:{" "}
              {editData?.variants?.map((variant, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-2 flex gap-2 items-center"
                >
                  <p>
                    {isEditing ? (
                      <select
                        value={variant.size}
                        onChange={(e) =>
                          handleVariantChange(index, "size", e.target.value)
                        }
                        className="border p-1 rounded"
                      >
                        <option value="XXS">XXS</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="2XL">2XL</option>
                        <option value="3XL">3XL</option>
                        <option value="4XL">4XL</option>
                        <option value="5XL">5XL</option>
                        <option value="6XL">6XL</option>
                      </select>
                    ) : (
                      `Size: ${variant.size}`
                    )}
                  </p>

                  <p>
                    {isEditing ? (
                      <select
                        name="color"
                        value={variant.color}
                        onChange={(e) =>
                          handleVariantChange(index, "color", e.target.value)
                        }
                        className="border p-1 rounded bg-gray-800"
                      >
                        <option value="">Select Color</option>
                        {category?.[editData.category]?.colours?.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    ) : (
                      product?.color
                    )}
                  </p>

                  <p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={variant.material}
                        onChange={(e) =>
                          handleVariantChange(index, "material", e.target.value)
                        }
                        className="border p-1 rounded"
                        placeholder="Material"
                      />
                    ) : (
                      variant.material
                    )}
                  </p>

                  <p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={variant.stock}
                        onChange={(e) =>
                          handleVariantChange(index, "stock", e.target.value)
                        }
                        className="border p-1 rounded"
                        placeholder="Stock"
                      />
                    ) : (
                      variant.stock
                    )}
                  </p>

                  {isEditing && (
                    <button
                      onClick={() => deleteVariant(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={addVariant}
                  className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                >
                  Add Variant
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 md:px-10">
        <div>
          <div className="flex justify-evenly items-center">
            <button
              onClick={() => setTab("reviews")}
              className={`border-b-2 py-0.5 px-2 ${
                tab === "reviews"
                  ? "border-blue-500 text-gray-800 dark:text-gray-300"
                  : "border-transparent text-gray-400"
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setTab("description")}
              className={`border-b-2 py-0.5 px-2 ${
                tab === "description"
                  ? "border-blue-500 text-gray-800 dark:text-gray-300"
                  : "border-transparent text-gray-400"
              }`}
            >
              Description
            </button>
          </div>

          <div className="border border-black/5 dark:border-white/5 rounded-lg p-3">
            <div className={`${tab === "reviews" ? "" : "hidden"}`}>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3">
                  {
                    <div className="mb-4 flex flex-col h-full justify-center items-center">
                      <p className="text-2xl font-semibold">
                        {averageRating.toFixed(1)}{" "}
                        <span className="text-sm font-normal text-gray-400">
                          out of 5
                        </span>
                      </p>
                      <p className="text-sm">⭐⭐⭐⭐⭐</p>
                      <p className="text-sm text-gray-500">
                        ({totalReviews} Reviews)
                      </p>
                    </div>
                  }
                </div>
                <div className="space-y-2 mt-4 w-full md:w-2/3">
                  {ratingCounts.map(({ star, count }) => {
                    const percentage =
                      totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                    const bgColor =
                      {
                        5: "bg-green-500",
                        4: "bg-lime-400",
                        3: "bg-yellow-400",
                        2: "bg-orange-400",
                        1: "bg-red-500",
                      }[star] || "bg-gray-300";

                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-6 text-sm">{star}★</span>
                        <div className="w-full bg-black/5 dark:bg-white/20 rounded max-h-1.5 overflow-hidden">
                          <div
                            className={`${bgColor} h-1.5`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={`${tab === "description" ? "" : "hidden"}`}>
              <div className="flex flex-col gap-1 mb-2">
                <p>
                  Returnable:{" "}
                  {isEditing ? (
                    <select
                      name="returnPolicy.returnable"
                      value={editData.returnPolicy?.returnable || false}
                      onChange={handleChange}
                      className="border p-1 rounded"
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </select>
                  ) : product?.returnPolicy?.returnable ? (
                    "Yes"
                  ) : (
                    "No"
                  )}
                </p>

                <p>
                  Return Days:{" "}
                  {isEditing ? (
                    <input
                      type="number"
                      name="returnPolicy.returnDays"
                      value={editData.returnPolicy?.returnDays || ""}
                      onChange={handleChange}
                      className="border p-1 rounded"
                    />
                  ) : (
                    product?.returnPolicy?.returnDays
                  )}
                </p>

                <p>
                  Cash on Delivery Available:{" "}
                  {isEditing ? (
                    <select
                      name="deliveryOptions.isCOD"
                      value={editData.deliveryOptions?.isCOD || false}
                      onChange={handleChange}
                      className="border p-1 rounded"
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </select>
                  ) : product?.deliveryOptions?.isCOD ? (
                    "Yes"
                  ) : (
                    "No"
                  )}
                </p>

                <p>
                  Warranty:{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="returnPolicy.warranty"
                      value={editData.returnPolicy?.warranty || ""}
                      onChange={handleChange}
                      className="border p-1 rounded"
                    />
                  ) : (
                    product?.returnPolicy?.warranty
                  )}
                </p>
              </div>
              <div>{editData?.description}</div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold mb-4">Reviews</h3>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-500">({totalReviews} Reviews)</span>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-8 mt-6">
            {editData?.reviews?.map((review, i) => (
              <div key={review._id || i}>
                <div className="flex items-center gap-4">
                  <img src={url} className="w-12 h-12" />
                  <div>
                    <h4 className="font-semibold flex items-center gap-1">
                      <p>{review?.name || "Anonymous"}</p>
                      <BadgeCheck
                        size={16}
                        className="text-green-500 bg-green-500/20 rounded-full"
                      />
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex mt-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span
                      key={idx}
                      className={
                        idx < Math.round(review.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="mt-2 text-gray-500">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* review */}
        {!isEditing && user?.role !== "seller" && (
          <form
            onSubmit={handleSubmitReview}
            className="border my-5 p-3 rounded-lg border-black/20 dark:border-white/20 flex items-center gap-3"
          >
            <textarea
              placeholder="Add review..."
              value={comment}
              className="border border-black/10 dark:border-white/10 px-1 active:outline-0 rounded w-full"
              onChange={(e) => setComment(e.target.value)}
            />
            <label>Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="border dark:bg-gray-800 min-w-50 rounded p-1  border-black/10 dark:border-white/10"
            >
              <option value="5">5 (Excellent)</option>
              <option value="4">4 (Good)</option>
              <option value="3">3 (Fair)</option>
              <option value="2">2 (Poor)</option>
              <option value="1">1 (Very Poor)</option>
            </select>

            <button
              type="submit"
              className="bg-blue-500 text-white min-w-50 py-1 rounded"
            >
              Submit Review
            </button>
          </form>
        )}

        {isEditing && (
          <>
            {/* best seller */}
            <div>
              <p>Is Best Seller:</p>
              <select
                name="isBestSeller"
                value={editData.isBestSeller || false}
                onChange={handleChange}
                className="border p-1 rounded"
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>

            {/* add image */}
            <div>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="border"
                multiple
              />
              <button
                onClick={addImage}
                disabled={!selectedImages}
                className="bg-blue-500 m-1 px-3 py-2 rounded"
              >
                Add Image
              </button>
            </div>

            {/* category */}
            <div>
              <p>Category:</p>
              <select
                name="category"
                value={editData.category || ""}
                onChange={handleChange}
                className="border p-1 rounded bg-gray-800"
              >
                <option value="None">-</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Beauty">Beauty</option>
                <option value="Electronics">Electronics</option>
                <option value="Home-furniture">Home-furniture</option>
                <option value="Grocery">Grocery</option>
                <option value="Art-crafts">Art-crafts</option>
                <option value="Books">Books</option>
              </select>
            </div>

            {/* subCategory */}
            <div>
              <p>SubCategory:</p>
              <select
                name="subCategory"
                value={editData.subCategory || ""}
                onChange={handleChange}
                className="border p-1 rounded bg-gray-800"
              >
                <option value="">Select Subcategory</option>
                {data[editData.category]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* stock */}
            <div>
              <p>Stock: </p>
              <input
                type="number"
                name="stock"
                value={editData.stock || ""}
                onChange={handleChange}
                className="border p-1 rounded"
              />
            </div>
          </>
        )}

        {user?.role !== "customer" && (
          <div className="mt-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => dispatch(cancelEditing())}
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-5 py-2 rounded mr-2"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete Product
                </button>
                <button
                  onClick={() => dispatch(setEditing(product))}
                  className="bg-blue-500 text-white px-5 py-2 rounded"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
