import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import axios from "axios";
import { category, categories } from "../data/products.js";
import SellerNavbar from "../layout/SellerNavbar.jsx";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import { useSelector } from "react-redux";

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
  const [subCategory, setSubCategory] = useState("");
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
          <div className="flex">
            <section className="w-40 min-h-[100vh] bg-white/5 text-white/60">
              <div>
                {/* Reset Button */}
                <div className="my-3 flex justify-center items-center gap-2">
                  <h2 className=" font-semibold text-white/80">Filter</h2>
                  <button
                    className="text-blue-400 hover:bg-white/5 border border-white/10 px-1 rounded"
                    onClick={resetFilters}
                  >
                    Reset ↻
                  </button>
                </div>
              </div>
              <div className="p-3 border-t border-t-white/10">
                <h3 className="mb-1 text-white/90">Order</h3>
                <span className="flex items-center">
                  <input
                    type="checkbox"
                    id="ascending"
                    className="relative top-0.5 right-1"
                    checked={order === "ascending"}
                    onChange={() => handleSortChange("ascending")}
                  />
                  <label htmlFor="ascending" className="w-full">
                    Ascending ↑
                  </label>
                </span>
                <span className="flex items-center">
                  <input
                    type="checkbox"
                    id="descending"
                    className="relative top-0.5 right-1"
                    checked={order === "descending"}
                    onChange={() => handleSortChange("descending")}
                  />
                  <label htmlFor="descending" className="w-full">
                    Descending ↓
                  </label>
                </span>
              </div>

              {/* sort by */}
              <div className="p-3 border-t border-t-white/10">
                <h3 className="mb-1 text-white/90">Sort By</h3>
                {["price", "ratings", "no. of reviews"].map((sort) => (
                  <span key={sort} className="flex items-center">
                    <input
                      type="checkbox"
                      id={sort}
                      className="relative top-0.5 right-1"
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
              {category1 && (
                <div className="p-3 border-t border-t-white/10">
                  <h3 className="mb-2 text-white/90">Colour</h3>
                  <div className="grid grid-cols-3 px-2">
                    {category[category1]?.colours?.map((colour) => {
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
              )}

              {/* type  */}
              {category1 && subCategory && (
                <div className="p-3 border-t border-t-white/10">
                  <h3 className="mb-1.5 text-white/90">Type</h3>
                  {category[category1]?.subCategoryTypes[subCategory]?.map(
                    (Type) => (
                      <span key={Type} className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          id={Type}
                          className="relative top-0.5"
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
              {category1 && subCategory && (
                <div className="p-3 border-t border-t-white/10">
                  <h3 className="mb-1.5 text-white/90">Brand</h3>
                  {category[category1]?.subCategoryBrands[subCategory]?.map(
                    (Brand) => (
                      <span key={Brand} className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          id={Brand}
                          className="relative top-0.5"
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

            <div className="w-full">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <div className="">
                    <select
                      className="bg-gray-900"
                      value={category1}
                      onChange={(e) => handleCategoryClick(e.target.value)}
                    >
                      {categories?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {category1 && (
                      <select
                        name="subCategory"
                        value={subCategory}
                        onChange={(e) => handleSubCategoryClick(e.target.value)}
                        className="border p-1 rounded bg-gray-900"
                      >
                        <option value="">All</option>
                        {data[category1]?.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    )}
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
