import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchedProducts } from "../store/slices/productSlice";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const limit = import.meta.env.VITE_PAGE_LIMIT || 10;

const SearchProducts = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const query = new URLSearchParams(location.search).get("query");
  const { products, loading, error, message } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (query.trim()) {
      dispatch(fetchSearchedProducts(query));
    }
  }, [query]);

  useEffect(() => {
    console.log("products🙂:", products);
  }, [dispatch, products]);

  return (
    <div className="bg-gray-200 min-h-[90vh] p-5 dark:bg-gray-950 text-gray-600 dark:text-gray-300">
      <h2 className="text-lg text-center font-semibold">
        Showing results for "{query}"
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {products && products.length !== 0 ? (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {products?.map((product) => (
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
                <p className="text-red-500 font-semibold text-5xl m-2">OOPS!</p>
                <p className="text-lg">Product not found...</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5">
            <span>
              {" "}
              page{" "}
              <span className="text-blue-500">
                {pages === 0 ? 0 : page}
              </span> of {pages}{" "}
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
  );
};

export default SearchProducts;
