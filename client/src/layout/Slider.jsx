import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Slider = () => {
  const url =
    "https://res.cloudinary.com/dsror8r39/image/upload/v1742750135/trendz/static/all/banners/banner";

  const images = [
    `${url}1`,
    `${url}2`,
    `${url}3`,
    `${url}4`,
    `${url}5`,
    `${url}6`,
    `${url}7`,
    `${url}8`,
  ];

  const imageStyles = [
    "h-[35vh] md:h-auto md:w-[50vh]",
    "h-[40vh] w-[40vh] md:w-[50vh] md:h-[50vh]",
    "h-[38vh] w-[40vh] md:h-[50vh] md:w-[50vh]",
    "h-[39vh] w-[44vh] md:h-[50vh] md:w-[60vh]",
    "h-[40vh] w-[40vh] md:h-[50vh] md:w-[50vh]",
    "h-[35vh] w-[40vh] md:h-[50vh] md:w-[50vh]",
    "h-[40vh] w-[50vh] md:h-[50vh] md:w-[50vh]",
    "h-[36vh] w-[36vh] md:h-[50vh] md:w-[50vh]",
  ];

  const colours = [
    "bg-gradient-to-br dark:from-[#13111a] dark:to-[#5a4f75] from-[#ffffff] to-[#ddcffc]",
    "bg-gradient-to-br dark:from-gray-950 dark:to-gray-700 from-white to-blue-200",
    "bg-gradient-to-br dark:from-gray-900 dark:to-gray-600 from-pink-100 to-yellow-50",
    "bg-gradient-to-br dark:from-slate-950 dark:to-gray-600 from-white to-orange-100",
    "bg-gradient-to-br dark:from-slate-950 dark:to-[#483025] from-white to-[#ffe5d4]",
    "bg-gradient-to-bl dark:from-slate-950 dark:to-sky-950 from-white to-rose-200",
    "bg-gradient-to-b dark:from-[#e1f2fa] dark:to-[#f5fafb] from-[#e1f2fa] to-[#f5fafb]",
    "bg-gradient-to-br dark:from-gray-950 dark:to-[#9f056b] from-white to-pink-300",
  ];
  const textStyles = [
    [
      "text-[#a894d6] dark:text-[#736396] text-5xl md:text-7xl font-bold",
      "text-[#72658f] dark:text-[#d1bdff] font-semibold dark:font-normal mx-5 md:mx-0",
    ],
    [
      "text-blue-400/80 dark:text-blue-500/50 text-5xl md:text-7xl font-bold",
      "text-blue-900 dark:text-gray-300 font-semibold dark:font-normal mx-5 md:mx-0",
    ],
    [
      "text-orange-400/45 dark:text-orange-300/55 text-4xl md:text-6xl font-bold",
      "text-gray-500 dark:text-gray-300/80 font-semibold dark:font-normal mx-5 md:mx-0",
    ],
    [
      "text-orange-300 dark:text-orange-200/60 text-4xl md:text-6xl font-bold",
      "text-gray-600 dark:text-gray-300 font-semibold dark:font-normal mx-5 md:mx-0",
    ],
    [
      "text-yellow-700/70 dark:text-yellow-600/50 text-4xl md:text-6xl font-bold",
      "text-[#6c4029] dark:text-[#bfb5aa] font-semibold dark:font-normal mx-5 md:mx-0",
    ],
    [
      "text-cyan-500/80 dark:text-cyan-400/50 text-3xl md:text-6xl font-bold",
      "text-sky-800 dark:text-yellow-100/70 font-semibold dark:font-normal mx-5 md:mx-0",
    ],
    [
      "text-blue-500/80 text-4xl md:text-5xl font-bold mx-5 md:mx-0",
      "text-blue-900 font-semibold dark:font-normal mx-5 md:mx-0",
    ],
    [
      "text-[#d154b0] dark:text-[#a62e87] text-3xl md:text-5xl font-bold",
      "text-gray-600 dark:text-gray-300 font-semibold dark:font-normal mx-5 md:mx-0",
    ],
  ];
  const buttonStyles = [
    "bg-[#a894d6] dark:bg-[#736396]",
    "bg-blue-400/80 dark:bg-blue-500/50",
    "bg-orange-400/45 dark:bg-orange-300/55",
    "bg-orange-300 dark:bg-orange-200/60",
    "bg-yellow-700/70 dark:bg-yellow-600/50",
    "bg-cyan-500/80 dark:bg-cyan-400/50",
    "bg-blue-500/80",
    "bg-[#d154b0] dark:bg-[#a62e87]",
  ];
  const text = [
    [
      "Exclusive Deals",
      "✿ Limited Time Offer! Up to 50% Off on Women's Fashion",
    ],
    [
      "Effortless Style",
      "» From laid-back tees to stylish joggers, find everything you need for a relaxed, trendy look.",
    ],
    [
      "New Arrivals Are Here!",
      "Discover the latest trends in fashion & tech Exclusive styles, fresh collections, and top picks Shop now before they sell out!",
    ],
    [
      "Toys That Spark Joy!",
      "✦ Educational, fun, and engaging toys Top brands for every age group Make playtime extra special!",
    ],
    [
      "Power Up Your Home!",
      "✦ Smart appliances for a smarter life Top brands at unbeatable prices Upgrade today with easy EMIs!",
    ],
    [
      "Shop Smart, Save More!",
      "» Exclusive discounts for our loyal customers Get extra rewards on every purchase Sign up now for amazing deals!",
    ],
    [
      "Upgrade Your Tech Game!",
      "⬩ Latest gadgets, best prices Smartphones, laptops, accessories & more Shop now and stay ahead!",
    ],
    [
      "Glow Like Never Before!",
      "✿ Premium beauty & skincare products Trending shades, flawless finishes Shop now & get exclusive offers!",
    ],
  ];

  const links = [
    "/store/Women",
    "/store/Men",
    "/store/Women",
    "/store/Kids",
    "/store/Home-furniture",
    "/store/Electronics/Tablets",
    "/store/Electronics",
    "/store/Beauty/Makeup",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="relative w-full h-[60vh] md:h-[50vh] overflow-hidden">
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`flex-shrink-0 md:flex h-[60vh] 
              md:flex-row md:h-[50vh] md:justify-evenly
              w-full ${colours[index]} ${
                index % 2 ? "md:flex-row-reverse" : ""
              } `}
            >
              <div
                className="flex flex-col justify-center gap-5 w-[100vw] h-[25vh] text-center 
                md:text-left md:h-[50vh] md:w-[60vh]"
              >
                <p className={textStyles[index][0]}>{text[index][0]}</p>
                <p className={`tracking-[1px] ${textStyles[index][1]}`}>
                  {text[index][1]}
                </p>
                <NavLink
                  target="_blank"
                  to={links[index]}
                  className={`${buttonStyles[index]} text-white text-sm self-center md:self-start w-22 rounded px-2 text-center`}
                >
                  Shop Now
                </NavLink>
              </div>
              <img
                draggable="false"
                loading="lazy"
                src={image}
                alt={`Slide ${index + 1}`}
                className={`mx-auto md:mx-0 ${imageStyles[index]}`}
              />
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <div className="flex items-center gap-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`rounded-full ${
                  currentIndex === index
                    ? "bg-white w-3.5 h-3.5"
                    : "bg-gray-400 w-2 h-2"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Slider;
