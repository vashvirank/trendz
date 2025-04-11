import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { register, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { auth } from "../config/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const Register = () => {
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sendOtp = async () => {
    try {
      if (!phone) {
        console.error("Phone number is missing!");
        return;
      }

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
          size: "normal", // Use "normal" if you want the challenge to be visible
        });
      }

      const appVerifier = window.recaptchaVerifier;

      await appVerifier.render();

      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier
      );
      console.log("OTP Sent:", confirmation);
    } catch (err) {
      console.error("Error sending OTP:", err);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords not match", {
        theme: "dark",
      });
      return;
    }
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("phone", phone);
    data.append("password", password);
    // sendOtp();
    dispatch(register(data));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      navigate(`/otp-verification/${email}`);
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading]);

  return (
    <>
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
                Create an account!
              </h1>
            </div>
            <img
              draggable="false"
              src="/images/bag-logo1.png"
              className="h-8"
            />
          </div>
          <form
            onSubmit={handleRegister}
            className="p-6 grid grid-cols-1 gap-x-4 gap-y-8"
          >
            <div className="flex flex-col md:flex-row gap-8 md:gap-2">
              <div className="flex items-center relative">
                <svg
                  width="16"
                  height="16"
                  className="absolute left-3 opacity-80"
                >
                  <use xlinkHref="/icons.svg#user-icon"></use>
                </svg>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  name="name"
                  className="
            border rounded border-black/10 dark:border-white/10 pl-10 hover:border-blue-500/50
           placeholder-gray-400
            p-1.5 focus:outline-none
            focus:border-sky-500
            text-black dark:text-white
            focus:ring-1
            focus:ring-sky-500
            focus:invalid:border-red-500  focus:invalid:ring-red-500 w-full"
                />
              </div>
              <div className="flex items-center relative">
                <svg
                  width="16"
                  height="16"
                  className="absolute left-3 opacity-80"
                >
                  <use xlinkHref="/icons.svg#phone-icon"></use>
                </svg>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone"
                  name="phone"
                  className="
            border rounded border-black/10 dark:border-white/10 pl-10 hover:border-blue-500/50
           placeholder-gray-400
            p-1.5 focus:outline-none
            focus:border-sky-500
            text-black dark:text-white
            focus:ring-1
            focus:ring-sky-500
            focus:invalid:border-red-500  focus:invalid:ring-red-500 w-full"
                />
              </div>{" "}
            </div>

            <div className="flex items-center relative">
              <svg
                width="16"
                height="16"
                className="absolute left-3 opacity-80"
              >
                <use xlinkHref="icons.svg#email-icon"></use>
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                name="email"
                className="
            border rounded border-black/10 dark:border-white/10 pl-10 hover:border-blue-500/50
           placeholder-gray-400
            p-1.5 focus:outline-none
            focus:border-sky-500
            text-black dark:text-white
            focus:ring-1
            focus:ring-sky-500
            focus:invalid:border-red-500  focus:invalid:ring-red-500 w-full"
              />
            </div>

            <div className="flex items-center relative">
              <svg
                width="20"
                height="20"
                className="absolute left-3 opacity-80"
              >
                <use xlinkHref="icons.svg#password-icon"></use>
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
                    xlinkHref={`icons.svg#${
                      showPassword ? "eye-off-icon" : "eye-icon"
                    }`}
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center relative">
              <svg
                width="20"
                height="20"
                className="absolute left-3 opacity-80"
              >
                <use xlinkHref="icons.svg#password-icon"></use>
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
                    xlinkHref={`icons.svg#${
                      showCPassword ? "eye-off-icon" : "eye-icon"
                    }`}
                  />
                </svg>
              </button>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Register
              </button>
              <div className="flex gap-2">
                <p>already have account? </p>
                <Link to="/login" className="text-blue-500">
                  Login
                </Link>
              </div>
            </div>

            {/* <div id="recaptcha"></div> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
