import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/api";
import Loading from "./Loading";

function Login() {
  const dispatch = useDispatch();
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string()
      .min(8, "password must be at least 8 characters")
      .required("Password is required"),
  });
  const { userData, signinLoading } = useSelector((state) => state.auth);

  return signinLoading ? (
    <Loading />
  ) : (
    <div className="h-screen flex flex-col gap-4 items-center justify-center ">
      <h1 className="text-4xl">Login</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          dispatch(login(values));
          console.log(userData);
        }}
      >
        {({ isValid }) => (
          <Form className="flex flex-col gap-4 w-[400px]">
            <div className="flex flex-col gap-2">
              <label htmlFor="email"> Email</label>
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

            <div className="flex flex-col gap-2">
              <label htmlFor="password"> Password</label>
              <Field
                className="border-2 p-1 border-black"
                type="password"
                name="password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="error text-red-500"
              />
            </div>

            <button
              type="submit"
              className="bg-green-900 p-1 cursor-pointer hover:bg-green-700 duration-200 "
              disabled={!isValid || signinLoading}
            >
              تسجيل الدخول
            </button>
          </Form>
        )}
      </Formik>
      <div className="flex gap-2">
        <Link to="/singup" className="text-blue-300 hover:underline">
          create an account
        </Link>
        <Link to="/forgot-password" className="text-blue-300 hover:underline">
          forgot password ?
        </Link>
      </div>
    </div>
  );
}

export default Login;
