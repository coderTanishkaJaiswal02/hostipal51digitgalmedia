"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchLoggedInUser } from "../redux/Slices/authSlice";
import { LayoutDashboard, Menu, X } from "lucide-react";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
// Import your actual pages here
import CreateUser from "../components/Admin/CreateUser";
import UserList from "../components/Admin/UserList";
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
      case "user-list":
        return <UserList />;
      case "user-management":
        return <UserManagement />;
      case "role-management":
        return <RoleManagement />;
      default:
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to Admin Dashboard
              </h2>
              <p className="text-gray-600">
                Currently showing:{" "}
                <span className="font-medium capitalize">
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
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activeItem={activeItem}
        handleItemClick={handleItemClick}
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-80 lg:w-1/4
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:w-3/4 flex flex-col overflow-hidden">
        {/* Fixed Navbar */}
        <div className="fixed top-0 right-0 left-0 lg:left-1/4 z-30 bg-white border-b border-gray-200">
          <Navbar />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto mt-16 p-6 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
