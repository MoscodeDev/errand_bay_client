import { BadgeCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Profile = ({ user }) => {
  // safe defaults
  const [userInfo, setUserInfo] = useState(user?.user_metadata || {});
  useEffect(() => {
    setUserInfo(user?.user_metadata || {});
  }, [user]);

  const fullName = userInfo?.full_name || "No name";
  const email = user?.email || userInfo?.email || "No email";
  const phone = userInfo?.phone || "No phone";
  const avatar = userInfo?.avatar_url || userInfo?.avatar || null;
  const emailVerified = Boolean(user?.email_confirmed_at);

  // initials for fallback avatar
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account details and contact information.
          </p>
        </header>

        <main className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Left: Avatar */}
            <div className="md:w-1/3 bg-gray-50 p-6 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 w-full">
                <div
                  className="h-28 w-28 rounded-full flex items-center justify-center text-2xl font-semibold text-white"
                  style={{
                    background:
                      avatar ? "transparent" : "linear-gradient(135deg,#4f46e5,#06b6d4)",
                  }}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={fullName}
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">{fullName}</h2>
                    {emailVerified && (
                      <span
                        title="Email verified"
                        className="text-blue-500"
                        aria-hidden
                      >
                        <BadgeCheck />
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{user?.role || "User"}</p>
                </div>

                <div className="w-full flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(email)
                    toast.success('Copied to clipboad')}}
                    className="flex-1 bg-white border border-gray-200 text-sm py-2 px-3 rounded-lg hover:shadow-sm transition"
                    title="Copy email to clipboard"
                  >
                    Copy Email
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="md:w-2/3 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-xs text-gray-500 mb-1">Full name</label>
                  <div className="text-sm text-gray-800 font-medium">{fullName}</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-xs text-gray-500 mb-1">Email</label>
                  <div className="text-sm text-gray-800 font-medium truncate">{email}</div>
                  <div className="text-xs mt-1 text-gray-500">
                    {emailVerified ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <BadgeCheck size={14} /> Verified
                      </span>
                    ) : (
                      <span className="text-yellow-600">Not verified</span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-xs text-gray-500 mb-1">Phone</label>
                  <div className="text-sm text-gray-800 font-medium">{phone}</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-xs text-gray-500 mb-1">Last signed in</label>
                  <div className="text-sm text-gray-800 font-medium">
                    {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Never"}
                  </div>
                </div>
              </div>

              {/* Bio / What's next */}
              <section className="mt-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">About</h3>
                <p className="text-sm text-gray-600">
                  {userInfo?.bio ||
                    "No bio available. You can add a short description about yourself in your account settings."}
                </p>
              </section>

              {/* Actions */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/profile/edit"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm text-center hover:bg-blue-700 transition"
                >
                  Edit profile
                </Link>

                <Link
                  to="/change-password"
                  className="inline-block px-4 py-2 border border-gray-200 text-gray-800 rounded-lg text-sm text-center hover:shadow-sm transition"
                >
                  Change password
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
