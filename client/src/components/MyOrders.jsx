import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyOrder,
  cancelOrder,
  resetOrderSlice,
} from "../store/slices/orderSlice.js";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, message } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getMyOrder());
  }, [dispatch, message]);

  const handleCancelOrder = (id) => {
    dispatch(cancelOrder(id));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetOrderSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetOrderSlice());
    }
  }, [dispatch, message, error]);

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
      <div className="bg-blue-50 dark:bg-gray-950 min-h-screen py-10 px-4">
        <h3 className="text-center text-blue-900 dark:text-blue-300 text-3xl font-bold mb-8">
          My Orders
        </h3>

        {loading ? (
          <p className="text-center text-lg text-gray-600 dark:text-gray-300">
            Loading...
          </p>
        ) : orders && orders.length !== 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {orders.map((order) => (
              <li
                key={order?._id}
                className="bg-blue-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl border border-blue-200/50 dark:border-white/10 shadow-sm"
              >
                <a
                  draggable={false}
                  href={`/product/${order?.product?.id}`}
                  rel="noopener noreferrer"
                  className="block p-4 space-y-1"
                >
                  {order?.product?.images && (
                    <img
                      src={order?.product?.images[0]}
                      alt={order?.product?.name}
                      className="w-full"
                    />
                  )}
                  <p className="font-semibold text-lg">
                    {order?.product?.name}
                  </p>

                  <p className="text-sm">
                    Size:{" "}
                    <span className="font-medium">{order?.product?.size}</span>
                  </p>

                  <div>
                    <div className="text-sm flex justify-between">
                      <p>Price</p>
                      <span className="font-semibold">
                        ${order?.product?.price}
                      </span>
                    </div>
                    <div className="text-sm flex justify-between">
                      <p>Quantity</p>
                      <span className="font-medium">
                        {order?.product?.quantity}
                      </span>
                    </div>
                    <hr className="my-1" />
                    <div className="text-sm flex justify-between">
                      <p>Total Price</p>
                      <span className="text-green-600 font-semibold">
                        ${order?.totalPrice}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm">
                    Seller:{" "}
                    <span className="font-medium">
                      {order?.product?.sellerName}
                    </span>
                  </p>

                  <p className="text-sm">
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

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Order Date: {formatDate(order?.orderDate)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Delivery: {formatDate(order?.expectedDeliveryDate)}
                  </p>
                </a>

                <div className="p-4 pt-2">
                  <button
                    onClick={() => handleCancelOrder(order?.order_id)}
                    className="w-full text-sm text-blue-800 border border-blue-800/30 hover:bg-blue-800 hover:text-white transition px-4 py-2 rounded"
                  >
                    Cancel Order
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="w-full min-h-[60vh] p-10 border border-white/10 rounded flex flex-col md:flex-row items-center justify-center max-w-5xl mx-auto bg-white/30 dark:bg-gray-800">
            <img
              draggable="false"
              loading="lazy"
              src="/not-found.svg"
              width="250"
              height="250"
              alt="No orders found"
              className="mb-4 md:mb-0"
            />
            <div className="text-center md:ml-10">
              <p className="text-red-500 font-semibold text-5xl mb-2">OOPS!</p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                You haven’t placed any orders yet...
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;
