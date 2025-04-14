import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import axios from "axios";
import { category, categories } from "../data/products.js";
import SellerNavbar from "../layout/SellerNavbar.jsx";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import { useSelector } from "react-redux";
import { Funnel, ArrowUpAZ, ArrowDownAZ, X } from "lucide-react";

const limit = import.meta.env.VITE_PAGE_LIMIT || 10;

const SellerStore = () => {
  const data = {
    All: category.All.subCategories,
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

  const { user } = useSelector((state) => state.auth);

  const [productsList, setProductsList] = useState([]);
  const [order, setOrder] = useState("");
  const [color, setColor] = useState([]);
  const [brand, setBrand] = useState([]);
  const [type, setType] = useState([]);
  const [category1, setCategory1] = useState("All");
  const [subCategory, setSubCategory] = useState("All");
  const [sortBy, setSortBy] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const BACKEND_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchProducts();
  }, [
    order,
    color,
    brand,
    type,
    subCategory,
    category1,
    sortBy,
    page,
    searchParams,
  ]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (order) params.append("order", order);
      if (color.length) params.append("color", color.join(","));
      if (brand.length) params.append("brand", brand.join(","));
      if (type.length) params.append("type", type.join(","));
      if (subCategory) params.append("subCategory", subCategory);
      if (category1) params.append("category", category1);

      if (sortBy.length) params.append("sortBy", sortBy.join(","));
      params.append("page", page);
      params.append("limit", limit);
      params.append("sellerName", user?.name);

      setSearchParams(params);

      const url = `${BACKEND_URL}/product${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await axios.get(url, {
        withCredentials: true,
      });

      setProductsList(res.data.products);
      setPages(res.data.pages);
    } catch (error) {
      toast.error(error.response?.data?.message, {
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (value) => {
    setOrder((prevOrder) => (prevOrder === value ? "" : value));
  };

  const handleColorChange = (selectedColour) => {
    if (color.includes(selectedColour)) {
      setColor(color.filter((c) => c !== selectedColour));
    } else {
      setColor([...color, selectedColour]);
    }
  };

  const handleBrandChange = (e) => {
    const { id, checked } = e.target;
    setBrand((prev) =>
      checked ? [...prev, id] : prev.filter((Product) => Product !== id)
    );
  };

  const handleTypeChange = (e) => {
    const { id, checked } = e.target;
    setType((prev) =>
      checked ? [...prev, id] : prev.filter((Product) => Product !== id)
    );
  };

  const handleCategoryClick = (category1) => {
    setCategory1(category1);
    setType([]);
    setSubCategory("");
  };

  const handleSubCategoryClick = (subCategory) => {
    setSubCategory(subCategory);
    setType([]);
  };

  const handleSortBy = (e) => {
    const { id, checked } = e.target;
    setSortBy((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const resetFilters = () => {
    setOrder("");
    setColor([]);
    setBrand([]);
    setType([]);
    setSubCategory("");
    setCategory1("All");
    setSortBy([]);
    setSearchParams({});
  };

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleMobileFilters = () => {
    setShowMobileFilters((prev) => !prev);
  };

  return (
    <>
      <SellerNavbar />
      <div>
        <div
          className="flex flex-col md:flex-row items-center h-[60vh] md:h-[50vh] justify-evenly 
          bg-gradient-to-tl from-[#d3d7ff] to-[#96a2e6]
          dark:bg-gradient-to-tl dark:from-[#666ba5] dark:to-[#323d86]"
        >
          <div className="flex justify-center items-center text-center md:text-left text-5xl md:text-6xl font-bold h-[16vh] md:h-[45vh] w-[90vw] md:w-[60vh] text-white dark:text-gray-300">
            Best Online Selling Platform
          </div>
          <img
            draggable="false"
            loading="lazy"
            src="/images/store.png"
            className="h-[30vh] md:h-[45vh] w-[30vh] md:w-[45vh]"
          />
        </div>
        <h2 className="text-2xl text-center m-4">Your Products</h2>

        <div className="bg-blue-50 dark:bg-gray-950">
          {/* Mobile Filters Button */}
          <div className="md:hidden w-full rounded-t-2xl fixed bottom-0 z-10 bg-gray-900/90 backdrop-blur-[5px] p-2">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={toggleMobileFilters}
                className="flex items-center gap-1 px-5 py-1 rounded-full bg-blue-500/20 text-blue-500"
              >
                Filters <Funnel size={14} />
              </button>
              <button
                className="px-5 py-1 rounded-full bg-gray-300/20 text-gray-300"
                onClick={resetFilters}
              >
                Reset ↻
              </button>
            </div>
          </div>

          {/* Backdrop */}
          {showMobileFilters && (
            <div
              className="fixed inset-0 z-9 bg-black/50 md:hidden"
              onClick={toggleMobileFilters}
            />
          )}
          <div className="flex">
            {/* siderbar desktop */}
            <section className="hidden md:block min-w-40 min-h-[100vh] bg-blue-100/50 dark:bg-white/5">
              <div>
                {/* Reset Button */}
                <div className="my-3 flex justify-center items-center gap-2">
                  <h2 className=" font-semibold">Filter</h2>
                  <button
                    className="text-blue-400 hover:bg-white/5 border border-white/10 px-1 rounded"
                    onClick={resetFilters}
                  >
                    Reset ↻
                  </button>
                </div>
              </div>

              <div className="p-3 border-t border-t-black/10 dark:border-t-white/10">
                <h3 className="mb-1">Order</h3>
                <span className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id="ascending"
                    className={`${
                      order === "ascending" ? "scale-90" : "appearance-none"
                    } relative right-1 aspect-square h-3.5 border-1 border-black/25 dark:border-white/25 transition-transform active:scale-90 rounded-sm`}
                    checked={order === "ascending"}
                    onChange={() => handleSortChange("ascending")}
                  />
                  <label
                    htmlFor="ascending"
                    className="w-full flex gap-1 items-end"
                  >
                    Ascending <ArrowUpAZ size="20" />
                  </label>
                </span>
                <span className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id="descending"
                    className={`${
                      order === "descending" ? "scale-90" : "appearance-none"
                    } relative right-1 aspect-square h-3.5 border-1 border-black/25 dark:border-white/25 transition-transform active:scale-90 rounded-sm`}
                    checked={order === "descending"}
                    onChange={() => handleSortChange("descending")}
                  />
                  <label
                    htmlFor="descending"
                    className="w-full flex gap-1 items-end"
                  >
                    Descending <ArrowDownAZ size="20" />
                  </label>
                </span>
              </div>

              {/* sort by */}
              <div className="p-3 border-t border-t-black/10 dark:border-t-white/10">
                <h3 className="mb-1">Sort By</h3>
                {["price", "ratings", "no. of reviews"].map((sort) => (
                  <span key={sort} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      id={sort}
                      className={`${
                        sortBy.includes(sort) ? "scale-90" : "appearance-none"
                      } relative right-1 aspect-square h-3.5 border-1 border-black/25 dark:border-white/25 transition-transform active:scale-90 rounded-sm`}
                      onChange={handleSortBy}
                      checked={sortBy.includes(sort)}
                    />
                    <label htmlFor={sort} className="w-full">
                      {sort}
                    </label>
                  </span>
                ))}
              </div>

              {/* color */}
              <div className="p-3 border-t border-t-black/10 dark:border-t-white/10">
                <h3 className="mb-1.5">Colour</h3>
                <div className="grid grid-cols-3 px-2">
                  {category[category1]?.colours.map((colour) => {
                    const isSelected = color.includes(colour);
                    return (
                      <div
                        key={colour}
                        onClick={() => handleColorChange(colour)}
                        className={`cursor-pointer h-8 w-8 border-2 rounded-full flex flex-col justify-center items-center transition 
              ${isSelected ? "border-white" : "border-transparent"}`}
                      >
                        <span
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: colour }}
                        />
                        {colour === "Multi" && (
                          <img
                            draggable="false"
                            src="/images/multi.png"
                            className="w-6 h-6"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* type  */}
              {category[category1]?.subCategoryTypes[subCategory] && (
                <div className="p-3 border-t border-t-black/10 dark:border-t-white/10">
                  <h3 className="mb-1.5">Type</h3>
                  {category[category1]?.subCategoryTypes[subCategory]?.map(
                    (Type) => (
                      <span key={Type} className="flex gap-1 items-center">
                        <input
                          type="checkbox"
                          id={Type}
                          className={`${
                            type.includes(Type) ? "scale-90" : "appearance-none"
                          } relative right-1 aspect-square h-3.5 border-1 border-black/25 dark:border-white/25 transition-transform active:scale-90 rounded-sm`}
                          onChange={handleTypeChange}
                          checked={type.includes(Type)}
                        />
                        <label htmlFor={Type} className="w-full">
                          {Type}
                        </label>
                      </span>
                    )
                  )}
                </div>
              )}

              {/* brand  */}
              {category[category1]?.subCategoryBrands && (
                <div className="p-3 border-t border-t-black/10 dark:border-t-white/10">
                  <h3 className="mb-1.5">Brand</h3>
                  {category[category1]?.subCategoryBrands[subCategory]?.map(
                    (Brand) => (
                      <span key={Brand} className="flex gap-1 items-center">
                        <input
                          type="checkbox"
                          id={Brand}
                          className={`${
                            brand.includes(Brand)
                              ? "scale-90"
                              : "appearance-none"
                          } relative right-1 aspect-square h-3.5 border-1 border-black/25 dark:border-white/25 transition-transform active:scale-90 rounded-sm`}
                          onChange={handleBrandChange}
                          checked={brand.includes(Brand)}
                        />
                        <label htmlFor={Brand} className="w-full">
                          {Brand}
                        </label>
                      </span>
                    )
                  )}
                </div>
              )}
            </section>

            {/* siderbar mobile */}
            <div
              className={`${
                showMobileFilters ? "fixed" : "hidden"
              } bottom-0 z-10`}
            >
              <section className="grid grid-cols-2 w-screen min-h-[80vh] bg-blue-100/50 dark:bg-gray-900 px-3">
                <div className="col-span-2">
                  {/* Reset Button */}
                  <div className="my-3 pr-1 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <h2 className=" font-semibold">Filter</h2>
                      <button
                        className="text-blue-500 hover:bg-white/5 border border-white/10 px-1 rounded"
                        onClick={resetFilters}
                      >
                        Reset ↻
                      </button>
                    </div>
                    <button onClick={toggleMobileFilters}>
                      <X />
                    </button>
                  </div>
                </div>

                {/* order */}
                <div className="p-3 border-t border-t-black/10 dark:border-t-white/10">
                  <h3 className="mb-1">Order</h3>
                  <span className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      id="ascending"
                      className={`${
                        order === "ascending" ? "scale-90" : "appearance-none"
                      } relative right-1 aspect-square h-3.5 border-1 border-black/25 dark:border-white/25 transition-transform active:scale-90 rounded-sm`}
                      checked={order === "ascending"}
                      onChange={() => handleSortChange("ascending")}
                    />
                    <label
                      htmlFor="ascending"
                      className="w-full flex gap-1 items-end"
                    >
                      Ascending <ArrowUpAZ size="20" />
                    </label>
                  </span>
                  <span className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      id="descending"
                      className={`${
                        order === "descending" ? "scale-90" : "appearance-none"
                      } relative right-1 aspect-square h-3.5 border-1 border-black/25 dark:border-white/25 transition-transform active:scale-90 rounded-sm`}
                      checked={order === "descending"}
                      onChange={() => handleSortChange("descending")}
                    />
                    <label
                      htmlFor="descending"
                      className="w-full flex gap-1 items-end"
                    >
                      Descending <ArrowDownAZ size="20" />
                    </label>
                  </span>
                </div>

                {/* sort by */}
                <div className="p-3 border-t border-t-black/10 dark:border-t-white/10">
                  <h3 className="mb-1">Sort By</h3>
                  {["price", "ratings", "no. of reviews"].map((sort) => (
                    <span key={sort} className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        id={sort}
                        className={`${
                          sortBy.includes(sort) ? "scale-90" : "appearance-none"
                        } relative right-1 aspect-square h-3.5 border-1 border-black/25 dark:border-white/25 transition-transform active:scale-90 rounded-sm`}
                        onChange={handleSortBy}
                        checked={sortBy.includes(sort)}
                      />
                      <label htmlFor={sort} className="w-full">
                        {sort}
                      </label>
                    </span>
                  ))}
                </div>

                {/* color */}
                <div className="col-span-2 p-3 border-t border-t-black/10 dark:border-t-white/10">
                  <h3 className="mb-1.5">Colour</h3>
                  <div className="flex gap-1 px-2">
                    {category["Men"]?.colours.map((colour) => {
                      const isSelected = color.includes(colour);
                      return (
                        <div
                          key={colour}
                          onClick={() => handleColorChange(colour)}
                          className={`cursor-pointer h-8 w-8 border-2 rounded-full flex flex-col justify-center items-center transition 
              ${isSelected ? "border-white" : "border-transparent"}`}
                        >
                          <span
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: colour }}
                          />
                          {colour === "Multi" && (
                            <img
                              draggable="false"
                              src="/images/multi.png"
                              className="w-6 h-6"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* type  */}
                <div className="p-3 border-t border-t-black/10 dark:border-t-white/10">
                  <h3 className="mb-1.5">Type</h3>
                  {category["Men"]?.subCategoryTypes[subCategory]?.map(
                    (Type) => (
                      <span key={Type} className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          id={Type}
                          className={`${
                            type.includes(Type) ? "scale-90" : "appearance-none"
                          } relative right-1 aspect-square h-3.5 border-1 border-black/25 dark:border-white/25 transition-transform active:scale-90 rounded-sm`}
                          onChange={handleTypeChange}
                          checked={type.includes(Type)}
                        />
                        <label htmlFor={Type} className="w-full">
                          {Type}
                        </label>
                      </span>
                    )
                  )}
                </div>

                {/* brand  */}
                <div className="p-3 border-t border-t-black/10 dark:border-t-white/10">
                  <h3 className="mb-1.5">Brand</h3>
                  {category["Men"]?.subCategoryBrands[subCategory]?.map(
                    (Brand) => (
                      <span key={Brand} className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          id={Brand}
                          className={`${
                            brand.includes(Brand)
                              ? "scale-90"
                              : "appearance-none"
                          } relative right-1 aspect-square h-3.5 border-1 border-black/25 dark:border-white/25 transition-transform active:scale-90 rounded-sm`}
                          onChange={handleBrandChange}
                          checked={brand.includes(Brand)}
                        />
                        <label htmlFor={Brand} className="w-full">
                          {Brand}
                        </label>
                      </span>
                    )
                  )}
                </div>
              </section>
            </div>

            <div className="w-full">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <div className="flex flex-wrap justify-center items-center gap-4 p-4 bg-gray-500/10 rounded-lg">
                    {/* Category Selector */}
                    <select
                      className="bg-gray-900 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={category1}
                      onChange={(e) => handleCategoryClick(e.target.value)}
                    >
                      {categories?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    {/* Subcategory Selector */}
                    {category1 && (
                      <select
                        name="subCategory"
                        value={subCategory}
                        onChange={(e) => handleSubCategoryClick(e.target.value)}
                        className="bg-gray-900 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All</option>
                        {data[category1]?.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Pagination */}
                    <div className="flex items-center gap-2 ml-auto text-sm text-white">
                      <span>
                        Page{" "}
                        <span className="text-blue-400 font-semibold">
                          {pages === 0 ? 0 : page}
                        </span>{" "}
                        of {pages}
                      </span>

                      {/* Prev Button */}
                      <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full 
        ${
          page === 1
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gray-700 hover:bg-gray-600"
        }`}
                      >
                        <svg width="16" height="16" fill="currentColor">
                          <use xlinkHref="/icons.svg#prev-icon" />
                        </svg>
                      </button>

                      {/* Next Button */}
                      <button
                        disabled={page === pages}
                        onClick={() => setPage(page + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full 
        ${
          page === pages
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gray-700 hover:bg-gray-600"
        }`}
                      >
                        <svg width="16" height="16" fill="currentColor">
                          <use xlinkHref="/icons.svg#next-icon" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {productsList && productsList.length !== 0 ? (
                    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-3">
                      {productsList?.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </ul>
                  ) : (
                    <div className="m-1 p-10 border border-white/10 rounded flex flex-col md:flex-row items-center justify-center">
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
                        <p className="text-lg">
                          You haven't added products here...
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerStore;
