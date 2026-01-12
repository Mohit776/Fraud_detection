import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Register data:", data);
      const res = await authApi.post('/auth/register', data);
      return res.data.data;
    } catch (err) {
      console.error("Register error:", err.response?.data);
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
)

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.post('/auth/login', data);
      console.log("Login successful:", res.data);
      return res.data.data;
    } catch (err) {
      console.error("Login error:", err.response?.data);
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
)