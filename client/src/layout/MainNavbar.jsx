import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../components/SeachBar";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronDown, MapPin, Heart, ShoppingCart, User } from "lucide-react";

const MainNavbar = () => {
  const url =
    "https://res.cloudinary.com/dsror8r39/image/upload/v1742750135/trendz/static";

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const [loginButtonHover, setLoginButtonHover] = useState(false);
  const [loginRequest, setLoginRequest] = useState(true);
  const loginButtonRef = useRef(null);
  const [profileButtonHover, setProfileButtonHover] = useState(false);

  useEffect(() => {
    if (!loginRequest) return;

    const handleClickOutside = (event) => {
      if (
        loginButtonRef.current &&
        !loginButtonRef.current.contains(event.target)
      ) {
        setLoginRequest(false);
      }
    };

    const handleScroll = () => {
      setLoginRequest(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loginRequest]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme !== "dark" && storedTheme !== "light") {
      return "dark";
    }
    return storedTheme;
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <nav
        className="h-14 flex items-center px-1.5 md:px-5
          bg-blue-50 text-gray-700
          dark:bg-gradient-to-r dark:from-slate-950 dark:to-sky-950 dark:text-gray-300 gap-6"
      >
        <NavLink
          draggable="false"
          to="/"
          onClick={() => setSelectedTab("Home")}
          className="flex justify-center items-center"
        >
          <img
            draggable="false"
            loading="lazy"
            src={`${url}/trendz-logo.png`}
            className="hidden md:block h-6 min-w-22 dark:brightness-125 dark:contrast-125"
          />
          <img
            draggable="false"
            loading="lazy"
            src={`/images/bag-logo1.png`}
            className="h-10 min-w-10 md:hidden bg-blue-400/15 rounded-lg p-0.5"
          />
        </NavLink>
        {user?.role !== "admin" && user?.role !== "seller" && (
          <NavLink
            draggable="false"
            to="/select-location"
            className="hidden md:flex flex-col items-center group"
          >
            <MapPin
              size={20}
              className="group-hover:fill-gray-700 dark:group-hover:fill-gray-300 transition-all duration-200"
            />
            <span className="text-sm">india</span>
          </NavLink>
        )}
        <SearchBar />
        {user && user?.role === "customer" && (
          <>
            <NavLink
              draggable="false"
              to="/my-orders"
              className="hidden md:flex flex-col items-start min-w-17"
            >
              <span className="text-sm">Returns </span>
              <span>& Orders</span>
            </NavLink>
            <NavLink
              draggable="false"
              to="/wish-list"
              className="hidden md:flex flex-col items-center group"
            >
              <Heart
                size={20}
                className="group-hover:fill-gray-700 dark:group-hover:fill-gray-300 transition-all duration-200"
              />
              <span className="text-sm">wishlist</span>
            </NavLink>

            <NavLink
              draggable="false"
              to="/cart"
              className="hidden md:flex flex-col items-center group"
            >
              <ShoppingCart
                size={20}
                className="group-hover:fill-gray-700 dark:group-hover:fill-gray-300 transition-all duration-200"
              />
              <span className="text-sm">cart</span>
            </NavLink>
          </>
        )}

        {/* login button */}
        {!user && (
          <>
            <div
              className="hidden md:block relative"
              onMouseEnter={() => setLoginButtonHover(true)}
              onMouseLeave={() => setLoginButtonHover(false)}
            >
              <NavLink draggable="false" to="/login" className="flex items-end">
                Login <ChevronDown size={20} />
              </NavLink>
              {loginButtonHover && (
                <div className="z-10 absolute rounded w-44 px-3 py-4 bg-gray-700 flex flex-col gap-2">
                  <p className="flex flex-col gap-3">
                    <span>New to TrendZ?</span>
                    <NavLink
                      draggable="false"
                      to="/register"
                      className="py-1 px-3 text-center bg-blue-500 hover:bg-blue-600 hover:scale-95 transition-transform rounded"
                    >
                      Register
                    </NavLink>
                  </p>
                </div>
              )}
              {loginRequest && (
                <div
                  ref={loginButtonRef}
                  className="z-10 top-10 absolute text-center"
                >
                  <div className="relative p-2 rounded w-20 bg-blue-600 text-center text-white">
                    Login
                    <span className="absolute -top-4.5 left-9 text-blue-600">
                      ▲
                    </span>
                  </div>
                </div>
              )}
            </div>
            <NavLink to="/seller-register" className="hidden md:block min-w-26">
              Become seller
            </NavLink>
          </>
        )}

        {/* dark/light theme button */}
        <button
          onClick={() =>
            setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"))
          }
          className="-mr-4.5 md:-mr-0 cursor-pointer flex items-center bg-blue-800/30 dark:bg-blue-500/12 rounded-full p-0.5 transition-all duration-300 ease-in-out"
        >
          <svg
            width={`${theme === "light" ? 22 : 15}`}
            height={`${theme === "light" ? 22 : 15}`}
            className={`p-0.5 rounded-full transition-all duration-300 ease-in-out transform ${
              theme === "light"
                ? "bg-blue-800/50 text-white scale-100 opacity-100"
                : "text-white/40 scale-60 opacity-0"
            }`}
          >
            <use xlinkHref="icons.svg#sun-icon"></use>
          </svg>
          <svg
            width={`${theme === "dark" ? 22 : 15}`}
            height={`${theme === "dark" ? 22 : 15}`}
            className={`p-0.5 rounded-full transition-all duration-300 ease-in-out transform ${
              theme === "dark"
                ? "bg-blue-500/30 text-white scale-100 opacity-100"
                : "text-white/90 scale-60 opacity-0"
            }`}
          >
            <use xlinkHref="icons.svg#moon-icon"></use>
          </svg>
        </button>

        {/* profile button */}
        <div
          className="relative"
          onMouseEnter={() => setProfileButtonHover(true)}
          onMouseLeave={() => setProfileButtonHover(false)}
        >
          <NavLink
            draggable="false"
            to="/profile"
            className="flex flex-col items-center group"
          >
            <User
              size={20}
              className="group-hover:fill-gray-700 dark:group-hover:fill-gray-300 transition-all duration-200"
            />
            <span className="text-sm">profile</span>
          </NavLink>
          {profileButtonHover &&
            (user ? (
              <div className="z-10 absolute w-28 -right-5 p-2 rounded bg-gray-800 flex flex-col gap-y-2">
                <NavLink draggable="false" to="/profile" className="text-blue">
                  Dashboard
                </NavLink>
                <hr className="text-white/15" />
                <button onClick={handleLogout} className="text-red-500">
                  Logout
                </button>
              </div>
            ) : (
              <div className="z-10 absolute w-48 -right-5 p-2 rounded bg-gray-800 flex flex-col gap-y-2">
                <p className="flex justify-between items-center">
                  <span className="text-sm">login to view profile</span>
                  <NavLink
                    draggable="false"
                    to="/login"
                    className="text-blue-500"
                  >
                    Login
                  </NavLink>
                </p>
                <hr className="text-white/15" />
                <p className="flex justify-between items-center">
                  <span className="text-sm">new to TrendZ</span>
                  <NavLink
                    draggable="false"
                    to="/register"
                    className="py-0.5 px-2 bg-blue-500/50 rounded"
                  >
                    Register
                  </NavLink>
                </p>
              </div>
            ))}
        </div>
      </nav>
    </>
  );
};

export default MainNavbar;
