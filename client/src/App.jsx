import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Singup from "./components/Singup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import CheckEmail from "./components/CheckEmail";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/api";

function App() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  useEffect(() => {
    console.log(userData);
  }, [userData]);
  return (
    <div className="max-h-screen bg-gray-800 text-amber-50">
      <button onClick={() => dispatch(logout())}>logout</button>
      <Routes>
        <Route
          path="/"
          element={
            userData ? (
              userData?.resetPasswordToken ? (
                <Navigate
                  to={`/reset-password/${userData.resetPasswordToken}`}
                />
              ) : userData?.verificationToken ? (
                <Navigate to="/check-email" />
              ) : (
                <Home />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            userData ? (
              userData?.verificationToken ? (
                <Navigate to="/check-email" /> // Redirect to check-email page
              ) : (
                <Navigate to="/" /> // Redirect to home page
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/singup"
          element={userData ? <Navigate to="/" /> : <Singup />}
        />
        <Route
          path="/forgot-password"
          element={userData ? <Navigate to="/" /> : <ForgotPassword />}
        />
        <Route
          path="/reset-password/:token"
          element={
            userData?.resetPasswordToken ? (
              <ResetPassword token={userData.resetPasswordToken} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/check-email"
          element={
            userData && userData.verificationToken ? (
              <CheckEmail />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
