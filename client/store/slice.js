import { createSlice } from "@reduxjs/toolkit";
import { checkEmail, forgotPassword, login, logout, resetPassword, signup } from "./api";

const initialState = {
    userData: [],
    checkLoading: false,
    signupLoading: false,
    signinLoading: false,
    checkEmailLoading: false,
    resetPasswordLoading: false,
    forgotPasswordLoading: false,
    logoutLoading: false,
    error: null,
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: (builder) => {
        builder
            // signup
            .addCase(signup.pending, (state) => {
                state.signupLoading = true;
                state.error = null
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.signupLoading = false;
                state.userData = action.payload.user;
                localStorage.setItem("userData", JSON.stringify(action.payload.user));
            })
            .addCase(signup.rejected, (state, action) => {
                state.signupLoading = false;
                state.error = action.payload
            })
            // login
            .addCase(login.pending, (state) => {
                state.signinLoading = true;
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.signinLoading = false;
                state.userData = action.payload.user;
                localStorage.setItem("userData", JSON.stringify(action.payload.user));
            })
            .addCase(login.rejected, (state, action) => {
                state.signinLoading = false;
                state.error = action.payload
            })
            // logout
            .addCase(logout.pending, (state) => {
                state.logoutLoading = true;
                state.error = null
            })
            .addCase(logout.fulfilled, (state) => {
                state.logoutLoading = false;
                state.userData = null;
                localStorage.setItem("userData", null);
            })
            .addCase(logout.rejected, (state, action) => {
                state.logoutLoading = false;
                state.error = action.payload
            })
            // checkEmail
            .addCase(checkEmail.pending, (state) => {
                state.checkEmailLoading = true;
                state.error = null
            })
            .addCase(checkEmail.fulfilled, (state, action) => {
                state.checkEmailLoading = false;
                state.userData = action.payload.user;
                localStorage.setItem("userData", JSON.stringify(action.payload.user));
            })
            .addCase(checkEmail.rejected, (state, action) => {
                state.checkEmailLoading = false;
                state.error = action.payload
            })
            // forgetPassword
            .addCase(forgotPassword.pending, (state) => {
                state.forgotPasswordLoading = true;
                state.error = null
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.forgotPasswordLoading = false;
                state.userData = action.payload.user;
                localStorage.setItem("userData", JSON.stringify(action.payload.user));
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.forgotPasswordLoading = false;
                state.error = action.payload
            })
            // reset Password
            .addCase(resetPassword.pending, (state) => {
                state.resetPasswordLoading = true;
                state.error = null
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.resetPasswordLoading = false;
                state.userData = action.payload.user;
                localStorage.setItem("userData", JSON.stringify(action.payload.user));
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.resetPasswordLoading = false;
                state.error = action.payload
            })


    }
})
export default authSlice.reducer