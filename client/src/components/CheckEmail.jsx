import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { checkEmail } from "../../store/api";
import Loading from "./Loading";

function CheckEmail() {
  const dispatch = useDispatch();
  const { checkEmailLoading } = useSelector((x) => x.auth);

  const checkEmailSchema = Yup.object().shape({
    verificationToken: Yup.string()
      .matches(/^[0-9]+$/, "Code must be a number")
      .min(6, "Code must be 6 digits")
      .max(8, "Code must be 8 digits")
      .required("Code is required"),
  });
  return checkEmailLoading ? (
    <Loading />
  ) : (
    <div className="h-screen flex flex-col gap-4 items-center justify-center ">
      <h1 className="text-4xl">verify Email</h1>

      <Formik
        initialValues={{ verificationToken: "" }}
        validationSchema={checkEmailSchema}
        onSubmit={(values) => {
          const numericCode = Number(values.verificationToken);
          dispatch(checkEmail({ verificationToken: numericCode }));
          console.log(values);
        }}
      >
        {({ isValid }) => (
          <Form className="flex flex-col gap-4 w-[400px]">
            <div className="flex flex-col gap-2">
              <label htmlFor="verificationToken">Enter Code</label>
              <Field
                className="border-2 p-1 border-black"
                type="number"
                name="verificationToken"
              />
              <ErrorMessage
                name="verificationToken"
                component="div"
                className="error text-red-500"
              />
            </div>

            <button
              type="submit"
              className="bg-green-900 p-1 cursor-pointer hover:bg-green-700 duration-200 "
              disabled={!isValid || checkEmailLoading}
            >
              verify
            </button>
          </Form>
        )}
      </Formik>

      <div>
        <span className="text-gray-300">
          We have sent a verification code to your email. Please enter the code
          below to verify your email address.
        </span>
        <p className="text-gray-300">Check your email for the code.</p>
        <button className="text-center text-xl text-blue-500 cursor-pointer">
          Resend code ?
        </button>
      </div>
    </div>
  );
}

export default CheckEmail;
