import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import {
  ArrowRightFromLine,
  Fingerprint,
  Menu,
  Power,
  RotateCcwKey,
  ShoppingCart,
  UserCheck,
  X,
} from "lucide-react";
import logo from "../assets/errand_bay.png";

const Nav = () => {
  const [shownav, setShownav] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const userRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileNavRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
          userRef.current = data.user;
        }
      } catch (err) {
        console.error("getUser error", err);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      setUser(null);
      userRef.current = null;
      toast.success("Logged out successfully");
      setShowDropdown(false);
      navigate("/auth");
    } catch (err) {
      console.error("signOut error", err);
      toast.error("Logout failed");
    }
  };

  const handleNavToggle = () => setShownav((s) => !s);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutsideNav = (event) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target)) {
        setShownav(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideNav);
    return () => document.removeEventListener("mousedown", handleClickOutsideNav);
  }, []);

  return (
    <div className="md:flex md:justify-between p-3 w-full relative">
      {/* Desktop View */}
      <div className="hidden w-full md:flex md:justify-between md:p-2 bg-red-600/5 rounded-2xl items-center">
        <img
          src={logo}
          alt="logo"
          className="h-9 w-9 rounded-2xl cursor-pointer"
          onClick={() => navigate("/")}
        />

        <div className="flex gap-20 items-center">
          <div className="flex justify-between gap-10 text-lg">
            <Link to="/" className="font-mono hover:underline hover:text-green-400 transition-all">
              Home
            </Link>
            <Link to="/errands" className="font-mono hover:underline hover:text-green-400">
              Errands
            </Link>
            <Link to="/track-errand" className="font-mono hover:underline hover:text-green-400">
              My_Errands
            </Link>
            <Link to="/about" className="font-mono hover:underline hover:text-green-400">
              About
            </Link>
            <Link to="/cart" className="font-mono hover:underline hover:text-green-400 flex gap-1">
              <ShoppingCart />
            </Link>
          </div>

          {/* User Menu */}
          <div className="relative">
            <div
              className="cursor-pointer flex items-center gap-2 hover:text-green-500"
              onClick={() => setShowDropdown((s) => !s)}
            >
              {user ? <UserCheck /> : <RotateCcwKey />}
            </div>

            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-10 bg-white shadow-lg rounded-md p-3 w-56 z-50"
              >
                {user?(<div className="flex items-center justify-between font-mono text-gray-700 mb-3 cursor-pointer ml-2 hover:text-green-400"
                onMouseDown={(e) => {
                      e.stopPropagation();
                      setShowDropdown(false);
                      navigate("/profile");
                    }}>
                  <span className="truncate max-w-[180px]">
                    {user?.email || "Unknown User"}
                  </span>
                  <ArrowRightFromLine
                  />
                </div>):(
                  <div className="flex gap-3 cursor-pointer ml-2 hover:text-green-400"
                  onMouseDown={(e) => {
                      e.stopPropagation();
                      setShowDropdown(false);
                      navigate("/auth");
                    }}>
                    <span>Login</span>
                     <Fingerprint
                    className=""
                    
                  />
                  </div>
                )}

                {user && <div
                  className="flex items-center gap-2 cursor-pointer hover:text-red-600 transition-colors"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                >
                  <Power /> Logout
                </div>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex justify-between md:hidden w-full" ref={mobileNavRef}>
        <div>
          <div onClick={handleNavToggle} className="transition ease-in duration-100 hover:text-green-400 cursor-pointer">
            {shownav ? <X /> : <Menu />}
          </div>

          {/* Mobile menu (expands) */}
          <div
            className={`flex gap-5 flex-col transition-all ease-in-out duration-300 overflow-hidden ${
              shownav ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
            }`}
          >
            <Link to="/" onClick={handleNavToggle} className="font-mono hover:underline hover:text-green-400 pt-3">
              Home
            </Link>
            <Link to="/errands" onClick={handleNavToggle} className="font-mono hover:underline hover:text-green-400">
              Errands
            </Link>
            <Link to="/track-errand" onClick={handleNavToggle} className="font-mono hover:underline hover:text-green-400">
              My Errands
            </Link>
            <Link to="/cart" onClick={handleNavToggle} className="font-mono hover:underline hover:text-green-400">
              Cart
            </Link>
            <Link to="/about" onClick={handleNavToggle} className="font-mono hover:underline hover:text-green-400">
              About
            </Link>
          </div>
        </div>

        {/* Mobile user icon + dropdown */}
        <div className="relative">
          <div
            className="cursor-pointer flex items-center gap-2 hover:text-green-500"
            onClick={() => setShowDropdown((s) => !s)}
          >
            {user ? <UserCheck /> : <RotateCcwKey />}
          </div>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-10 bg-white shadow-lg rounded-md p-3 w-56 z-50"
            >
              {user? (<div className="flex items-center justify-between font-mono text-gray-700 mb-3 cursor-pointer ml-2 hover:text-green-400"
              onMouseDown={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    navigate("/profile");
                  }}>
                <span className="truncate max-w-[180px]">
                  {user?.email || "Unknown User"}
                </span>
                <ArrowRightFromLine />
              </div>) :(
                <div className="flex gap-3 cursor-pointer ml-2 hover:text-green-400"
                  onMouseDown={(e) => {
                      e.stopPropagation();
                      setShowDropdown(false);
                      navigate("/auth");
                    }}>
                    <span>Login</span>
                     <Fingerprint
                    className=""
                    
                  />
                  </div>

              )}

              {user && <div
                className="flex items-center gap-2 cursor-pointer hover:text-red-600 transition-colors"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
              >
                <Power /> Logout
              </div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
