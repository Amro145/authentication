import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, Navigate } from "react-router-dom";
import { forgotPassword } from "../../store/api";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";

function ForgotPassword() {
  const dispatch = useDispatch();
  const { forgotPasswordLoading } = useSelector((x) => x.auth);
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Email is required"),
  });
  return forgotPasswordLoading ? (
    <Loading />
  ) : (
    <div className="h-screen flex flex-col gap-4 items-center justify-center ">
      <h1 className="text-4xl">Forgot Password</h1>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          console.log(values);
          dispatch(forgotPassword({ email: values.email }));
          Navigate("/check-email");
        }}
      >
        {({ isValid }) => (
          <Form className="flex flex-col gap-4 w-[400px]">
            <div className="flex flex-col gap-2">
              <label htmlFor="email"> Enter Your Email </label>
              <Field
                className="border-2 p-1 border-black"
                type="email"
                name="email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="error text-red-500"
              />
            </div>

            <button
              type="submit"
              className="bg-green-900 p-1 cursor-pointer hover:bg-green-700 duration-200 "
              disabled={!isValid || forgotPasswordLoading}
            >
              send Reset Link
            </button>
            <div>
              <span className="text-gray-500">Remembered your password? </span>
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ForgotPassword;
