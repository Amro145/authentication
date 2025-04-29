import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Email is required"),
  });
  return (
    <div className="h-screen flex flex-col gap-4 items-center justify-center ">
      <h1 className="text-4xl">Forgot Password</h1>
      <Formik
        initialValues={{ password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ isSubmitting }) => (
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
              disabled={isSubmitting}
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
