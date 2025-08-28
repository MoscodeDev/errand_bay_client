import React, { useState } from "react";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const Auth = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.table(formData);
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      let { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
        console.error("Error signing in:", error);
        toast.error("Failed to sign in. Please check your credentials.");
        return;
      }
      toast.success("Signed in successfully!");
      navigate("/");
      console.log("User data:", data);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <div className="font-bold text-2xl tracking-widest">LOGIN</div>
      <form
        className="w-full md:w-[400px] lg:w-[500px] max-sm:border-none md:border-2 p-2 md:p-5 rounded-md mt-1 md:mt-3 focus-within:border-blue-500"
        onSubmit={handleSubmit}
      >
        <InputField
          inputDetails={{
            label: "Email",
            type: "email",
            name: "email",
            handleChange: handleChange,
            value: formData.email,
          }}
        />
        <PasswordField
          inputDetails={{
            label: "Password",
            name: "password",
            handleChange: handleChange,
            value: formData.password,
          }}
        />

        <button
          className=" w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
          disabled={loading}
        >
          {loading ? "Logging in ..." : "Login"}
        </button>
      </form>
      <div>
        Don't have an account?
        <Link to="/register" className="mt-2 text-blue-500 hover:underline">
          Register
        </Link>
      </div>
      <Link to="/forgetpassword" className=" text-blue-500 hover:underline">
        Forgot password
      </Link>
    </div>
  );
};

export default Auth;
