// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addProduct, resetProductSlice } from "../store/slices/productSlice";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { category } from "../data/products.js";

// const BACKEND_URL = import.meta.env.VITE_BASE_URL;

// const AddProduct = () => {
//   const data = {
//     Men: category.Men.subCategories,
//     Women: category.Women.subCategories,
//     Kids: category.Kids.subCategories,
//     Beauty: category.Beauty.subCategories,
//     Electronics: category.Electronics.subCategories,
//     "Home-furniture": category["Home-furniture"].subCategories,
//     Grocery: category.Grocery.subCategories,
//     "Art-crafts": category["Art-crafts"].subCategories,
//     Books: category.Books.subCategories,
//   };

//   const dispatch = useDispatch();
//   const { loading, message, error } = useSelector((state) => state.product);

//   const [productData, setProductData] = useState({
//     name: "",
//     brand: "",
//     description: "",
//     category: "",
//     subCategory: "",
//     price: "",
//     discount: "",
//     stock: "",
//     images: [],
//     isBestSeller: false,
//     returnPolicy: {
//       returnable: false,
//       returnDays: "",
//       warranty: "",
//     },
//     deliveryOptions: {
//       isCOD: false,
//       estimatedDelivery: "",
//     },
//   });

//   const handleInputChange = (e) => {
//     const { name, value, type } = e.target;
//     let updatedValue = value;

//     if (
//       type === "select-one" &&
//       [
//         "isBestSeller",
//         "returnPolicy.returnable",
//         "deliveryOptions.isCOD",
//       ].includes(name)
//     ) {
//       updatedValue = value === "true";
//     }

//     if (name.includes("returnPolicy")) {
//       const key = name.split(".")[1];
//       setProductData((prev) => ({
//         ...prev,
//         returnPolicy: { ...prev.returnPolicy, [key]: updatedValue },
//       }));
//     } else if (name.includes("deliveryOptions")) {
//       const key = name.split(".")[1];
//       setProductData((prev) => ({
//         ...prev,
//         deliveryOptions: { ...prev.deliveryOptions, [key]: updatedValue },
//       }));
//     } else {
//       setProductData((prev) => ({ ...prev, [name]: updatedValue }));
//     }
//   };

//   const [images1, setImages] = useState([]);
//   const [uploadedUrls, setUploadedUrls] = useState([]);

//   const handleImageChange = (e) => {
//     setImages([...e.target.files]);
//   };

//   const handleImageUpload = async () => {
//     console.log("loading open...👀");
//     if (!images1 || images1.length === 0) {
//       alert("Please select images to upload.");
//       return;
//     }

//     if (
//       !productData?.category ||
//       productData?.category === "None" ||
//       !productData?.subCategory
//     ) {
//       alert("Please select valid categories to upload.");
//       return;
//     }

//     const folder = `trendz/products/${productData?.category}/${productData?.subCategory}`;
//     // const folder = `trendz/static/all/collection-banners`;
//     const formData = new FormData();
//     images1.forEach((image) => {
//       formData.append(`images_${folder}`, image);
//     });

//     try {
//       const response = await axios.post(
//         `${BACKEND_URL}/product/admin/upload-images`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         }
//       );
//       toast.success(response.data.message);
//       setUploadedUrls(response.data.imageUrls);
//     } catch (error) {
//       toast.error(error.response?.data || "Error, uploading image fail");
//       console.error("Image upload failed🎃: ", error.response?.data || error);
//     } finally {
//       console.log("loading closed...😒");
//     }
//   };

//   const handleAddProduct = (e) => {
//     e.preventDefault();

//     if (uploadedUrls.length === 0) {
//       toast.error("Please upload images before submitting.");
//       return;
//     }

//     if (productData.category === "None") {
//       toast.error("Please select valid category.");
//       return;
//     }

//     if (
//       !productData.name ||
//       !productData.brand ||
//       !productData.description ||
//       !productData.category ||
//       !productData.price
//     ) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     if (
//       typeof productData.name !== "string" ||
//       typeof productData.brand !== "string" ||
//       typeof productData.description !== "string" ||
//       typeof productData.category !== "string"
//     ) {
//       toast.error(
//         "Invalid data types for name, brand, description, or category"
//       );
//       return;
//     }

//     const price = parseInt(productData.price, 10);
//     if (isNaN(price) || price <= 0) {
//       toast.error("Price must be a positive integer.");
//       return;
//     }

//     const discount = parseInt(productData.discount);
//     if (isNaN(discount) || discount < 0 || discount > 100) {
//       toast.error("Discount must be a number between 0 and 100");
//       return;
//     }

//     const stock = parseInt(productData.stock);
//     if (isNaN(stock) || stock < 0) {
//       toast.error("Stock must be a non-negative number");
//       return;
//     }

//     const finalProductData = { ...productData, images: uploadedUrls };
//     dispatch(addProduct(finalProductData));
//   };

//   useEffect(() => {
//     if (message) {
//       toast.success(message);
//       setProductData({
//         name: "",
//         brand: "",
//         description: "",
//         category: "",
//         subCategory: "",
//         price: "",
//         discount: "",
//         stock: "",
//         images: [],
//         isBestSeller: false,
//         returnPolicy: {
//           returnable: false,
//           returnDays: "",
//           warranty: "",
//         },
//         deliveryOptions: {
//           isCOD: false,
//           estimatedDelivery: "",
//         },
//       });
//       setUploadedUrls([]);
//       dispatch(resetProductSlice());
//     }

//     if (error) {
//       toast.error(error);
//       dispatch(resetProductSlice());
//     }
//   }, [dispatch, message, error]);

//   return (
//     <div className="w-[80%] border border-white/10 p-5 m-5 mx-auto rounded-lg">
//       <form onSubmit={handleAddProduct} className="flex flex-col space-y-2">
//         <div className="flex justify-between items-center mb-5">
//           <h2 className="text-2xl font-semibold">Add Product</h2>
//           <img draggable="false"
//             loading="lazy"
//             src="/images/bag-logo.png"
//             className="w-10 h-10"
//           />
//         </div>
//         {loading && <p className="text-green-500">Loading...</p>}
//         {error && <p className="text-red-500">Error: {error}</p>}
//         {message && <p className="text-green-500">{message}</p>}
//         <input
//           type="text"
//           name="name"
//           placeholder="Product Name"
//           value={productData.name}
//           onChange={handleInputChange}
//           required
//           className="border p-1 rounded"
//         />
//         <input
//           type="text"
//           name="brand"
//           placeholder="Brand"
//           value={productData.brand}
//           onChange={handleInputChange}
//           required
//           className="border p-1 rounded"
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={productData.description}
//           onChange={handleInputChange}
//           required
//           className="border p-1 rounded w-full"
//         />

//         <label className="flex items-center gap-2">
//           category:
//           <select
//             name="category"
//             value={productData.category}
//             onChange={handleInputChange}
//             className="border p-1 rounded"
//           >
//             <option value="None">-</option>
//             <option value="Men">Men</option>
//             <option value="Women">Women</option>
//             <option value="Kids">Kids</option>
//             <option value="Beauty">Beauty</option>
//             <option value="Electronics">Electronics</option>
//             <option value="Home-furniture">Home-furniture</option>
//             <option value="Grocery">Grocery</option>
//             <option value="Art-crafts">Art-crafts</option>
//             <option value="Books">Books</option>
//           </select>
//         </label>

//         {productData.category !== "None" && (
//           <label className="flex items-center gap-2">
//             Subcategory:
//             <select
//               name="subCategory"
//               value={productData.subCategory}
//               onChange={handleInputChange}
//               className="border p-1 rounded"
//             >
//               <option value="">Select Subcategory</option>
//               {data[productData.category]?.map((sub) => (
//                 <option key={sub} value={sub}>
//                   {sub}
//                 </option>
//               ))}
//             </select>
//           </label>
//         )}

//         <input
//           type="number"
//           name="price"
//           placeholder="Price"
//           value={productData.price}
//           onChange={handleInputChange}
//           required
//           className="border p-1 rounded"
//         />
//         <input
//           type="number"
//           name="discount"
//           placeholder="Discount"
//           value={productData.discount}
//           onChange={handleInputChange}
//           className="border p-1 rounded"
//         />
//         <input
//           type="number"
//           name="stock"
//           placeholder="Stock"
//           value={productData.stock}
//           onChange={handleInputChange}
//           required
//           className="border p-1 rounded"
//         />

//         <h2>Upload images</h2>
//         <input type="file" multiple onChange={handleImageChange} />
//         <button onClick={handleImageUpload} disabled={!images1}>
//           Upload
//         </button>
//         <div>
//           {uploadedUrls.map((url, index) => (
//             <img draggable="false"
//               loading="lazy"
//               key={index}
//               src={url}
//               alt="Image"
//               width="200px"
//             />
//           ))}
//         </div>
//         <label className="flex items-center gap-2">
//           Best Seller:
//           <select
//             name="isBestSeller"
//             value={productData.isBestSeller}
//             onChange={handleInputChange}
//             className="border p-1 rounded"
//           >
//             <option value="true">Yes</option>
//             <option value="false">No</option>
//           </select>
//         </label>
//         {/* Return Policy */}
//         <h3 className="mt-2 font-semibold">Return Policy</h3>
//         <label className="flex items-center gap-2">
//           Returnable:
//           <select
//             name="returnPolicy.returnable"
//             value={productData.returnPolicy.returnable}
//             onChange={handleInputChange}
//             className="border p-1 rounded"
//           >
//             <option value="true">Yes</option>
//             <option value="false">No</option>
//           </select>
//         </label>
//         <input
//           type="number"
//           name="returnPolicy.returnDays"
//           placeholder="Return Days"
//           value={productData.returnPolicy.returnDays}
//           onChange={handleInputChange}
//           className="border p-1 rounded"
//         />
//         <input
//           type="text"
//           name="returnPolicy.warranty"
//           placeholder="Warranty"
//           value={productData.returnPolicy.warranty}
//           onChange={handleInputChange}
//           className="border p-1 rounded"
//         />
//         {/* Delivery Options */}
//         <h3 className="mt-2 font-semibold">Delivery Options</h3>
//         <label className="flex items-center gap-2">
//           Cash on Delivery:
//           <select
//             name="deliveryOptions.isCOD"
//             value={productData.deliveryOptions.isCOD}
//             onChange={handleInputChange}
//             className="border p-1 rounded"
//           >
//             <option value="true">Yes</option>
//             <option value="false">No</option>
//           </select>
//         </label>
//         <input
//           type="text"
//           name="deliveryOptions.estimatedDelivery"
//           placeholder="Estimated Delivery Time"
//           value={productData.deliveryOptions.estimatedDelivery}
//           onChange={handleInputChange}
//           className="border p-1 rounded"
//         />
//         <button
//           type="submit"
//           className="bg-green-500 text-white px-3 py-1 rounded"
//         >
//           Add Product
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addProduct, resetProductSlice } from "../store/slices/productSlice";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { category } from "../data/products.js";
// import {
//   CheckCircle,
//   ChevronDown,
//   ChevronUp,
//   CreditCard,
//   MapPin,
//   ShoppingBag,
//   Truck,
// } from "lucide-react";

// const AddProduct = () => {
//   const data = {
//     Men: category.Men.subCategories,
//     Women: category.Women.subCategories,
//     Kids: category.Kids.subCategories,
//     Beauty: category.Beauty.subCategories,
//     Electronics: category.Electronics.subCategories,
//     "Home-furniture": category["Home-furniture"].subCategories,
//     Grocery: category.Grocery.subCategories,
//     "Art-crafts": category["Art-crafts"].subCategories,
//     Books: category.Books.subCategories,
//   };

//   const [step, setStep] = useState(1);
//   const dispatch = useDispatch();
//   const { loading, message, error } = useSelector((state) => state.product);

//   const [productData, setProductData] = useState({
//     name: "",
//     brand: "",
//     description: "",
//     category: "",
//     subCategory: "",
//     price: "",
//     discount: "",
//     stock: "",
//     images: [],
//     isBestSeller: false,
//     returnPolicy: {
//       returnable: false,
//       returnDays: "",
//       warranty: "",
//     },
//     deliveryOptions: {
//       isCOD: false,
//       estimatedDelivery: "",
//     },
//   });

//   const steps = [
//     { label: "Basic", icon: ShoppingBag },
//     { label: "Details", icon: MapPin },
//     { label: "Return & Delivery", icon: Truck },
//     { label: "Confirm", icon: CreditCard },
//   ];

//   const nextStep = () => setStep((s) => (s < 4 ? s + 1 : s));
//   const prevStep = () => setStep((s) => (s > 1 ? s - 1 : s));

//   const handleInputChange = (e) => {
//     const { name, value, type } = e.target;
//     let updatedValue = value;

//     if (
//       type === "select-one" &&
//       [
//         "isBestSeller",
//         "returnPolicy.returnable",
//         "deliveryOptions.isCOD",
//       ].includes(name)
//     ) {
//       updatedValue = value === "true";
//     }

//     if (name.includes("returnPolicy")) {
//       const key = name.split(".")[1];
//       setProductData((prev) => ({
//         ...prev,
//         returnPolicy: { ...prev.returnPolicy, [key]: updatedValue },
//       }));
//     } else if (name.includes("deliveryOptions")) {
//       const key = name.split(".")[1];
//       setProductData((prev) => ({
//         ...prev,
//         deliveryOptions: { ...prev.deliveryOptions, [key]: updatedValue },
//       }));
//     } else {
//       setProductData((prev) => ({ ...prev, [name]: updatedValue }));
//     }
//   };

//   const [images1, setImages] = useState([]);
//   const [uploadedUrls, setUploadedUrls] = useState([]);

//   const handleImageChange = (e) => {
//     setImages([...e.target.files]);
//   };

//   const handleImageUpload = async () => {
//     console.log("loading open...👀");
//     if (!images1 || images1.length === 0) {
//       alert("Please select images to upload.");
//       return;
//     }

//     if (
//       !productData?.category ||
//       productData?.category === "None" ||
//       !productData?.subCategory
//     ) {
//       alert("Please select valid categories to upload.");
//       return;
//     }

//     const folder = `trendz/products/${productData?.category}/${productData?.subCategory}`;
//     // const folder = `trendz/static/all/collection-banners`;
//     const formData = new FormData();
//     images1.forEach((image) => {
//       formData.append(`images_${folder}`, image);
//     });

//     try {
//       const response = await axios.post(
//         `${BACKEND_URL}/product/admin/upload-images`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         }
//       );
//       toast.success(response.data.message);
//       setUploadedUrls(response.data.imageUrls);
//     } catch (error) {
//       toast.error(error.response?.data || "Error, uploading image fail");
//       console.error("Image upload failed🎃: ", error.response?.data || error);
//     } finally {
//       console.log("loading closed...😒");
//     }
//   };

//   const handleAddProduct = (e) => {
//     e.preventDefault();

//     if (uploadedUrls.length === 0) {
//       toast.error("Please upload images before submitting.");
//       return;
//     }

//     if (productData.category === "None") {
//       toast.error("Please select valid category.");
//       return;
//     }

//     if (
//       !productData.name ||
//       !productData.brand ||
//       !productData.description ||
//       !productData.category ||
//       !productData.price
//     ) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     if (
//       typeof productData.name !== "string" ||
//       typeof productData.brand !== "string" ||
//       typeof productData.description !== "string" ||
//       typeof productData.category !== "string"
//     ) {
//       toast.error(
//         "Invalid data types for name, brand, description, or category"
//       );
//       return;
//     }

//     const price = parseInt(productData.price, 10);
//     if (isNaN(price) || price <= 0) {
//       toast.error("Price must be a positive integer.");
//       return;
//     }

//     const discount = parseInt(productData.discount);
//     if (isNaN(discount) || discount < 0 || discount > 100) {
//       toast.error("Discount must be a number between 0 and 100");
//       return;
//     }

//     const stock = parseInt(productData.stock);
//     if (isNaN(stock) || stock < 0) {
//       toast.error("Stock must be a non-negative number");
//       return;
//     }

//     const finalProductData = { ...productData, images: uploadedUrls };
//     dispatch(addProduct(finalProductData));
//   };

//   useEffect(() => {
//     if (message) {
//       toast.success(message);
//       setProductData({
//         name: "",
//         brand: "",
//         description: "",
//         category: "",
//         subCategory: "",
//         price: "",
//         discount: "",
//         stock: "",
//         images: [],
//         isBestSeller: false,
//         returnPolicy: {
//           returnable: false,
//           returnDays: "",
//           warranty: "",
//         },
//         deliveryOptions: {
//           isCOD: false,
//           estimatedDelivery: "",
//         },
//       });
//       setUploadedUrls([]);
//       dispatch(resetProductSlice());
//     }

//     if (error) {
//       toast.error(error);
//       dispatch(resetProductSlice());
//     }
//   }, [dispatch, message, error]);

//   return (
//     <div className="max-w-3xl mx-auto mt-10 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
//       {/* Step Indicators */}
//       <div className="flex justify-between mb-8">
//         {steps.map((s, index) => {
//           const Icon = s.icon;
//           const isActive = index + 1 <= step;
//           return (
//             <div key={index} className="flex flex-col items-center text-center">
//               <div
//                 className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                   isActive
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 dark:bg-gray-800 text-gray-500"
//                 }`}
//               >
//                 {isActive ? <CheckCircle size={20} /> : <Icon size={20} />}
//               </div>
//               <p
//                 className={`mt-1 text-xs ${
//                   isActive ? "text-blue-600" : "text-gray-500"
//                 }`}
//               >
//                 {s.label}
//               </p>
//             </div>
//           );
//         })}
//       </div>

//       <form onSubmit={handleAddProduct} className="space-y-4">
//         {/* Step 1 - Basic */}
//         {step === 1 && (
//           <>
//             <input
//               type="text"
//               name="name"
//               placeholder="Product Name"
//               value={productData.name}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//             <input
//               type="text"
//               name="brand"
//               placeholder="Brand"
//               value={productData.brand}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//             <textarea
//               name="description"
//               placeholder="Description"
//               value={productData.description}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </>
//         )}

//         {/* Step 2 - Product Details */}
//         {step === 2 && (
//           <>
//             <label className="flex items-center gap-2">
//               Category:
//               <select
//                 name="category"
//                 value={productData.category}
//                 onChange={handleInputChange}
//                 className="border p-1 rounded"
//               >
//                 <option value="None">-</option>
//                 <option value="Men">Men</option>
//                 <option value="Women">Women</option>
//                 <option value="Kids">Kids</option>
//                 <option value="Beauty">Beauty</option>
//               </select>
//             </label>
//             <input
//               type="text"
//               name="subCategory"
//               placeholder="Subcategory"
//               value={productData.subCategory}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="number"
//               name="price"
//               placeholder="Price"
//               value={productData.price}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//             <input
//               type="number"
//               name="discount"
//               placeholder="Discount"
//               value={productData.discount}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="number"
//               name="stock"
//               placeholder="Stock"
//               value={productData.stock}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </>
//         )}

//         {/* Step 3 - Return & Delivery */}
//         {step === 3 && (
//           <>
//             <label className="flex items-center gap-2">
//               Returnable:
//               <select
//                 name="returnPolicy.returnable"
//                 value={productData.returnPolicy.returnable}
//                 onChange={handleInputChange}
//                 className="border p-1 rounded"
//               >
//                 <option value="true">Yes</option>
//                 <option value="false">No</option>
//               </select>
//             </label>
//             <input
//               type="number"
//               name="returnPolicy.returnDays"
//               placeholder="Return Days"
//               value={productData.returnPolicy.returnDays}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="text"
//               name="returnPolicy.warranty"
//               placeholder="Warranty"
//               value={productData.returnPolicy.warranty}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//             />
//             <label className="flex items-center gap-2">
//               Cash on Delivery:
//               <select
//                 name="deliveryOptions.isCOD"
//                 value={productData.deliveryOptions.isCOD}
//                 onChange={handleInputChange}
//                 className="border p-1 rounded"
//               >
//                 <option value="true">Yes</option>
//                 <option value="false">No</option>
//               </select>
//             </label>
//             <input
//               type="text"
//               name="deliveryOptions.estimatedDelivery"
//               placeholder="Estimated Delivery Time"
//               value={productData.deliveryOptions.estimatedDelivery}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//             />
//           </>
//         )}

//         {/* Step 4 - Confirm */}
//         {step === 4 && (
//           <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded">
//             <p className="font-semibold">Please confirm the details</p>
//             <pre className="text-sm mt-2 overflow-x-auto">
//               {JSON.stringify(productData, null, 2)}
//             </pre>
//           </div>
//         )}

//         {/* Navigation Buttons */}
//         <div className="flex justify-between items-center pt-4">
//           <button
//             type="button"
//             onClick={prevStep}
//             disabled={step === 1}
//             className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm"
//           >
//             Previous
//           </button>
//           {step < 4 ? (
//             <button
//               type="button"
//               onClick={nextStep}
//               className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
//             >
//               Next
//             </button>
//           ) : (
//             <button
//               type="submit"
//               className="px-4 py-2 bg-green-600 text-white rounded text-sm"
//             >
//               Add Product
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;

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
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";
import AdminNavbar from "../layout/AdminNavbar.jsx";

const steps = ["Product", "Details", "Images", "Delivery"];
const icons = [ShoppingBag, CreditCard, MapPin, Truck];

const initialData = {
  name: "",
  brand: "",
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
  const [step, setStep] = useState(0);
  const [productData, setProductData] = useState(
    () => JSON.parse(localStorage.getItem("productDraft")) || initialData
  );
  const [images, setImages] = useState([]);
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

  const handleImageUpload = () => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setUploadedUrls(urls);
    setProductData((prev) => ({ ...prev, images: urls }));
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
      images,
      deliveryOptions,
    } = productData;
    if (step === 0) return name && brand && description;
    if (step === 1) return category !== "None" && subCategory && price && stock;
    if (step === 2) return images.length > 0;
    if (step === 3)
      return deliveryOptions.isCOD && deliveryOptions.estimatedDelivery;
    return false;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    } else {
      alert("Please fill all fields before proceeding.");
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      console.log("Submitting", productData);
      localStorage.removeItem("productDraft");
    } else {
      alert("Please complete all fields.");
    }
  };

  return (
    <>
      {user?.role == "admin" ? <AdminNavbar /> : <SellerNavbar />}
      <div className="w-full max-w-3xl mx-auto p-5">
        <div className="flex justify-between mb-6">
          {steps.map((label, index) => {
            const Icon = icons[index];
            const completed = index < step;
            const active = index === step;
            return (
              <div
                key={label}
                className={`flex flex-col items-center text-sm ${
                  completed
                    ? "text-green-500"
                    : active
                    ? "text-blue-500"
                    : "text-gray-400"
                }`}
              >
                {completed ? <CheckCircle size={24} /> : <Icon size={24} />}
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 0 && (
            <div className="space-y-3">
              <input
                name="name"
                placeholder="Name"
                value={productData.name}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              />
              <input
                name="brand"
                placeholder="Brand"
                value={productData.brand}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={productData.description}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <select
                name="category"
                value={productData.category}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              >
                <option value="None">Select Category</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
              {productData.category !== "None" && (
                <select
                  name="subCategory"
                  value={productData.subCategory}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded"
                >
                  <option value="">Select Subcategory</option>
                  <option value="Shirts">Shirts</option>
                  <option value="Shoes">Shoes</option>
                </select>
              )}
              <input
                name="price"
                placeholder="Price"
                value={productData.price}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              />
              <input
                name="stock"
                placeholder="Stock"
                value={productData.stock}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <input type="file" multiple onChange={handleImageChange} />
              <button
                type="button"
                onClick={handleImageUpload}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Upload Images
              </button>
              <div className="flex gap-2 flex-wrap">
                {uploadedUrls.map((url, idx) => (
                  <img
                    draggable="false"
                    key={idx}
                    src={url}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <select
                name="deliveryOptions.isCOD"
                value={productData.deliveryOptions.isCOD}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              >
                <option value="true">COD Available</option>
                <option value="false">No COD</option>
              </select>
              <input
                name="deliveryOptions.estimatedDelivery"
                placeholder="Estimated Delivery Time"
                value={productData.deliveryOptions.estimatedDelivery}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              />
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              disabled={step === 0}
              onClick={handlePrev}
              className="px-4 py-1 bg-gray-300 rounded disabled:opacity-40"
            >
              Previous
            </button>
            {step < steps.length - 1 ? (
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
    </>
  );
};

export default AddProduct;
