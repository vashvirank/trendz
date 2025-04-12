import React from "react";

const LogoSlider = () => {
  const logos = [
    "/logos/apple.png",
    "/logos/chanel.png",
    "/logos/dior.png",
    "/logos/dove.png",
    "/logos/garnier.png",
    "/logos/gucci.png",
    "/logos/nike.png",
    "/logos/h&m.png",
    "/logos/nivea.png",
    "/logos/himalaya.png",
    "/logos/samsung.png",
    "/logos/versace.png",
    "/logos/zara.png",
  ];
  let colors = [
    "bg-blue-900/10 dark:bg-blue-950/60",
    "bg-green-600/10 dark:bg-green-600/40",
    "bg-gray-800/10 dark:bg-gray-300/80",
    "bg-blue-500/10 dark:bg-blue-500/20",
    "bg-green-600/10 dark:bg-green-400/15",
    "bg-yellow-500/10 dark:bg-yellow-500/20",
    "bg-purple-500/10 dark:bg-purple-500/15",
    "bg-red-500/10 dark:bg-red-500/15",
    "bg-blue-500/10 dark:bg-blue-950/80",
    "bg-orange-500/10 dark:bg-orange-500/10",
    "bg-blue-700/15 dark:bg-blue-700/25",
    "bg-yellow-500/10 dark:bg-yellow-500/20",
    "bg-gray-800/10 dark:bg-gray-100/80",
  ];
  const repeatedLogos = [...logos, ...logos];
  colors = [...colors, ...colors];
  return (
    <div className="relative overflow-hidden mx-1 md:mx-5 py-2 -mb-8">
      {/* Inline animation with responsive speed */}
      <style>
        {`
          @keyframes scroll-slow {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-fast {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .scrolling-desktop {
            animation: scroll-slow 25s linear infinite;
          }

          .scrolling-mobile {
            animation: scroll-fast 20s linear infinite;
          }

          .group:hover .scrolling-desktop,
          .group:hover .scrolling-mobile {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="group">
        {/* Desktop */}
        <div className="hidden sm:flex w-max scrolling-desktop">
          {repeatedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center px-2 h-16"
            >
              <img
                draggable="false"
                loading="lazy"
                src={logo}
                alt={`logo-${index}`}
                className={`${colors[index]} h-full w-auto brightness-110 contrast-110 rounded-lg p-3 opacity-90 hover:scale-110 hover:opacity-100 transition duration-250`}
              />
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="flex sm:hidden w-max scrolling-mobile">
          {repeatedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center px-2 h-14"
            >
              <img
                draggable="false"
                loading="lazy"
                src={logo}
                alt={`logo-${index}`}
                className={`${colors[index]} h-full w-auto brightness-110 contrast-110 rounded-lg p-3`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSlider;
