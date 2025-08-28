import React, { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

const EditProfile = ({ user, refetchUser }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.user_metadata) {
      setFormData({
        full_name: user.user_metadata.full_name || "",
        email: user.email || "",
        phone: user.user_metadata.phone || "",
        bio: user.user_metadata.bio || "",
      });
    }
  }, [user]);

  const updateUser = async (formData) => {
    const phoneRegex = /^(?:\+254|0)?(\d{9})$/;

    if ( formData.phone && !phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    const { data, error } = await supabase.auth.updateUser({
      data: {
        phone: formData.phone,
        bio: formData.bio,
      },
    });

    if (error) {
      toast.error("Failed to update. Please try again.");
      return;
    }

    toast.success("Profile updated successfully!");
    return data;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(formData);
      refetchUser();
      navigate("/profile");
    } catch (err) {
      toast.error("Update failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-600 hover:text-gray-900 mr-3"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Edit Profile
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              disabled
              onChange={handleChange}
              className="w-full border border-gray-200 bg-gray-100 rounded-lg p-2 text-gray-500 cursor-not-allowed"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="w-full border border-gray-200 bg-gray-100 rounded-lg p-2 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. +254700000000"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition disabled:opacity-70"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Save Changes
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

export default EditProfile;
