import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import userReducer from "./Slices/userSlice";
import roleReducer from "./Slices/roleSlice";
import permissionReducer from "./Slices/permissionSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    role: roleReducer,
    permissions: permissionReducer,
  },
});
