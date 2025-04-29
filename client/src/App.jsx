import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Singup from "./components/Singup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import CheckEmail from "./components/CheckEmail";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, logout } from "../store/api";
import Loading from "./components/Loading";
import Swal from "sweetalert2";

function App() {
  const dispatch = useDispatch();
  const { userData, checkLoading, error } = useSelector((state) => state.auth);
  console.log(error);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  return checkLoading ? (
    <Loading />
  ) : error ? (
    Swal.fire({
      icon: "error",
      title: error.message || "An error occurred",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      localStorage.removeItem("userData");
      dispatch(logout());
    })
  ) : (
    <div className="max-h-screen bg-gray-800 text-amber-50">
      <div className="flex justify-center items-center">
        {userData ? (
          <button onClick={() => dispatch(logout())}>logout</button>
        ) : null}
      </div>

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
        <Route path="/loading" element={<Loading />} />
      </Routes>
    </div>
  );
}

export default App;
