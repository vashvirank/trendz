import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { resetAuthSlice, resetPassword } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const { token } = useParams();

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.warning("Password & confirm Password not match");
      return;
    }
    const data = new FormData();
    data.append("password", password);
    data.append("confirmPassword", confirmPassword);
    dispatch(resetPassword(data, token));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-sky-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300">
      <div className="w-full md:w-130 mx-auto bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-blue-500/10">
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
              Reset Password!
            </h1>
          </div>
          <img draggable="false" src="/images/bag-logo1.png" className="h-8" />
        </div>
        <form
          onSubmit={handleResetPassword}
          className="p-6 grid grid-cols-1 gap-x-6 gap-y-10"
        >
          <div className="flex items-center relative">
            <svg width="20" height="20" className="absolute left-3 opacity-80">
              <use xlinkHref="/icons.svg#password-icon"></use>
            </svg>
            <input
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              minLength={8}
              className="
            border rounded border-black/10 dark:border-white/10 px-10 hover:border-blue-500/50
           placeholder-gray-400
            p-1.5 focus:outline-none
            focus:border-sky-500
            focus:ring-1
            text-black dark:text-white
            focus:ring-sky-500
            focus:invalid:border-red-500  focus:invalid:ring-red-500 w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg
                width="16"
                height="16"
                className="absolute right-3 top-3 opacity-80"
              >
                <use
                  xlinkHref={`/icons.svg#${
                    showPassword ? "eye-off-icon" : "eye-icon"
                  }`}
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center relative">
            <svg width="20" height="20" className="absolute left-3 opacity-80">
              <use xlinkHref="/icons.svg#password-icon"></use>
            </svg>
            <input
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showCPassword ? "text" : "password"}
              name="cpassword"
              placeholder="Enter your Confirm password"
              minLength={8}
              className="
            border rounded border-black/10 dark:border-white/10 px-10 hover:border-blue-500/50
           placeholder-gray-400
            p-1.5 focus:outline-none
            focus:border-sky-500
            focus:ring-1
            text-black dark:text-white
            focus:ring-sky-500
            focus:invalid:border-red-500  focus:invalid:ring-red-500 w-full"
            />
            <button
              type="button"
              onClick={() => setShowCPassword(!showCPassword)}
            >
              <svg
                width="16"
                height="16"
                className="absolute right-3 top-3 opacity-80"
              >
                <use
                  xlinkHref={`/icons.svg#${
                    showCPassword ? "eye-off-icon" : "eye-icon"
                  }`}
                />
              </svg>
            </button>
          </div>

          <button
            type="submit"
            className="w-full text-white backdrop-blur-[5px] bg-blue-500 hover:bg-blue-600 rounded-md p-1.5"
            disabled={loading}
          >
            {loading ? (
              <>
                Reseting Password...
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
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
