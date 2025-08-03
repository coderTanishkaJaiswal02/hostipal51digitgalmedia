import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://hospital.51development.shop/api";
const token = localStorage.getItem("token");
const clinic_id = localStorage.getItem("clinic_id");

export const createUser = createAsyncThunk(
  "/user/createUser",
  async (userData, { rejectedWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/add-users`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Clinic-ID": clinic_id,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// fething users to show on admin dashboard

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",

  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Clinic-ID": clinic_id,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// updating users

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Clinic-ID": clinic_id,
          "Content-Type": "multipart/form-data",
        },
      };

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("password_confirmation", formData.password_confirmation);
      data.append("mobile_no", formData.mobile_no);
      data.append("role_id", formData.role_id);
      data.append("_method", "PUT");

      const response = await axios.post(
        `${BASE_URL}/update-users/${id}`,
        data,
        config
      );

      console.log("updated");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// deleting user by admin

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/delete-users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Clinic-ID": clinic_id,
          },
        }
      );
      return userId; // we'll remove by ID from store
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// toggle button api

export const toggleUserStatus = createAsyncThunk(
  "users/toggleUserStatus",
  async ({ id, status }) => {
    const response = await axios.put(
      `${BASE_URL}/users/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Clinic-ID": clinic_id,
        },
      }
    );
console.log(response.data);

    return { id, status: response.data.status };
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    loading: false,
    success: false,
    error: null,
    users: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // create user reducers

      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";

        // fetch-user reducers
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // update user

    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        // optional: update local state.users array
        const updatedUser = action.payload?.user;
        if (updatedUser && Array.isArray(state.users?.data)) {
          const index = state.users.data.findIndex(
            (u) => u.id === updatedUser.id
          );
          if (index !== -1) {
            state.users.data[index] = updatedUser;
          }
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Update failed";
      });

    // dlete-user reducers

    builder
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // toggle section active inactive
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        if (state.users && Array.isArray(state.users.data)) {
          const user = state.users.data.find((u) => u.id === id);
          if (user) user.is_active = status;
          console.log(`user is : ${user}`);
          
        }
      });
  },
});

export default userSlice.reducer;
