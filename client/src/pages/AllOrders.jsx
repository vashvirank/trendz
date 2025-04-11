import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrderes } from "../store/slices/orderSlice";
import AdminNavbar from "../layout/AdminNavbar";

const AllOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrderes());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, "0");

    return `${day}/${month}/${year} ${strHours}:${minutes} ${ampm}`;
  };

  return (
    <>
      <AdminNavbar />
      <div>
        <div className="bg-blue-50 dark:bg-gray-950 min-h-[100vh]">
          <h3 className="text-center text-gray-300 text-2xl p-5">All Orders</h3>
          {error && <p className="text-red-500">Error: {error}</p>}
          <div className="flex">
            <div>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {orders && orders?.length !== 0 ? (
                    <ul className="px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {orders?.map((order) => (
                        <li
                          key={order?._id}
                          className="bg-blue-100 dark:bg-gray-800 border border-blue-200/40 dark:border-white/10 rounded-xl shadow-sm overflow-hidden"
                        >
                          <a
                            draggable={false}
                            href={`/product/${order?.product?.id}`}
                            rel="noopener noreferrer"
                            className="block p-4"
                          >
                            <p className="text-lg font-semibold mb-1">
                              {order?.product?.name}
                            </p>

                            <p className="mb-1">
                              <span className="text-green-600 font-bold">
                                ${order?.product?.price}
                              </span>{" "}
                              <span className="text-sm text-gray-400 line-through">
                                ${order?.product?.totalPrice}
                              </span>
                            </p>

                            <p className="text-sm mb-1">
                              Seller:{" "}
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {order?.product?.seller}
                              </span>
                            </p>

                            <p className="text-sm mb-1">
                              Status:{" "}
                              <span
                                className={`font-semibold ${
                                  order?.status === "pending"
                                    ? "text-yellow-500"
                                    : order?.status === "delivered"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {order?.status}
                              </span>
                            </p>

                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Order Date: {formatDate(order?.orderDate)}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Delivery:{" "}
                              {formatDate(order?.expectedDeliveryDate)}
                            </p>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="w-[100%] min-h-[70vh] m-1 p-10 border border-white/10 rounded flex flex-col md:flex-row items-center justify-center">
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
                        <p className="text-lg">your cart is empty....</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllOrders;
