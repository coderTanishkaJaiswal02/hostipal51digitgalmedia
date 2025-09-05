"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchLoggedInUser } from "../redux/Slices/authSlice";
import { LayoutDashboard, Menu, X } from "lucide-react";
import Sidebar from "../components/Admin/Sidebar";
import Navbar from "../components/Admin/Navbar";
// Import your actual pages here
import CreateUser from "../components/Admin/CreateUser";
import RoleManagement from "../components/Admin/RoleManagement";
import UserManagement from "../components/Admin/UserManagement";

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    setIsMobileMenuOpen(false); // close sidebar on mobile
  };

  const renderContent = () => {
    switch (activeItem) {
      case "create-user":
        return <CreateUser />;
      case "user-management":
        return <UserManagement />;
      case "role-management":
        return <RoleManagement />;
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center transition-all">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <LayoutDashboard className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Welcome to Admin Dashboard
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Currently showing:{" "}
                <span className="font-semibold text-blue-600 capitalize">
                  {activeItem.replace("-", " ")}
                </span>
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-2 left-4 z-50 p-3 bg-white rounded-full shadow-lg border border-gray-200 focus:outline-none"
      >
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activeItem={activeItem}
        handleItemClick={handleItemClick}
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 lg:w-72
          transform transition-transform duration-300 ease-in-out
          bg-white shadow-md lg:shadow-none
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:w-[calc(100%-18rem)] flex flex-col overflow-hidden">
        {/* Fixed Navbar */}
        <div className="fixed top-0 right-0 left-0 lg:left-72 z-30 bg-white border-b border-gray-200 shadow-sm">
          <Navbar />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto mt-16 p-4 lg:p-10 space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
