import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-6 lg:px-20">
        {/* 🔹 Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {/* 🔸 Customer Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a draggable="false" href="#">
                  Help Center
                </a>
              </li>
              <li>
                <a draggable="false" href="#">
                  Track Order
                </a>
              </li>
              <li>
                <a draggable="false" href="#">
                  Returns
                </a>
              </li>
              <li>
                <a draggable="false" href="#">
                  Shipping
                </a>
              </li>
              <li>
                <a draggable="false" href="#">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* 🔸 Company */}
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a draggable="false" href="#">
                  About Us
                </a>
              </li>
              <li>
                <a draggable="false" href="#">
                  Careers
                </a>
              </li>
              <li>
                <a draggable="false" href="#">
                  Blog
                </a>
              </li>
              <li>
                <a draggable="false" href="#">
                  Affiliate
                </a>
              </li>
              <li>
                <a draggable="false" href="#">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* 🔸 Policies */}
          <div>
            <h3 className="text-lg font-bold mb-4">Policies</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a draggable="false" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a draggable="false" href="#">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a draggable="false" href="#">
                  Security
                </a>
              </li>
              <li>
                <a draggable="false" href="#">
                  Payment Methods
                </a>
              </li>
            </ul>
          </div>

          {/* 🔸 Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                draggable="false"
                href="#"
                className="text-gray-400 hover:text-white"
              ></a>
              <a
                draggable="false"
                href="#"
                className="text-gray-400 hover:text-white"
              ></a>
              <a
                draggable="false"
                href="#"
                className="text-gray-400 hover:text-white"
              ></a>
              <a
                draggable="false"
                href="#"
                className="text-gray-400 hover:text-white"
              ></a>
            </div>
          </div>

          {/* 🔸 Download App */}
          <div>
            <h3 className="text-lg font-bold mb-4">Download Our App</h3>
            <div className="flex flex-col gap-3">
              <a draggable="false" href="#">
                <img
                  draggable="false"
                  loading="lazy"
                  src="images/google-play.png"
                  alt="Google Play"
                  className="w-32"
                />
              </a>
              <a draggable="false" href="#">
                <img
                  draggable="false"
                  loading="lazy"
                  src="images/app-store.png"
                  alt="App Store"
                  className="w-32"
                />
              </a>
            </div>
          </div>

          {/* 🔸 Payment Methods */}
          <div>
            <h3 className="text-lg font-bold mb-4">Payment Methods</h3>
            <img
              draggable="false"
              loading="lazy"
              src="images/payment-methods.png"
              alt="Payments"
              className="w-40"
            />
          </div>
        </div>

        {/* 🔹 Divider Line */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Trendz. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
