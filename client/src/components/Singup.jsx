import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../store/api";
import Loading from "./Loading";

function Singup() {
  const dispatch = useDispatch();
  const { userData, signupLoading } = useSelector((x) => x.auth);
  const singupSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Email is required"),
    name: Yup.string().required("UserName is required"),
    password: Yup.string()
      .min(8, "password must be at least 8 characters")
      .required("Password is required"),
  });
  return signupLoading ? (
    <Loading />
  ) : (
    <div className="h-screen flex flex-col gap-4 items-center justify-center ">
      <h1 className="text-4xl">Singup</h1>
      <Formik
        initialValues={{ email: "", password: "", name: "" }}
        validationSchema={singupSchema}
        onSubmit={(values) => {
          dispatch(signup(values));
          console.log(userData);
        }}
      >
        {({ isValid }) => (
          <Form className="flex flex-col gap-4 w-[400px]">
            <div className="flex flex-col gap-2">
              <label htmlFor="name"> user Name</label>
              <Field
                className="border-2 p-1 border-black"
                type="text"
                name="name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="error text-red-500"
              />
            </div>

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
              disabled={!isValid || signupLoading}
            >
              Singup
            </button>
          </Form>
        )}
      </Formik>

      <div className="flex gap-2">
        <Link to="/login" className="text-blue-300 hover:underline">
          Already Have Account?
        </Link>
      </div>
    </div>
  );
}

export default Singup;
