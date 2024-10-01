import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import authImg from "../../assets/authImg.png";
import { useTranslation } from "react-i18next";
import { Bars } from "react-loader-spinner";
import { useChangePasswordMutation } from "../../store/userDetailSlice";

const passwordChangeSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old Password is required"),
  newPassword: Yup.string()
    .required("New Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[!@#$%^&*])/,
      "Password must contain at least one special character"
    )
    .matches(/^\S*$/, "Password cannot contain spaces"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const initialValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePassword() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();
      toast.success(t("Password Change successfully!"));
      navigate("/home");
    } catch (error) {
      toast.error(
        t("Could not Change password: ") +
          (error.data?.message || t("Unknown error"))
      );
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
      <Box
        sx={{
          width: isMobile ? "85%" : { sm: "78%", md: "62%", lg: "30%" },
          m: "2rem auto",
          backgroundColor: "#ffffff8f",
          zIndex: "2",
          borderRadius: "20px",
          padding: "1rem",
          boxShadow: "4px 6px 7px 0px #707070",
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              m: "10px 0 25px",
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "21px", color: "#fff" }}
            >
              {t("Change your password")}
            </Typography>
          </Box>
          <Formik
            initialValues={initialValues}
            validationSchema={passwordChangeSchema}
            onSubmit={handleSubmit}
          >
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
                  alignItems: "center",
                  columnGap: "20px",
                  mb: "18px",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Field
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  placeholder="Enter old password"
                  style={{
                    width: isMobile ? "100%" : "300px",
                    padding: "13px 20px",
                    borderRadius: "25px",
                    border: "none",
                    fontSize: "16px",
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
                  name="oldPassword"
                  component="div"
                />
                <Field
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter new password"
                  style={{
                    width: isMobile ? "100%" : "300px",
                    padding: "13px 20px",
                    borderRadius: "25px",
                    border: "none",
                    fontSize: "16px",
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
                  name="newPassword"
                  component="div"
                />
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  style={{
                    width: isMobile ? "100%" : "300px",
                    padding: "13px 20px",
                    borderRadius: "25px",
                    fontSize: "16px",
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
                  name="confirmPassword"
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
                    "&:hover": {
                      backgroundColor: "#f57f3d",
                    },
                  }}
                  type="submit"
                  disabled={isLoading}
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
                    t("Change")
                  )}
                </Button>
              </Box>
            </Form>
          </Formik>
        </Box>
      </Box>
    </Box>
  );
}
