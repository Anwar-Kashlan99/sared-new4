import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import authImg from "../../assets/authImg.png";
import { useTranslation } from "react-i18next";
import { Bars } from "react-loader-spinner";
import { useRegisterUserWithOTPMutation } from "../../store/authSlice";

const registrationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[!@#$%^&*])/,
      "Password must contain at least one special character"
    )
    .matches(/^\S*$/, "Password cannot contain spaces"),
});

const initialValues = {
  username: "",
  email: "",
  password: "",
};

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [registerUserWithOTP, { isLoading }] = useRegisterUserWithOTPMutation();

  /** formik doensn't support file upload so we need to create this handler */
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await registerUserWithOTP({ ...values }).unwrap();

      toast.success(t("Registration successful! OTP sent to your email."));
      navigate("/verify-otp", {
        state: { email: values.email, operationContext: "register" },
      });
    } catch (error) {
      toast.error(
        t("Could not register. ") + (error.data?.message || t("Unknown error"))
      );
      console.error("Registration failed:", error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${authImg})`,
        backgroundSize: isMobile ? "cover" : "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "0",
          left: "0",
          zIndex: "1",
          backgroundColor: "#00000026",
        }}
      />
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Box
        sx={{
          width: isMobile ? "90%" : { sm: "78%", md: "62%", lg: "32%" },
          m: isMobile ? "6rem auto 3rem" : "4.5rem auto 2rem",
          backgroundColor: "#ffffff8f",
          borderRadius: "20px",
          padding: "1rem",
          boxShadow: "4px 6px 7px 0px #707070",
          zIndex: "2",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                m: "10px 0 25px",
              }}
            >
              <Typography
                sx={{ fontWeight: "bold", fontSize: "20px", color: "#fff" }}
              >
                {t("Register")}
              </Typography>
            </Box>
            <Formik
              initialValues={initialValues}
              validationSchema={registrationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Field
                      type="text"
                      id="username"
                      name="username"
                      placeholder="User Name"
                      style={{
                        width: isMobile ? "100%" : "300px",
                        padding: "13px 20px",
                        fontSize: "16px",
                        borderRadius: "20px",
                        border: "none",
                        boxShadow: "4px 6px 7px 0px #707070",
                        outline: "none",
                        marginBottom: "15px",
                      }}
                    />
                    <ErrorMessage
                      style={{
                        color: "red",
                        fontSize: "14px",
                        marginBottom: "10px",
                        marginLeft: "5px",
                      }}
                      name="username"
                      component="div"
                    />
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      style={{
                        width: isMobile ? "100%" : "300px",
                        padding: "13px 20px",
                        fontSize: "16px",
                        borderRadius: "20px",
                        border: "none",
                        boxShadow: "4px 6px 7px 0px #707070",
                        outline: "none",
                        marginBottom: "15px",
                      }}
                    />
                    <ErrorMessage
                      style={{
                        color: "red",
                        fontSize: "14px",
                        marginBottom: "10px",
                        marginLeft: "5px",
                      }}
                      name="email"
                      component="div"
                    />
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      style={{
                        width: isMobile ? "100%" : "300px",
                        padding: "13px 20px",
                        fontSize: "16px",
                        borderRadius: "20px",
                        border: "none",
                        boxShadow: "4px 6px 7px 0px #707070",
                        outline: "none",
                        marginBottom: "25px",
                      }}
                    />
                    <ErrorMessage
                      style={{
                        color: "red",
                        fontSize: "14px",
                        marginBottom: "10px",
                        marginLeft: "5px",
                      }}
                      name="password"
                      component="div"
                    />
                    <Button
                      sx={{
                        color: "#fff",
                        p: "7px 20px",
                        borderRadius: "20px",
                        fontSize: "16px",
                        boxShadow: "2px 6px 7px 0px #707070",
                        backgroundColor: isLoading ? "#ff9d66" : "#f25f0c",
                        marginBottom: "20px",
                        "&:hover": {
                          backgroundColor: "#f57f3d",
                        },
                      }}
                      type="submit"
                      disabled={isSubmitting || isLoading}
                    >
                      {isLoading ? (
                        <Bars
                          height="27"
                          width="45"
                          color="#f25f0c"
                          ariaLabel="bars-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                          visible={true}
                        />
                      ) : (
                        t("Register")
                      )}
                    </Button>
                  </Box>

                  <Box sx={{ marginLeft: "4px" }}>
                    <span style={{ color: "#fff" }}>
                      {t("Already Register?")}{" "}
                      <span
                        style={{
                          color: "#f25f0c",
                          cursor: "pointer",
                          "&:hover": {
                            color: "#f57f3d",
                          },
                        }}
                        onClick={() => navigate("/login")}
                      >
                        {t("Login Now")}
                      </span>
                    </span>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
