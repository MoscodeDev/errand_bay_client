import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import { supabase } from "./supabaseClient";

import Products from "./pages/Products";
import TrackErrands from "./pages/TrackErrands";
import About from "./pages/About";
import ForgetPassword from "./pages/ForgetPassword";
import Cart from "./pages/Cart";
import Description from "./pages/Description";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import ResetPassword from "./pages/ResetPassword";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getUser();

      // If user is logged in, store user state
      if (data.user) {
        setUser(data.user);
      }

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === "SIGNED_IN") {
            setUser(session.user);
            if (location.pathname === "/auth") navigate("/");
          } else if (event === "SIGNED_OUT") {
            setUser(null);
          }
        }
      );

      // Cleanup
      return () => {
        authListener?.subscription?.unsubscribe?.();
        authListener?.unsubscribe?.();
      };
    };

    initAuth();
  }, []);

  const refetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      setUser(data.user);
    }
  };

  return (
    <div>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />}>
          {/* Public routes */}
          <Route index element={<Products />} />
          <Route path="errands" element={<LandingPage user={user} />} />
          <Route path="/description/:slug/:id" element={<Description />} />
          <Route path="/about" element={<About />} />

          {/* Protected routes */}
          <Route path="/cart" element={user ? <Cart user={user} /> : <Auth />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Auth />} />
          <Route
            path="/profile/edit"
            element={user ? <EditProfile user={user} refetchUser={refetchUser} /> : <Auth />}
          />
          <Route path="/change-password" element={user ? <ChangePassword /> : <Auth />} />
          <Route path="/track-errand" element={user ? <TrackErrands /> : <Auth />} />
        </Route>

        {/* Auth & password routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
