import React, { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import PasswordField from '../components/PasswordField'

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {
      // ✅ Get current user
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;

      if (!email) {
        toast.error("User session not found. Please log in again.");
        return;
      }

      // ✅ Verify current password by signing in again
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: formData.currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        return;
      }

      // ✅ Update password
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (error) {
        toast.error("Failed to update password");
      } else {
        toast.success("Password changed successfully!");
        navigate("/profile");
      }
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-600 hover:text-gray-900 mr-3"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Change Password
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <PasswordField
            inputDetails={{
              label: "Current Password",
              name: "currentPassword",
              value: formData.currentPassword,
              handleChange: handleChange,
            }}
          />
          <PasswordField
            inputDetails={{
              label: "New Password",
              name: "newPassword",
              value: formData.newPassword,
              handleChange: handleChange,
            }}
          />
          <PasswordField
            inputDetails={{
              label: "Confirm New Password",
              name: "confirmPassword",
              value: formData.confirmPassword,
              handleChange: handleChange,
            }}
          />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition disabled:opacity-70"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Change Password
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
