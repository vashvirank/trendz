import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, resetAuthSlice } from "../store/slices/authSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (email == "") {
      toast.warning("please enter your email");
      return;
    }
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      navigate("/login");
    }
    if (error) {
      if (error == "user is not authenticated") {
        toast.warning("Please enter registered email");
      } else {
        toast.error(error);
      }
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-[92vh] flex justify-center items-center  p-4 md:p-8 bg-sky-50 dark:bg-gray-950/70 text-gray-700 dark:text-gray-300">
      <div className="w-full md:w-130 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-blue-500/10">
        {/* Header */}
        <div
          className="p-5 text-gray-600 dark:text-gray-300 
        bg-gradient-to-r from-blue-500/30 to-violet-500/30 flex justify-between"
        >
          <div className="flex items-end gap-1">
            <svg width="27" height="27" className="text-blue-500">
              <use xlinkHref="/icons.svg#sparkle-icon" />
            </svg>
            <h1 className="text-xl md:text-2xl font-semibold dark:font-normal">
              Forgot Password!
            </h1>
          </div>
          <img draggable="false" src="/images/bag-logo1.png" className="h-8" />
        </div>
        <form
          onSubmit={handleForgotPassword}
          className="p-6 grid grid-cols-1 gap-x-8 gap-y-10"
        >
          <p>Enter your email to get password reset link...</p>
          <div className="flex items-center relative">
            <svg
              width="20"
              height="20"
              className="absolute left-3 opacity-80 z-1"
            >
              <use xlinkHref="/icons.svg#email-icon"></use>
            </svg>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="enter your email"
              className="
            border rounded border-black/10 dark:border-white/10 pl-10 backdrop-blur-[5px] bg-white/5
             hover:border-blue-500/50
           placeholder-gray-400
            p-2 focus:outline-none
            focus:border-sky-500
            focus:ring-1
            focus:ring-sky-500
            text-black dark:text-white
            focus:invalid:border-red-500  focus:invalid:ring-red-500 w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full text-white backdrop-blur-[5px] bg-blue-500 hover:bg-blue-600 rounded-md p-1.5"
            disabled={loading}
          >
            {loading ? (
              <>
                Sending Link...
                <svg
                  className="mx-2 -mt-1 size-5 animate-spin inline"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="3"
                    fill="none"
                    className="opacity-75"
                    strokeDasharray="50 50"
                    strokeLinecap="round"
                  ></circle>
                </svg>
              </>
            ) : (
              "SEND LINK"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
