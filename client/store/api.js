import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"
import Swal from "sweetalert2";

export const signup = createAsyncThunk("auth/signup", async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post("http://localhost:3000/signup", data, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.log(error.response?.data.message);
        Swal.fire({
            icon: "error",
            title: error.response?.data.message || "An error occurred",
        });
        return rejectWithValue(error.response?.data || error.message);

    }
});
export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post("http://localhost:3000/signin", data, { withCredentials: true });
        Swal.fire({
            title: "Login successful",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});
export const logout = createAsyncThunk("auth/logout", async () => {
    try {
        const res = axios.post("localhost:3000/logout", {}, { withCredentials: true })
        return res.data
    } catch (error) {
        console.log(error);
    }
})


export const checkEmail = createAsyncThunk("auth/checkEmail", async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post(`http://localhost:3000/verify-email`, data, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});
export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post(`http://localhost:3000/forgot-password`, data, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});
export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axios.post(`http://localhost:3000/reset-password/${id}`, data, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});
export const checkAuth = createAsyncThunk("auth/checkAuth", async ({ rejectWithValue }) => {
    try {
        const res = await axios.get(`localhost:3000/check-auth`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});
