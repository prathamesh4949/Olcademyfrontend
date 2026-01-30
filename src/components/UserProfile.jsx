
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/constant";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ✅ for modal
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const sidebarLinks = [
    { id: "profile", label: "Profile" },
    { id: "orders", label: "My Orders" },
  ];

  // ✅ Load user data
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserData(res.data.user);
        setFormData({
          username: res.data.user.username || "",
          email: res.data.user.email || "",
        });
      })
      .catch(() => setError("Profile load error"))
      .finally(() => setLoading(false));
  }, [token]);

  // ✅ Handle profile edit save
  const handleSave = async () => {
    try {
      const res = await axios.put(`${API_BASE_URL}/user/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data.user);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Profile update failed");
    }
  };

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setShowLogoutModal(false);
    navigate("/login");
  };

  // ✅ Profile Section
  const renderProfile = () => (
    <div className="relative w-[740px] bg-[#F9F7F6] p-10 shadow-[0_10px_32px_#e3dbc9be] border border-[#7D7D7D] rounded-md mt-10">
      <h2 className="text-[26px] font-Playfair font-bold uppercase text-[#341405] mb-8 border-b border-[#7D7D7D] pb-3 tracking-[0.05em]">
        Personal Info
      </h2>

      {/* Name */}
      <div className="mt-4">
        <label className="block text-[26px] font-Playfair font-bold uppercase text-[#341405] mb-3 tracking-[0.05em]">
          Name
        </label>
        {isEditing ? (
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="h-[67px] w-full bg-white border border-[#7D7D7D] text-[20px] text-[#341405] px-3 rounded-md"
          />
        ) : (
          <div className="h-[67px] bg-[#F9F7F6] border-b border-[#7D7D7D] flex items-center text-[20px] text-[#341405] px-2">
            {userData?.username || ""}
          </div>
        )}
      </div>

      {/* Email */}
      <div className="mt-8">
        <label className="block text-[26px] font-Playfair font-bold uppercase text-[#341405] mb-3 tracking-[0.05em]">
          Contact
        </label>
        {isEditing ? (
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="h-[67px] w-full bg-white border border-[#7D7D7D] text-[20px] text-[#341405] px-3 rounded-md"
          />
        ) : (
          <div className="h-[67px] bg-[#F9F7F6] border-b border-[#7D7D7D] flex items-center text-[20px] text-[#341405] px-2">
            {userData?.email || ""}
          </div>
        )}
      </div>

      {/* Save Changes Button */}
      {isEditing && (
        <div className="flex justify-end mt-10">
          <button
            onClick={handleSave}
            className="bg-[#482910] text-white px-8 py-3 rounded-md font-semibold tracking-wider"
          >
            SAVE CHANGES
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#faf7f2] font-[Georgia] text-[#482910]">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-[#eae5dc] flex flex-col items-center">
        <div className="w-[88%] flex flex-col items-center pt-10">
          <div className="w-[80px] h-[80px] rounded-full bg-[#482910] text-white flex items-center justify-center font-semibold text-[2.6rem] mb-4">
            {(userData?.username || "U")[0].toUpperCase()}
          </div>
          <div className="font-semibold text-[1.14rem] text-[#482910] mb-9 text-center">
            {userData ? userData.username : "Login"}
          </div>

          {/* Edit Profile Button */}
          {userData && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full bg-[#482910] text-white py-3 rounded-sm font-semibold mb-9 tracking-wider"
            >
              {isEditing ? "CANCEL EDIT" : "EDIT PROFILE"}
            </button>
          )}
        </div>

        {/* Sidebar Links */}
        <nav className="w-full mt-7">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                if (link.id === "orders") {
                  navigate('/orders');
                } else {
                  setActiveTab(link.id);
                }
              }}
              className={`w-full text-left py-3 px-4 font-medium text-[1.01rem] tracking-tight ${
                activeTab === link.id
                  ? "bg-[#f8f6f2] border-l-[3.5px] border-[#482910]"
                  : "hover:bg-[#f8f6f2]"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <hr className="border-t border-[#eae5dc] w-[87%] my-6" />

        {/* ✅ Logout/Login Button */}
        {userData ? (
          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-[#ad8571] font-semibold text-[1.03rem] self-start ml-[8%] mb-4"
          >
            LOG OUT
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-[#482910] font-semibold text-[1.03rem] self-start ml-[8%] mb-4"
          >
            LOGIN
          </button>
        )}
      </aside>

      {/* Main Panel */}
      <main className="flex-1 bg-[#faf7f2] py-14 flex flex-col items-center min-h-screen">
        {loading && <div className="mb-5">Loading...</div>}
        {error && <div className="text-red-600 font-semibold mb-5">{error}</div>}
        {activeTab === "profile" && renderProfile()}
      </main>

      {/* ✅ Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[350px] p-6 text-center">
            <h2 className="text-[20px] font-semibold mb-4 text-[#341405]">
              Are you sure you want to Logout?
            </h2>
            <div className="flex justify-around mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2 rounded-md bg-gray-300 text-[#341405] font-medium hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-md bg-[#482910] text-white font-semibold hover:bg-[#341405]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
