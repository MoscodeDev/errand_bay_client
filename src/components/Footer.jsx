import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Twitter, Instagram, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

const Footer = ({ logoSrc }) => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thanks — we'll keep you posted!");
    setEmail("");
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt="Errand Bay logo"
                  className="h-10 w-10 rounded-md object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-md flex items-center justify-center bg-gradient-to-br from-blue-500 to-orange-400 text-white font-bold">
                  EB
                </div>
              )}
              <div>
                <div className="text-lg font-bold text-gray-800">
                  Errand <span className="text-orange-500">Bay</span>
                </div>
                <div className="text-sm text-gray-500">
                  Fast errands, happier days.
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 max-w-xs mx-auto md:mx-0">
              Errand Bay helps you run errands, shop and deliver — quickly and
              reliably.
            </p>

            <div className="flex flex-col items-center md:items-start gap-2">
              <a
                href="mailto:mosscode101@gmail.com"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <Mail size={16} /> mosscode101@gmail.com
              </a>
              <a
                href="tel:+254788883643"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <Phone size={16} /> +254 788 883 643
              </a>
              <a
  href="https://wa.me/254788883643?text=Hello%20Errand%20Bay!"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
>
  <MessageCircle size={20} />
  WhatsApp Us
</a>
            </div>
          </div>

          {/* Quick links */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Quick links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-800">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/track-errand"
                  className="text-gray-600 hover:text-gray-800"
                >
                  My Errands
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-800">
                  About
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-gray-800">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Account
                </Link>
              </li>
              <li>
                <Link
                  to="/change-password"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Change password
                </Link>
              </li>
              <li>
                <Link
                  to="/forgetpassword"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Forgot password
                </Link>
              </li>
              <li>
                <a href="/terms" className="text-gray-600 hover:text-gray-800">
                  Terms &amp; Privacy
                </a>
              </li>
            </ul>

            
          </div>

          
        </div>

        {/* Bottom bar */}
        <div className="border-t mt-8 pt-6 text-xs sm:text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div>&copy; {year} Errand Bay — Built with care.</div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-1">
              <MapPin size={14} /> Nairobi, Kenya
            </div>
            <div>Made with ❤️</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
