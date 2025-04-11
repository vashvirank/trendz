import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../store/slices/authSlice";
import AdminNavbar from "../layout/AdminNavbar";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllUsers());
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
          <h3 className="text-center text-gray-300 text-2xl p-5">All users</h3>
          {error && <p className="text-red-500">Error: {error}</p>}
          <div className="flex">
            <div>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {users && users?.length !== 0 ? (
                    <ul className="px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {users?.map((user) => (
                        <li
                          key={user?._id}
                          className="bg-blue-100 p-3 dark:bg-gray-800 buser buser-blue-200/40 dark:buser-white/10 rounded-xl shadow-sm overflow-hidden"
                        >
                          <p className="text-lg font-semibold mb-1">
                            {user?.name}
                          </p>

                          <p className="mb-1">{user?.email}</p>

                          <p className="text-gray-600 dark:text-gray-400">
                            Login Date: {formatDate(user?.createdAt)}
                          </p>

                          <div className="p-4 pt-0">
                            <button
                              // onClick={() => handleCanceluser(user?.user_id)}
                              className="w-full text-sm text-blue-800 buser buser-blue-800/30 hover:bg-blue-800 hover:text-white transition px-4 py-2 rounded mt-2"
                            >
                              remove user
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="w-[100%] min-h-[70vh] m-1 p-10 buser buser-white/10 rounded flex flex-col md:flex-row items-center justify-center">
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
                        <p className="text-lg">users not found....</p>
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

export default AllUsers;
