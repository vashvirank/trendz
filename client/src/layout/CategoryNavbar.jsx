import React, { useEffect, useRef, useState } from "react";
import { categories, category } from "../data/products.js";
import { colours } from "../data/colours.js";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../store/slices/categorySlice.js";

const CategoryNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedTab = useSelector((state) => state.category.selectedCategory);

  const handleCategoryChange = (cat) => {
    dispatch(setCategory(cat));
  };

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const [hoverCategory, setHoverCategory] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <nav
        ref={menuRef}
        className="
            bg-blue-100 text-gray-700
            dark:bg-gradient-to-r dark:from-gray-900 dark:to-sky-950 dark:text-gray-300"
      >
        <div className="md:hidden">
          {isMenuOpen ? (
            <button
              onClick={() => setIsMenuOpen(false)}
              className="px-1 focus:outline-none text-gray-300 hover:text-white flex items-center"
            >
              categories
              <svg width="20" height="20">
                <use xlinkHref="/icons.svg#down-icon" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setIsMenuOpen(true)}
              className="px-1 pb-1 focus:outline-none text-gray-300 hover:text-white flex items-center"
            >
              categories
              <svg width="20" height="20">
                <use xlinkHref="/icons.svg#next-icon" />
              </svg>
            </button>
          )}
        </div>

        {/* mobile menu */}
        {isMenuOpen && (
          <ul className="absolute z-1 rounded-b md:hidden p-2.5 flex flex-col bg-gray-800/70 backdrop-blur-[8px]">
            {categories?.map((category) => (
              <div
                key={category}
                onMouseEnter={() => setHoverCategory(category)}
                onMouseLeave={() => setHoverCategory("")}
                className="relative h-[100%]"
              >
                <NavLink
                  draggable="false"
                  to={`/store/${category}`}
                  onClick={() => setSelectedTab(category)}
                  className={`${
                    selectedTab === category
                      ? `bg-${colours[category]}/10 border-b-${colours[category]} text-${colours[category]}`
                      : colours[category]
                  }  hover:bg-${
                    colours[category]
                  }/10 h-[100%] border-0 border-b-2 border-transparent md:text-sm lg:text-base flex items-center`}
                >
                  {category}
                </NavLink>
              </div>
            ))}
            <p className="flex flex-row items-center">
              <svg width="20" height="24">
                <use xlinkHref="/icons.svg#location-icon" fill="gray"></use>
              </svg>
              <span>india</span>
            </p>
            {!user && (
              <>
                <NavLink draggable="false" to="/login">
                  Login▼
                </NavLink>
                <span>Become seller</span>
              </>
            )}
            {user && (
              <button onClick={handleLogout} className="text-red-500">
                Logout
              </button>
            )}
          </ul>
        )}

        {/* desktop menu */}
        <ul className="h-9 hidden md:flex flex-col md:flex-row items-center md:justify-between lg:justify-start lg:gap-x-0.5 lg:text-base">
          {categories?.map((cat, index) => (
            <div
              key={cat}
              onMouseEnter={() => setHoverCategory(cat)}
              onMouseLeave={() => setHoverCategory("")}
              className="relative h-[100%]"
            >
              <NavLink
                draggable="false"
                to={`/store/${cat}`}
                onClick={() => handleCategoryChange(cat)}
                className={`h-[100%] px-2.5 lg:px-3.5 border-0 border-b-2 border-transparent md:text-sm lg:text-base flex items-center
                ${
                  selectedTab === cat
                    ? `${colours[cat]?.primary}`
                    : `hover:${colours[cat]?.secondary}`
                }`}
              >
                {cat}
              </NavLink>
              {hoverCategory === cat && (
                <div
                  className={`absolute z-10 ${
                    index > 5 ? "md:right-0 lg:left-0" : "left-0"
                  } top-9 text-gray-400`}
                >
                  <div className="bg-gray-800 grid grid-cols-3 w-120 rounded-lg p-3">
                    {category[cat]?.subCategories?.map((subCategory) => (
                      <div
                        key={subCategory}
                        className="flex flex-col p-2 border rounded-lg border-white/5"
                      >
                        <NavLink
                          draggable="false"
                          to={`/store/${cat}/${subCategory}`}
                          className="hover:text-blue-300 text-left cursor-pointer text-gray-300 font-semibold"
                        >
                          {subCategory}
                        </NavLink>
                        {category[cat]?.subCategoryTypes[subCategory]?.map(
                          (item, index) => (
                            <NavLink
                              draggable="false"
                              to={`/store/${cat}/${subCategory}/${item}`}
                              key={index}
                              className="hover:text-blue-300 text-left cursor-pointer"
                            >
                              {item}
                            </NavLink>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default CategoryNavbar;
