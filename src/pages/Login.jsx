import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/Slices/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      // Login sucess
      navigate("/admin-dashboard");
    } else {
      // login failed 
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-40 h-40">
              <img
                src="/assets/images/logo.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-black font-poppins text-center mb-8">
        Log In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black">
              <svg
                width="20"
                height="20"
                fill="black"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect
                  x="2"
                  y="4"
                  width="20"
                  height="16"
                  rx="4"
                  stroke="currentColor"
                  fill="none"
                />
                <path d="M2 6l10 7 10-7" stroke="currentColor" fill="none" />
              </svg>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 py-4 bg-gray-50 border-0 rounded-xl text-black placeholder-black font-semibold font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black">
              {/* Password SVG icon */}
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect
                  x="5"
                  y="11"
                  width="14"
                  height="8"
                  rx="2"
                  stroke="currentColor"
                  fill="none"
                />
                <path d="M12 15v2" stroke="currentColor" />
                <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-black font-semibold font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={`w-full bg-[#246afd] hover:bg-blue-600 text-white font-bold font-poppins py-4 px-6 rounded-3xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center`}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
