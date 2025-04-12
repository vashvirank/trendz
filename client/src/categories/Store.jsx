import CategoryNavbar from "../layout/CategoryNavbar";
import Slider from "../layout/Slider";
import Offers from "../components/Offers";
import Footer from "../layout/Footer";
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import LogoSlider from "../components/LogoSlider";
import { setCategory } from "../store/slices/categorySlice.js";
import { useDispatch } from "react-redux";
import { productsIds, productsData } from "../data/cardData.js";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

const Store = () => {
  const banner =
    "https://res.cloudinary.com/dsror8r39/image/upload/v1742750135/trendz/static/all/collection-banners";

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCategory("All"));
  }, []);

  const [card0, setCard0] = useState([]);
  const [card1, setCard1] = useState([]);
  const [card2, setCard2] = useState([]);
  const [card3, setCard3] = useState([]);
  const [card4, setCard4] = useState([]);
  const [card5, setCard5] = useState([]);
  const [card6, setCard6] = useState([]);
  const [card7, setCard7] = useState([]);

  const cards = [card0, card1, card2, card3, card4, card5, card6, card7];

  const fetchProducts = async (ids, setCardN) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/product/get-multiple`, {
        ids,
      });
      setCardN(res.data.products);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchProducts(productsIds[0], setCard0);
    fetchProducts(productsIds[1], setCard1);
    fetchProducts(productsIds[2], setCard2);
    fetchProducts(productsIds[3], setCard3);
    fetchProducts(productsIds[4], setCard4);
    fetchProducts(productsIds[5], setCard5);
    fetchProducts(productsIds[6], setCard6);
    fetchProducts(productsIds[7], setCard7);
  }, []);

  return (
    <>
      <CategoryNavbar />
      <div className="bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        <Slider />
        <main>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 py-3 px-1 md:px-5">
            {productsData?.map((product, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3"
              >
                <h3 className="mb-2 text-lg font-semibold">
                  {product.heading}
                </h3>
                <div className="grid grid-cols-2 gap-[3%]">
                  {cards[index]?.map((card, ind) => (
                    <NavLink
                      key={ind}
                      draggable="false"
                      to={`/product/${card?._id}`}
                      className="rounded-lg"
                    >
                      <img
                        draggable="false"
                        loading="lazy"
                        src={card?.images[0]}
                        alt={`Product ${ind}`}
                        className="rounded-lg hover:scale-105 hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-white/10 transition-transform duration-90"
                      />
                    </NavLink>
                  ))}
                </div>
                <p className="mt-4 mb-2 md:text-sm text-gray-300/90">
                  {product.descrption}
                </p>
                <NavLink
                  target="_blank"
                  to={product.link}
                  className="text-sky-500 bg-sky-500/15 px-2 rounded"
                >
                  see more
                </NavLink>
              </div>
            ))}
          </div>

          <div className="overflow-hidden pt-15 px-2 md:px-5 md:pl-0 md:pr-20 max-w-screen">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-18 md:gap-30 justify-center text-gray-300">
              {/* women collection */}
              <div className="w-76 md:w-80 lg:w-84 mx-w-1/3 h-42 md:h-46 lg:h-50 bg-yellow-950/20  dark:bg-orange-200/15 rounded-xl flex relative">
                <div className="p-5">
                  <h2 className="text-yellow-950/60 dark:text-orange-200/60 text-2xl scale-y-150 font-bold">
                    NEW COLLECTION
                  </h2>
                  <p className="text-sm font-normal md:font-semibold text-yellow-950/45 dark:text-orange-200/55 md:scale-y-120 mt-4 mb-3 md:my-5">
                    Get 23% off on your orders
                  </p>
                  <NavLink
                    target="_blank"
                    to="/store/Women/Topwear"
                    draggable="false"
                    className="bg-yellow-950/50 dark:bg-orange-200/40 rounded-full py-1 px-3"
                  >
                    Shop now
                  </NavLink>
                </div>
                <img
                  draggable="false"
                  loading="lazy"
                  src={`${banner}/women-collection`}
                  className="absolute bottom-0 h-55 md:h-60 lg:h-65 -right-32 hover:scale-105 hover:brightness-110 hover:contrast-110 transition-transform"
                />
              </div>

              {/* men collection */}
              <div className="w-76 md:w-80 lg:w-84 mx-w-1/3 h-42 md:h-46 lg:h-50 bg-yellow-950/20 dark:bg-orange-200/15 rounded-xl flex relative">
                <div className="p-5">
                  <h2 className="text-yellow-950/60 dark:text-orange-200/60 text-2xl scale-y-150 font-bold">
                    NEW <br />
                    COLLECTION
                  </h2>
                  <p className="text-sm font-normal md:font-semibold text-yellow-950/45 dark:text-orange-200/55 md:scale-y-120 mt-4 mb-3 md:my-5">
                    Get 26% off on your orders
                  </p>
                  <NavLink
                    target="_blank"
                    to="/store/Men/Topwear"
                    draggable="false"
                    className="bg-yellow-950/50 dark:bg-orange-200/40 rounded-full py-1 px-3"
                  >
                    Shop now
                  </NavLink>
                </div>
                <img
                  draggable="false"
                  loading="lazy"
                  src={`${banner}/men-collection`}
                  className="absolute bottom-0 h-55 md:h-60 lg:h-65 -right-21 md:-right-27 hover:scale-105 hover:brightness-110 hover:contrast-110 transition-transform"
                />
              </div>
            </div>
          </div>
        </main>
        <Offers />
        <h2 className="text-center m-5 text-2xl">Our top brands</h2>
        <LogoSlider />
        <Footer />
      </div>
    </>
  );
};

export default Store;
