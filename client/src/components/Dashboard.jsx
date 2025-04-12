import { useEffect, useState } from "react";
import {
  Menu,
  X,
  User,
  ShoppingCart,
  Heart,
  LogOut,
  LayoutDashboard,
  Package,
  BarChart2,
  Sun,
  Moon,
  Users,
  Settings,
  BadgeCheck,
  ShoppingBag,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import MyOrders from "../components/MyOrders.jsx";
import CartBoard from "../components/CartBoard.jsx";
import WishList from "../components/WishList.jsx";
import AllSales from "../pages/AllSales.jsx";
import Sales from "../components/Sales.jsx";
import { getUser, logout, resetAuthSlice } from "../store/slices/authSlice.js";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: ShoppingBag },
  { label: "Wishlist", icon: Heart },
  { label: "Cart", icon: ShoppingCart },
  { label: "Sales", icon: BarChart2 },
  { label: "Settings", icon: Settings },
  { label: "Logout", icon: LogOut },
];

const Dashboard = () => {
  const { user, user1 } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleLogout = () => {
    const x = confirm("Are you sure want to logout?");
    if (x) {
      dispatch(logout());
      navigate("/");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, "0");

    return `${day} ${month} ${year}, ${strHours}:${minutes} ${ampm}`;
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
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300">
      {/* Sidebar */}
      <div className="md:w-64 bg-gray-50 dark:bg-gray-400/5 border-r border-gray-300 dark:border-gray-700 md:min-h-screen">
        <div className="flex items-center justify-between md:justify-center p-4 border-b border-gray-300 dark:border-gray-700">
          <div className="flex gap-1 items-end">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-400">({user?.role})</p>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${menuOpen ? "block" : "hidden"} md:block p-2 space-y-2`}
        >
          {navItems.map((item) => {
            if (item.label === "Sales" && user?.role === "customer") {
              return null;
            }
            if (
              (item.label === "Orders" ||
                item.label === "Wishlist" ||
                item.label === "Cart") &&
              user?.role !== "customer"
            ) {
              return null;
            }

            const Icon = item.icon;
            const isActive = activeTab === item.label;

            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveTab(item.label);
                  setMenuOpen(false);
                }}
                className={`w-full group flex items-center border-l-3 gap-3 px-3 py-2 rounded text-left transition-all ${
                  isActive
                    ? "bg-blue-500/15 border-l-blue-500 text-gray-800 dark:text-gray-200"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700 border-l-transparent text-gray-500 dark:text-gray-400"
                }`}
              >
                <Icon
                  size={18}
                  className={`transition-all ${
                    isActive ? "fill-gray-800 dark:fill-gray-200" : ""
                  } group-hover:fill-gray-500 dark:group-hover:fill-gray-400`}
                />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* dashboard */}
      {user1 && (
        <div
          className={`${
            activeTab === "Dashboard" ? "" : "hidden"
          } p-3 w-full flex gap-3 flex-col`}
        >
          <div className="bg-gray-50 dark:bg-gray-800/50 md:col-span-2 p-6 rounded-lg flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative self-center">
              <img
                src="https://i.pravatar.cc/100?img=3"
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/20"
              />
              {user1?.accountVerified && (
                <BadgeCheck
                  strokeWidth="1.5"
                  className="text-blue-500 fill-blue-500/40 absolute top-0.5 right-0.5"
                />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{user1?.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{user1?.email}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Member since {formatDate(user1?.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="bg-gray-50 w-full dark:bg-gray-800/50 p-4 rounded">
              <h3 className="text-lg font-medium">Phone</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {user1?.phone}
              </p>
            </div>
            <div className="bg-gray-50 w-full dark:bg-gray-800/50 p-4 rounded">
              <h3 className="text-lg font-medium">Shipping Address</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {user1?.address}
              </p>
            </div>
          </div>
          {user1?.role === "customer" && (
            <div className="flex flex-col md:flex-row gap-3">
              <div className="bg-white w-full dark:bg-gray-800/50 p-4 rounded">
                <h3 className="text-lg font-medium">Orders</h3>
                {user1?.orders && (
                  <>
                    <div className="mt-3">
                      <table className="border w-full text-gray-600 dark:text-gray-300">
                        <thead>
                          <tr className="bg-blue-500/10">
                            <th className="border border-black/15 dark:border-white/15 p-1">
                              No.
                            </th>
                            <th className="border border-black/15 dark:border-white/15 p-1">
                              Product
                            </th>
                            <th className="border border-black/15 dark:border-white/15 p-1">
                              Price
                            </th>
                            <th className="border border-black/15 dark:border-white/15 p-1">
                              Status
                            </th>
                            <th className="border border-black/15 dark:border-white/15 p-1">
                              Delivery-date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {user1?.orders?.map((order, index) => (
                            <tr key={index}>
                              <td className="border border-black/15 dark:border-white/15 p-1">
                                {index + 1}
                              </td>
                              <td className="border border-black/15 dark:border-white/15 p-1">
                                {order?.product?.name}
                              </td>
                              <td className="border border-black/15 dark:border-white/15 p-1">
                                {order?.product?.price}
                              </td>
                              <td className="border border-black/15 dark:border-white/15 p-1">
                                {formatDate(order?.expectedDeliveryDate)}
                              </td>
                              <td
                                className={`${
                                  order?.status === "pending"
                                    ? "text-green-500"
                                    : "text-red-500"
                                } border border-black/15 dark:border-white/15 p-1`}
                              >
                                {order?.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Orders */}
      {user1?.role === "customer" && (
        <div className={`${activeTab === "Orders" ? "" : "hidden"}`}>
          <MyOrders />
        </div>
      )}

      {/* Cart */}
      {user1?.role === "customer" && (
        <div className={`w-full ${activeTab === "Cart" ? "" : "hidden"}`}>
          <CartBoard />
        </div>
      )}

      {/* WishList */}
      {user1?.role === "customer" && (
        <div className={`w-full ${activeTab === "Wishlist" ? "" : "hidden"}`}>
          <WishList />
        </div>
      )}

      {/* Admin Sales */}
      {user1?.role === "admin" && (
        <div className={`w-full ${activeTab === "Sales" ? "" : "hidden"}`}>
          <AllSales db={0} />
        </div>
      )}

      {/* Sellr Sales */}
      {user1?.role === "seller" && (
        <div className={`w-full ${activeTab === "Sales" ? "" : "hidden"}`}>
          <Sales db={0} />
        </div>
      )}

      {/* setting */}
      <div
        className={`${
          activeTab === "Settings" ? "" : "hidden"
        } p-3 flex flex-col gap-3 w-full`}
      >
        {/* theme */}
        <div className="bg-gray-600/10 rounded-lg py-3 px-4">
          <h3 className="text-lg font-medium">Choose theme</h3>
          <div className="flex flex-col items-start gap-1 ml-5 mt-2">
            <label
              className={`${
                theme === "light" ? "bg-blue-500/20" : ""
              } rounded-full py-2 px-2.5 pr-15 flex items-center space-x-2 cursor-pointer hover:bg-blue-500/10`}
            >
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={() => setTheme("light")}
                className="appearance-none w-4 h-4 border-2 border-blue-500 rounded-full checked:ring-3 checked:ring-blue-500/40 checked:bg-blue-500 transition-all duration-200"
              />
              <span className="text-sm text-gray-800 dark:text-gray-200">
                Light Theme
              </span>
            </label>

            <label
              className={`${
                theme === "dark" ? "bg-blue-500/15" : ""
              } rounded-full py-2 px-2.5 pr-15 flex items-center space-x-2 cursor-pointer hover:bg-blue-500/10`}
            >
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={() => setTheme("dark")}
                className="appearance-none w-4 h-4 border-2 border-blue-500 rounded-full checked:ring-3 checked:ring-blue-500/30 checked:bg-blue-500 transition-all duration-200"
              />
              <span className="text-sm text-gray-800 dark:text-gray-200">
                Dark Theme
              </span>
            </label>
          </div>
        </div>
        {/* change password */}
        <div className="bg-gray-600/10 rounded-lg py-3 px-4">
          <h3 className="text-lg font-medium">Change password</h3>
          <div className="flex items-center gap-2 ml-5 mt-2">
            <p>Forgot password?</p>
            <NavLink
              draggable="false"
              to="/password/forgot"
              className="text-blue-500 hover:text-blue-600 bg-blue-500/15 px-5 py-0.5 rounded-full"
            >
              Change
            </NavLink>
          </div>
        </div>
      </div>

      <div
        className={`${
          activeTab === "Logout" ? "" : "hidden"
        } p-3 flex flex-col gap-3 w-full`}
      >
        <div className="bg-gray-600/10 rounded-lg py-3 px-4">
          <h3 className="text-lg font-medium">Logout</h3>
          <div className="flex items-center gap-2 ml-5 mt-2">
            <p>Want to log put?</p>

            <button
              onClick={handleLogout}
              className="hover:scale-95 transition-transform text-blue-500 hover:text-blue-600 bg-blue-500/15 px-5 py-0.5 rounded-full"
            >
              Click here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
