import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoutes from "./Routes/ProtectedRoutes";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={
          <ProtectedRoutes>
            <AdminDashboard />
          </ProtectedRoutes>
        } />
      </Routes>
    </div>
  );
};

export default App;
