import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import axios from "axios";
import CategoryNavbar from "../layout/CategoryNavbar";
import { category } from "../data/products.js";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../store/slices/categorySlice.js";
import { ArrowUpAZ, ArrowDownAZ, X, Funnel } from "lucide-react";
import FilterTag from "../components/FilterTag.jsx";

const limit = import.meta.env.VITE_PAGE_LIMIT || 10;

const Women = () => {
  const url =
    "https://res.cloudinary.com/dsror8r39/image/upload/v1742750135/trendz/pages/category/Women/";

  const banner =
    "https://res.cloudinary.com/dsror8r39/image/upload/v1742750135/trendz/static/category-banners/women-section";

  const { subCategory1 } = useParams();
  const { type1 } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCategory("Women"));
  }, []);

  const [productsList, setProductsList] = useState([]);
  const [order, setOrder] = useState("");
  const [color, setColor] = useState([]);
  const [brand, setBrand] = useState([]);
  const [type, setType] = useState([]);
  const [subCategory, setSubCategory] = useState("");
  const [sortBy, setSortBy] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const BACKEND_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (subCategory1) {
      setSubCategory(subCategory1);
    } else {
      setSubCategory("All");
    }
  }, [subCategory1]);

  useEffect(() => {
    if (type1) {
      setType([type1]);
    }
  }, [type1]);

  useEffect(() => {
    if (subCategory) {
      fetchProducts();
    }
  }, [order, color, brand, type, subCategory, sortBy, page, searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("category", "Women");
      if (order) params.append("order", order);
      if (color.length) params.append("color", color.join(","));
      if (brand.length) params.append("brand", brand.join(","));
      if (type.length) params.append("type", type.join(","));
      if (subCategory) params.append("subCategory", subCategory);

      if (sortBy.length) params.append("sortBy", sortBy.join(","));
      params.append("page", page);
      params.append("limit", limit);

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
      // toast.error(error.message);
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

  const handleSubCategoryClick = (category) => {
    setSubCategory(category);
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
    setSubCategory("All");
    setSortBy([]);
    setSearchParams({});
  };

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleMobileFilters = () => {
    setShowMobileFilters((prev) => !prev);
  };

  return (
    <>
      <CategoryNavbar />
      <div className="bg-blue-50 dark:bg-gray-950/80 text-gray-700 dark:text-gray-300">
        <img draggable="false" loading="lazy" src={banner} />
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
                {category["Women"]?.colours.map((colour) => {
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
              {category["Women"]?.subCategoryTypes[subCategory]?.map((Type) => (
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
              ))}
            </div>

            {/* brand  */}
            <div className="p-3 border-t border-t-black/10 dark:border-t-white/10">
              <h3 className="mb-1.5">Brand</h3>
              {category["Women"]?.subCategoryBrands[subCategory]?.map(
                (Brand) => (
                  <span key={Brand} className="flex gap-1 items-center">
                    <input
                      type="checkbox"
                      id={Brand}
                      className={`${
                        brand.includes(Brand) ? "scale-90" : "appearance-none"
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
                  {category["Women"]?.colours.map((colour) => {
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
                {category["Women"]?.subCategoryTypes[subCategory]?.map(
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
                {category["Women"]?.subCategoryBrands[subCategory]?.map(
                  (Brand) => (
                    <span key={Brand} className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        id={Brand}
                        className={`${
                          brand.includes(Brand) ? "scale-90" : "appearance-none"
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

          <div className="overflow-x-hidden px-1 md:px-5">
            <div className="mt-5 mb-6 flex gap-3 md:gap-6 lg:gap-10 overflow-x-scroll hide-x-scrollbar">
              {category["Women"]?.subCategories.map((category, index) => (
                <button
                  key={category}
                  className="flex flex-col items-center aspect-square"
                  onClick={() => handleSubCategoryClick(category)}
                >
                  <div
                    className={`${
                      subCategory === category
                        ? "border-b-pink-500/80 bg-pink-500/25"
                        : "border-b-transparent bg-pink-500/15"
                    } p-3.5 rounded-full border-b-3`}
                  >
                    <img
                      draggable="false"
                      loading="lazy"
                      src={`${url}${category}.png`}
                      alt={category}
                      className="min-w-15 max-w-15 md:min-w-17 md:max-w-17 aspect-square"
                    />
                  </div>
                  <p className="text-xs mt-1">{category}</p>
                </button>
              ))}
              <div className="flex items-center justify-center gap-1.5">
                <span>
                  {" "}
                  page{" "}
                  <span className="text-blue-500">
                    {pages === 0 ? 0 : page}
                  </span>{" "}
                  of {pages}{" "}
                </span>
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="aspect-square w-6 h-6 rounded-full
                     bg-black/10 hover:bg-black/20
                      dark:bg-white/10 dark:hover:bg-white/15
                      flex justify-center items-center"
                >
                  <svg width="22" height="22">
                    <use xlinkHref="/icons.svg#prev-icon" />
                  </svg>
                </button>

                <button
                  disabled={page === pages}
                  onClick={() => setPage(page + 1)}
                  className="aspect-square w-6 h-6 rounded-full
                     bg-black/10 hover:bg-black/20
                      dark:bg-white/10 dark:hover:bg-white/15
                      flex justify-center items-center"
                >
                  <svg width="22" height="22">
                    <use xlinkHref="/icons.svg#next-icon" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Selected Filters */}
            {(order ||
              color.length ||
              brand.length ||
              type.length ||
              sortBy.length) > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 py-2 border-gray-200 dark:border-white/10">
                {/* Order */}
                {order && (
                  <FilterTag
                    color={"bg-blue-500/15 text-blue-500"}
                    label={order}
                    onRemove={() => setOrder("")}
                  />
                )}

                {/* Color */}
                {color.map((c) => (
                  <FilterTag
                    color={"bg-pink-500/15 text-pink-500"}
                    key={c}
                    label={c}
                    onRemove={() => handleColorChange(c)}
                  />
                ))}

                {/* Brand */}
                {brand.map((b) => (
                  <FilterTag
                    color={"bg-blue-500/15 text-blue-500"}
                    key={b}
                    label={b}
                    onRemove={() =>
                      setBrand((prev) => prev.filter((item) => item !== b))
                    }
                  />
                ))}

                {/* Type */}
                {type.map((t) => (
                  <FilterTag
                    color={"bg-green-500/15 text-green-500"}
                    key={t}
                    label={t}
                    onRemove={() =>
                      setType((prev) => prev.filter((item) => item !== t))
                    }
                  />
                ))}

                {/* Sort By */}
                {sortBy.map((s) => (
                  <FilterTag
                    color={"bg-purple-500/15 text-purple-500"}
                    key={s}
                    label={s}
                    onRemove={() =>
                      setSortBy((prev) => prev.filter((item) => item !== s))
                    }
                  />
                ))}
              </div>
            )}

            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {productsList && productsList.length !== 0 ? (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3.5">
                    {productsList?.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
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
                      <p className="text-lg">Product not found...</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Women;
