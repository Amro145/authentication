import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

function CheckEmail() {
  const checkEmailSchema = Yup.object().shape({
    code: Yup.string()
      .matches(/^[0-9]+$/, "Code must be a number")
      .min(6, "Code must be 6 digits")
      .max(6, "Code must be 6 digits")
      .required("Code is required"),
  });
  return (
    <div className="h-screen flex flex-col gap-4 items-center justify-center ">
      <h1 className="text-4xl">verify Email</h1>
      <Formik
        initialValues={{ code: "" }}
        validationSchema={checkEmailSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4 w-[400px]">
            <div className="flex flex-col gap-2">
              <label htmlFor="code"> Enter Code</label>
              <Field
                className="border-2 p-1 border-black"
                type="string"
                name="code"
              />
              <ErrorMessage
                name="code"
                component="div"
                className="error text-red-500"
              />
            </div>

            <button
              type="submit"
              className="bg-green-900 p-1 cursor-pointer hover:bg-green-700 duration-200 "
              disabled={isSubmitting}
            >
              verify
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

export default CheckEmail;
