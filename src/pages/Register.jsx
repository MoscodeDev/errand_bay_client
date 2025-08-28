import React, { useState } from "react";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    user_type: "customer",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hanldleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.password ||
      !formData.confirm_password ||
      !formData.full_name ||
      !formData.phone
    ) {
      toast.error("Please fill all fields");
      return;
    }
    const phoneRegex = /^(?:\+254|0)?(\d{9})$/;

    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        password: formData.password,
        email: formData.email,
        options: {
          data: {
            full_name: formData.full_name,
            phone: formData.phone,
            user_type: formData.user_type,
          },
        },
      });
      if (!error && data.user) {
        const addedUser = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            full_name: formData.full_name,
            phone: formData.phone,
            user_type: formData.user_type,
            email: formData.email,
          },
        ]);
      }

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(
          "Registration successful! Please check your email for confirmation."
        );
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          password: "",
          user_type: "customer",
          confirm_password: "",
        });
        navigate("/auth");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center md:justify-center h-screen w-screen">
      <div className="font-bold sm:text-2xl text-lg tracking-widest">
        REGISTER
      </div>
      <form
        className="w-full md:w-[400px] lg:w-[500px] max-sm:border-none md:border-2 p-2 md:p-5 rounded-md mt-1 md:mt-3 focus-within:border-blue-500"
        onSubmit={hanldleSubmit}
      >
        <InputField
          inputDetails={{
            label: "Full name",
            name: "full_name",
            handleChange: handleChange,
            value: formData.full_name,
          }}
        />
        <InputField
          inputDetails={{
            label: "Phone",
            name: "phone",
            handleChange: handleChange,
            value: formData.phone,
          }}
        />
        <InputField
          inputDetails={{
            label: "Email",
            name: "email",
            type: "email",
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
        <PasswordField
          inputDetails={{
            label: "Confirm Password",
            name: "confirm_password",
            handleChange: handleChange,
            value: formData.confirm_password,
          }}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 md:p-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
          disabled={loading}
        >
          {loading ? "Registering ..." : "Register"}
        </button>
      </form>
      <div>
        Already have an account?
        <Link to="/auth" className="mt-2 text-blue-500 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
