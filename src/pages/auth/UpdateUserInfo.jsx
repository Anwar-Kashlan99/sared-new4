import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "../../assets/profile.png";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { DeleteOutline } from "@mui/icons-material";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Bars } from "react-loader-spinner";
import { useUpdateUserMutation } from "../../store/authSlice";

const linkOptions = [
  "Facebook",
  "WhatsApp",
  "YouTube",
  "Instagram",
  "Gmail",
  "X",
];

export default function UpdateUserInfo() {
  const navigate = useNavigate();
  const { userDetails } = useSelector((state) => state.user);
  const { t } = useTranslation();

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const isMobile = useMediaQuery("(max-width: 768px)");

  // handle image
  const [file, setFile] = useState(null);
  const profileImageUrl =
    `${process.env.REACT_APP_SERVER_DOMAIN}/${userDetails?.profile}` || avatar;

  const onUpload = (e) => {
    setFile(e.target.files[0]);
  };

  // handle links
  const [links, setLinks] = useState(userDetails?.links || []);
  console.log(links);

  const addLink = () => {
    if (links.length < linkOptions.length) {
      const newLinks = [...links, { name: "", url: "" }];
      setLinks(newLinks);
    }
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = links.map((link, idx) => {
      if (idx === index) {
        return { ...link, [field]: value };
      }
      return link;
    });
    setLinks(newLinks);
  };
  const removeLink = (index) => {
    const newLinks = links.filter((_, idx) => idx !== index);

    setLinks(newLinks);
  };

  const getAvailableOptions = (selectedTitle) => {
    const selectedTitles = links
      .map((link) => link.name)
      .filter((name) => name);
    return linkOptions.filter(
      (option) => !selectedTitles.includes(option) || option === selectedTitle
    );
  };
  //////

  const initialValues = {
    first_name: userDetails?.first_name || "",
    last_name: userDetails?.last_name || "",
    username: userDetails?.username || "",
    mobile: userDetails?.mobile || "",
    address: userDetails?.address || "",
    gender: userDetails?.gender || "male",
    Bios: userDetails?.Bios || "",
  };

  const updateSchema = Yup.object().shape({
    first_name: Yup.string(),
    last_name: Yup.string(),
    gender: Yup.string(),
    address: Yup.string(),
    Bios: Yup.string(),
    username: Yup.string(),
    mobile: Yup.string()
      .matches(/^\d+$/, "Mobile must contain only digits")
      .min(10, "Mobile must be at least 10 digits")
      .max(15, "Mobile must not exceed 15 digits"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("mobile", values.mobile);
      formData.append("address", values.address);
      formData.append("gender", values.gender);
      formData.append("Bios", values.Bios);
      formData.append("username", values.username);
      if (file) {
        formData.append("profile", file);
      }
      formData.append("links", JSON.stringify(links));

      await updateUser(formData).unwrap();
      toast.success("Profile updated successfully!");
      console.log("values:", values);
      navigate("/home");
    } catch (error) {
      toast.error(`Update failed: ${error.message || "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        justifyContent: "flex-end", // Align to the right
        bgcolor: "#707070",
        backgroundSize: isMobile ? "cover" : "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Box
        sx={{
          width: isMobile ? "98%" : { sm: "78%", md: "62%", lg: "40%" },
          margin: isMobile ? "6rem 1.5rem" : "6rem 2rem 2rem", // Adjust the margins
          backgroundColor: "#ffffff73",
          height: "fit-content",
          borderRadius: "20px",
          padding: "1rem",
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
                sx={{
                  fontWeight: "bold",
                  fontSize: isMobile ? "22px" : "25px",
                  color: "#fff",
                }}
              >
                {t("Update User Information")}
              </Typography>
            </Box>
            <Formik
              initialValues={initialValues}
              validationSchema={updateSchema}
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
                      width: "175px",
                      height: "175px",
                      borderRadius: "50%",
                      mb: "25px",
                      position: "relative",
                    }}
                  >
                    <label htmlFor="profile">
                      <img
                        src={file ? URL.createObjectURL(file) : profileImageUrl}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          backdropFilter: "blur(7.1px)",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                        alt="avatar"
                      />
                    </label>
                    <input
                      onChange={onUpload}
                      id="profile"
                      name="profile"
                      type="file"
                      accept="image/*"
                      style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                    />
                  </Box>

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
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Field
                        type="text"
                        id="username"
                        name="username"
                        placeholder="username"
                        style={{
                          width: isMobile ? "100%" : "470px",
                          padding: "13px 20px",
                          fontSize: "16px",
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "4px 6px 7px 0px #707070",
                          outline: "none",
                          marginBottom: "15px",
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: isMobile ? "column" : "row",
                        columnGap: isMobile ? "" : "10px",
                      }}
                    >
                      <Field
                        type="text"
                        id="first_name"
                        name="first_name"
                        placeholder="First Name"
                        style={{
                          width: isMobile ? "100%" : "230px",
                          padding: "13px 20px",
                          fontSize: "16px",
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "4px 6px 7px 0px #707070",
                          outline: "none",
                          marginBottom: "15px",
                        }}
                      />
                      <Field
                        type="text"
                        id="last_name"
                        name="last_name"
                        placeholder="Last Name"
                        style={{
                          width: isMobile ? "100%" : "230px",
                          padding: "13px 20px",
                          fontSize: "16px",
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "4px 6px 7px 0px #707070",
                          outline: "none",
                          marginBottom: "15px",
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: isMobile ? "" : "10px",
                        flexDirection: isMobile ? "column" : "row",
                      }}
                    >
                      <Field
                        type="text"
                        id="mobile"
                        name="mobile"
                        placeholder="Mobile"
                        style={{
                          width: isMobile ? "100%" : "230px",
                          padding: "13px 20px",
                          fontSize: "16px",
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "4px 6px 7px 0px #707070",
                          outline: "none",
                          marginBottom: "15px",
                        }}
                      />
                      <Field
                        as="select"
                        id="gender"
                        name="gender"
                        style={{
                          width: isMobile ? "100%" : "230px",
                          padding: "13px 20px",
                          fontSize: "16px",
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "4px 6px 7px 0px #707070",
                          outline: "none",
                          marginBottom: "15px",
                          color: "#707070",
                        }}
                      >
                        <option value="male">{t("Male")}</option>
                        <option value="female">{t("Female")}</option>
                      </Field>
                    </Box>
                    <ErrorMessage
                      style={{
                        color: "red",
                        fontSize: "14px",
                        marginBottom: "10px",
                        marginLeft: "5px",
                        alignSelf: "flex-start",
                      }}
                      name="mobile"
                      component="div"
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: isMobile ? "" : "10px",
                        flexDirection: isMobile ? "column" : "row",
                      }}
                    >
                      <Field
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Address"
                        style={{
                          width: isMobile ? "100%" : "230px",
                          padding: "13px 20px",
                          fontSize: "16px",
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "4px 6px 7px 0px #707070",
                          outline: "none",
                          marginBottom: "15px",
                        }}
                      />

                      <Field
                        type="text"
                        id="Bios"
                        name="Bios"
                        placeholder="BIO"
                        style={{
                          width: isMobile ? "100%" : "230px",
                          padding: "13px 20px",
                          fontSize: "16px",
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "4px 6px 7px 0px #707070",
                          outline: "none",
                          marginBottom: "15px",
                        }}
                      />
                    </Box>

                    <Box>
                      {links.map((link, index) => (
                        <Box key={index} sx={{ marginBottom: "15px" }}>
                          <FormControl fullWidth>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "baseline",
                                columnGap: isMobile ? "" : "10px",
                                flexDirection: isMobile ? "column" : "row",
                              }}
                            >
                              <Select
                                value={link.name}
                                size="small"
                                style={{
                                  width: isMobile ? "100%" : "160px",
                                  backgroundColor: "#fff",
                                  fontSize: "16px",
                                  padding: "3px 20px",
                                  borderRadius: "20px",
                                  border: "none",
                                  boxShadow: "4px 6px 7px 0px #707070",
                                  outline: "none",
                                  color: "#707070",
                                  marginBottom: isMobile ? "16px" : "",
                                }}
                                MenuProps={{
                                  PaperProps: {
                                    sx: {
                                      "& .MuiMenuItem-root": {
                                        "&[aria-hidden='true']": {
                                          display: "none",
                                          pointerEvents: "none",
                                        },
                                      },
                                    },
                                  },
                                }}
                                onChange={(e) =>
                                  handleLinkChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                              >
                                {getAvailableOptions(link.name).map(
                                  (option) => (
                                    <MenuItem
                                      key={option}
                                      value={option}
                                      aria-hidden={false}
                                    >
                                      {option}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                              <Box
                                key={index}
                                sx={{
                                  position: "relative",
                                }}
                              >
                                <Field
                                  type="text"
                                  value={link.url}
                                  name={`links[${index}].url`}
                                  placeholder="Enter a link"
                                  style={{
                                    width: isMobile ? "100%" : "300px",
                                    padding: "13px 20px",
                                    fontSize: "16px",
                                    borderRadius: "20px",
                                    border: "none",
                                    boxShadow: "4px 6px 7px 0px #707070",
                                    outline: "none",
                                  }}
                                  onChange={(e) =>
                                    handleLinkChange(
                                      index,
                                      "url",
                                      e.target.value
                                    )
                                  }
                                />
                                <IconButton
                                  sx={{
                                    position: "absolute",
                                    right: "0",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                  }}
                                  onClick={() => removeLink(index)}
                                >
                                  <DeleteOutline />
                                </IconButton>
                              </Box>
                            </Box>
                          </FormControl>
                        </Box>
                      ))}
                      {links.length < linkOptions.length && (
                        <Button
                          sx={{
                            color: "#FFF",
                            backgroundColor: "#f25f0c",
                            mb: links.length > 0 ? "15px" : "10px",
                            boxShadow: "1px 3px 7px 0px #707070",
                            borderRadius: "25px",
                            padding: "5px 15px",
                            marginLeft: links.length > 0 ? "10px" : "",
                          }}
                          onClick={addLink}
                        >
                          {t("Add Link")}
                        </Button>
                      )}
                    </Box>

                    <Button
                      sx={{
                        color: "#fff",
                        p: "7px 20px",
                        borderRadius: "20px",
                        fontSize: "16px",
                        boxShadow: "1px 3px 7px 0px #707070",
                        backgroundColor: "#f25f0c",
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
                        t("Update")
                      )}
                    </Button>
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
