import React, { useState } from "react";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { toast } from "react-toastify";

const Footer = () => {
  const [email, setEmail] = useState("");
  const handleSubscribe = () => {
    if (email === "") {
      toast.warning("Please enter email to subscribe");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(email);
    if (!valid) {
      toast.warning("please provide correct email address");
      return;
    }
    toast.success("Subscribed successfully! 🎉");
    setEmail("");
  };

  const url =
    "https://res.cloudinary.com/dsror8r39/image/upload/v1742750135/trendz/static";

  return (
    <footer>
      <div className="relative top-16">
        <div className="flex flex-col md:flex-row gap-10 bg-gray-50 dark:bg-[#0B2447] mx-auto rounded-lg w-[92%] md:w-[85%] p-8">
          <img
            src="/images/bag-logo1.png"
            className="mx-auto md:mx-0 w-36 h-36"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
              Subscribe to Our Newsletter to Get{" "}
              <span className="text-blue-500">
                Updates on Our Latest Offers
              </span>
            </h3>
            <p className="mt-2 text-gray-400">
              Get 25% off on your first order just by subscribing to our
              newsletter
            </p>
            <div className="bg-blue-500/30 dark:bg-blue-900/50 md:pl-3.5 my-4 flex items-center rounded-full w-96 max-w-[100%] p-1">
              <Mail size="18" className="hidden md:block" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
                className="px-4 py-1 w-52 md:w-60 focus:outline-0 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleSubscribe}
                className="bg-gradient-to-br from-blue-900 to-blue-950 dark:from-blue-800 dark:to-blue-900 text-gray-200 font-semibold px-3 md:px-6 py-1.5 rounded-full"
              >
                Subscribe
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              weekly emails with curated best-sellers
            </p>
          </div>
        </div>
      </div>
      <div className="pt-22 pb-5 px-[5%] bg-gray-50/50 dark:bg-[#071E3D] text-gray-700 dark:text-gray-300">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
          {/* Logo & Description */}
          <div className="col-span-3 p-3">
            <img
              draggable="false"
              loading="lazy"
              src={`${url}/trendz-logo.png`}
              className="h-6 mb-5 min-w-22 dark:brightness-125 dark:contrast-125"
            />
            <p className="mt-2 text-sm">
              Your one-stop shop for all things fashion, electronics & more!
            </p>
          </div>

          {/* Shop Links */}
          <div className="col-span-2 p-3">
            <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Shopping
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="/store/Men" className="hover:text-blue-400">
                  Men
                </a>
              </li>
              <li>
                <a href="/store/Women" className="hover:text-blue-400">
                  Women
                </a>
              </li>
              <li>
                <a href="/store/Home-furniture" className="hover:text-blue-400">
                  Home & Furniture
                </a>
              </li>
              <li>
                <a href="/store/Kids" className="hover:text-blue-400">
                  Kids
                </a>
              </li>
            </ul>
          </div>
          {/* Category Info */}
          <div className="col-span-2 p-3">
            <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Category
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="/store/Electronics" className="hover:text-blue-400">
                  Electronics
                </a>
              </li>
              <li>
                <a href="/store/Beauty" className="hover:text-blue-400">
                  Beauty
                </a>
              </li>
              <li>
                <a href="/store/Art-crafts" className="hover:text-blue-400">
                  Art Crafts
                </a>
              </li>
              <li>
                <a href="/store/Grocery" className="hover:text-blue-400">
                  Grocery
                </a>
              </li>
            </ul>
          </div>
          {/* Contact & Social */}
          <div className="col-span-3 p-3">
            <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Connect
            </h3>
            <div className="flex space-x-5 my-5">
              <a
                href="#"
                className="text-blue-500/75 hover:scale-105 hover:text-blue-500 bg-blue-500/20 p-1.5 rounded-lg"
              >
                <Facebook strokeWidth={1.5} size={22} />
              </a>
              <a
                href="#"
                className="text-pink-500/75 hover:scale-105 hover:text-pink-500 bg-pink-500/20 p-1.5 rounded-lg"
              >
                <Instagram strokeWidth={1.5} size={22} />
              </a>
              <a
                href="#"
                className="text-sky-400/75 hover:scale-105 hover:text-sky-400 bg-sky-400/20 p-1.5 rounded-lg"
              >
                <Twitter strokeWidth={1.5} size={22} />
              </a>
              <a
                href="#"
                className="text-green-500/75 hover:scale-105 hover:text-green-500 bg-green-500/20 p-1.5 rounded-lg"
              >
                <Mail strokeWidth={1.5} size={22} />
              </a>
            </div>
            <p
              onClick={() =>
                window.open(
                  "https://mail.google.com/mail/?view=cm&to=helpdesk.trendz@gmail.com&su=Support%20Request&body=Hi%20Trendz%20Team%2C%0AI%20need%20assistance%20with...",
                  "_blank"
                )
              }
              className="hover:text-blue-500 cursor-pointer"
            >
              helpdesk.trendz@gmail.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-t-black/20 dark:border-t-white/20 pt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Trendz. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
