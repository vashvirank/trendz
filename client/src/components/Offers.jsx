import React, { useEffect, useState } from "react";
import { offers } from "../data/offersData";
import InfiniteSlider from "../layout/InfiniteSlider";
import { toast } from "react-toastify";
import axios from "axios";
import { NavLink } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

const Offers = () => {
  const [products, setProducts] = useState([]);
  const productsIds = [
    "67e8fd587090e3ff6167d261",
    "67e6e23c74ecf5e790a5b40c",
    "67e8fd587090e3ff6167d248",
    "67e8fd3c7090e3ff6167d200",
    "67e8fd587090e3ff6167d24d",
    "67e6e1fa74ecf5e790a5b3ec",
    "67e8fd587090e3ff6167d230",
    "67e6e26b74ecf5e790a5b42a",
    "67e8fd587090e3ff6167d242",
    "67e6e27b74ecf5e790a5b500",
    "67e8fe367090e3ff6167d2b8",
    "67e6e2c874ecf5e790a5b5ac",
    "67e8fe367090e3ff6167d2ff",
    "67e6e28274ecf5e790a5b591",
    "67e6e2c874ecf5e790a5b5e3",
    "67e8fe367090e3ff6167d2ef",
    "67e6e28274ecf5e790a5b582",
    "67e6e2c874ecf5e790a5b5a2",
    "67e8fe4c7090e3ff6167d317",
    "67e6e28274ecf5e790a5b550",
    "67e6e28274ecf5e790a5b580",
    "67e8fe367090e3ff6167d2fb",
    "67e6e28274ecf5e790a5b58a",
    "67e6e2c874ecf5e790a5b59e",
    "67e6e27374ecf5e790a5b4d2",
  ];
  const fetchProducts = async (ids) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/product/get-multiple`, {
        ids,
      });
      setProducts(res.data.products);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchProducts(productsIds);
  }, []);

  return (
    <>
      <div className="bg-gray-200 dark:bg-gray-900">
        <div className="py-3 px-1 md:px-5">
          <h2 className="text-center font-semibold text-2xl m-3">
            Best Sellers in fashion & beauty
          </h2>
          <div className="relative">
            <InfiniteSlider />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-1 justify-center">
          <div className="group w-[90%] md:w-2/5 aspect-[3/1] [perspective:1000px]">
            <div
              className="relative w-full h-full transition-transform duration-700 group-hover:[transform:rotateX(180deg)]"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateX(0deg)",
                  transition: "transform 0.7s",
                }}
              >
                <img
                  src="/images/coupon1.png"
                  alt="Front"
                  className="aspect-[3/1]"
                  draggable="false"
                  loading="lazy"
                />
              </div>
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  transform: "rotateX(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="relative w-full h-full p-1 flex items-center justify-center rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-500 -z-10 rounded-2xl absolute w-full scale-110 aspect-square animate-spin" />
                  <div className="bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center w-full h-full">
                    <p className="text-blue-800 dark:text-gray-200 scale-y-150 text-3xl font-semibold">
                      USE CODE 75
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group w-[90%] md:w-2/5 aspect-[3/1] [perspective:1000px]">
            <div
              className="relative w-full h-full transition-transform duration-700 group-hover:[transform:rotateX(180deg)]"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateX(0deg)",
                  transition: "transform 0.7s",
                }}
              >
                <img
                  src="/images/coupon2.png"
                  alt="Front"
                  className="aspect-[3/1]"
                  draggable="false"
                  loading="lazy"
                />
              </div>

              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  transform: "rotateX(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="relative w-full h-full p-1 flex items-center justify-center rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 -z-10 rounded-2xl absolute w-full scale-110 aspect-square animate-spin" />
                  <div className="bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center w-full h-full">
                    <p className="text-blue-800 dark:text-gray-200 scale-y-150 text-3xl font-semibold">
                      USE CODE 50
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-center m-5 text-4xl font-bold text-sky-700">
          TOP OFFERS
        </h2>

        <div className="px-5 md:px-10 lg:px-18 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {offers.map((offer, index) => (
            <div className="aspect-square" key={index}>
              <div className="w-full h-full group [perspective:1000px]">
                <div className="relative w-full h-full duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front Side */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-end p-2 bg-cover bg-center rounded text-white [backface-visibility:hidden]"
                    style={{
                      backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0)), url(${products[index]?.images[0]})`,
                    }}
                  >
                    <p className="text-sm text-white/70">{offer.title}</p>
                    <p className="font-bold text-xl text-white/80">
                      {offer.offer}
                    </p>
                    <NavLink
                      to={offer.link}
                      draggable="false"
                      className="text-sm text-blue-500 bg-blue-500/15 border border-blue-500/15 hover:bg-blue-500/20 rounded px-1"
                    >
                      Shop Now
                    </NavLink>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-2 bg-gradient-to-b from-blue-950 to-gray-950 rounded text-white [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <p className="text-blue-400">{offer.title}</p>
                    <p className="font-bold text-2xl text-white/80">
                      {offer.offer}
                    </p>
                    <NavLink
                      to={offer.link}
                      className="text-white bg-blue-500 hover:bg-blue-600 rounded py-1 px-3"
                    >
                      Shop Now
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Offers;
