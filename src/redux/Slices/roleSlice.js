import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://hospital.51development.shop/api";
const token = localStorage.getItem("token");
const clinic_id = localStorage.getItem("clinic_id");

// fetching all roles

export const fetchRoles = createAsyncThunk(
  "role/fetchRoles",
  async (_, { rejectedWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}`, "X-Clinic-ID": clinic_id },
      });

      return response.data.roles;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Role fetch failed");
    }
  }
);

export const createRole = createAsyncThunk(
  "role/createRole",
  async (roleName, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/add-roles`,
        { name: roleName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Clinic-ID": clinic_id,
          },
        }
      );

      return response.data;
      console.log(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Role creation failed");
    }
  }
);

export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async (roleId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/delete-roles/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Clinic-ID": clinic_id,
        },
      });
      return roleId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete role");
    }
  }
);

const roleSlice = createSlice({
  name: "role",
  initialState: {
    loading: false,
    error: null,
    roles: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetching roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // creating roleSlice

      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload.data);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // dlting roles
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((role) => role.id !== action.payload);
      });
  },
});

export default roleSlice.reducer;
