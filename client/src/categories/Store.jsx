import CategoryNavbar from "../layout/CategoryNavbar";
import Slider from "../layout/Slider";
import Offers from "../components/Offers";
import Footer from "../layout/Footer";
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

const Store = () => {
  const banner =
    "https://res.cloudinary.com/dsror8r39/image/upload/v1742750135/trendz/static/all/collection-banners";

  const [card0, setCard0] = useState([]);
  const [card1, setCard1] = useState([]);
  const [card2, setCard2] = useState([]);
  const [card3, setCard3] = useState([]);
  const [card4, setCard4] = useState([]);
  const [card5, setCard5] = useState([]);
  const [card6, setCard6] = useState([]);
  const [card7, setCard7] = useState([]);

  const cards = [card0, card1, card2, card3, card4, card5, card6, card7];

  const productsIds = [
    [
      "67e8fd587090e3ff6167d250",
      "67e8fd587090e3ff6167d24a",
      "67e8fd4c7090e3ff6167d20b",
      "67e8fd587090e3ff6167d23a",
    ],
    [
      "67e6e20674ecf5e790a5b402",
      "67e6e24274ecf5e790a5b419",
      "67e6c24cfdc214c7c35f3ce3",
      "67e6c4822b8b46498e5c8dee",
    ],
    [
      "67e6e28274ecf5e790a5b582",
      "67e6e2c874ecf5e790a5b5e1",
      "67e6e2c874ecf5e790a5b5e3",
      "67e6e28274ecf5e790a5b591",
    ],
    [
      "67e6e27374ecf5e790a5b4d4",
      "67e6e27b74ecf5e790a5b510",
      "67e6e27b74ecf5e790a5b4ee",
      "67e6e27374ecf5e790a5b4dc",
    ],
    [
      "67e6e2cf74ecf5e790a5b5f9",
      "67e8fda47090e3ff6167d285",
      "67e8fd947090e3ff6167d270",
      "67e8fda47090e3ff6167d27c",
    ],
    [
      "67e6e27b74ecf5e790a5b52a",
      "67e6e27374ecf5e790a5b4d1",
      "67e6e27b74ecf5e790a5b536",
      "67e6e27b74ecf5e790a5b535",
    ],
    [
      "67e8fe367090e3ff6167d2e7",
      "67e8fe367090e3ff6167d2b2",
      "67e8fe367090e3ff6167d2ef",
      "67e8fe367090e3ff6167d2ea",
    ],
    [
      "67e6e26b74ecf5e790a5b463",
      "67e6e27374ecf5e790a5b487",
      "67e6e27374ecf5e790a5b495",
      "67e6e27374ecf5e790a5b493",
    ],
  ];

  const productsData = [
    { heading: "Best in men category" },
    { heading: "Women's Fashion" },
    { heading: "Heading 3" },
    { heading: "Heading 4" },
    { heading: "Heading 5" },
    { heading: "Heading 6" },
    { heading: "Heading 7" },
    { heading: "Heading 8" },
  ];

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
          <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 py-3 px-5">
            {productsData?.map((product, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-800 p-3">
                <h3 className="mb-2">{product.heading}</h3>
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
                <a>see more</a>
              </div>
            ))}
          </div>

          <div className="overflow-hidden pt-15 px-5 md:pl-0 md:pr-20 max-w-screen">
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
                  className="absolute bottom-0 h-55 md:h-60 lg:h-65 -right-32 hover:scale-105 transition-transform"
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
                  className="absolute bottom-0 h-55 md:h-60 lg:h-65 -right-21 md:-right-27 hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>
        </main>
        <Offers />
        <Footer />
        <h2>out top brands</h2>
      </div>
    </>
  );
};

export default Store;
