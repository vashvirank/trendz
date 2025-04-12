import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, NavLink, useNavigate } from "react-router-dom";
import { login, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const data = { name, password };
    dispatch(login(data));
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
  }, [dispatch, message, error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-[92vh] flex justify-center items-center p-4 md:p-8 bg-sky-50 dark:bg-gray-950/70 text-gray-700 dark:text-gray-300">
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
              Welcom Back!
            </h1>
          </div>
          <img draggable="false" src="/images/bag-logo1.png" className="h-8" />
        </div>
        <form
          onSubmit={handleLogin}
          className="p-6 grid grid-cols-1 gap-x-4 gap-y-10"
        >
          <div className="flex items-center relative">
            <svg
              width="20"
              height="20"
              className="absolute left-3 opacity-80 z-1"
            >
              <use xlinkHref="/icons.svg#user-icon"></use>
            </svg>
            <input
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              placeholder="enter name"
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

          <div className="flex flex-col">
            <div className="flex items-center relative">
              <svg
                width="22"
                height="22"
                className="absolute left-3 opacity-80 z-1"
              >
                <use xlinkHref="icons.svg#password-icon"></use>
              </svg>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter password"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="
            border rounded border-black/10 dark:border-white/10 px-10 backdrop-blur-[5px] bg-white/5
             hover:border-blue-500/50
           placeholder-gray-400
            p-2 focus:outline-none
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
                  className="absolute right-3 top-3.5"
                >
                  <use
                    xlinkHref={`icons.svg#${
                      showPassword ? "eye-off-icon" : "eye-icon"
                    }`}
                  />
                </svg>
              </button>
            </div>
            <NavLink
              draggable="false"
              to="/password/forgot"
              className="self-end text-gray-400 mt-1 hover:text-gray-300"
            >
              Forgot password?
            </NavLink>
          </div>

          <div>
            <button
              type="submit"
              className="w-full text-white backdrop-blur-[5px] bg-blue-500 hover:bg-blue-600 rounded-md p-1.5"
              disabled={loading}
            >
              {loading ? (
                <>
                  Logging in...
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
                "Log In"
              )}
            </button>
            <p className="text-gray-400 mt-1">
              don't have account?{" "}
              <NavLink
                draggable="false"
                to="/register"
                className="text-blue-400 hover:text-blue-500"
              >
                Register
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
