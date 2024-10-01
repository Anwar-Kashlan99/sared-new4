import { Box, Button, useMediaQuery } from "@mui/material";
import blogImg from "../../assets/createblogimg.png";
import blogImg2 from "../../assets/createblogimg2.jpg";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Edit } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorMenuBar from "./EditorMenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { Fragment } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  useCreateBlogMutation,
  useGetCategoryQuery,
} from "../../store/blogSlice";
import { Bars } from "react-loader-spinner";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
});

const initialValues = {
  title: "",
  category: "technology",
  image: null,
};

const CreateBlog = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isBigScreen = useMediaQuery("(min-width: 1600px)");

  const { t } = useTranslation();

  const { data: category, isLoading: categoryLoading } = useGetCategoryQuery({
    key: "value",
  });

  const categorys = category?.data?.category;

  const [createBlog, { isLoading }] = useCreateBlogMutation();

  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const contentHTML = editor.getHTML();
    if (!contentHTML || contentHTML.trim() === "<p></p>") {
      setErrors({ content: "Content is required" });
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("category", values.category);
    formData.append("description", contentHTML);

    if (values.image) {
      formData.append("img", values.image);
    }
    try {
      const result = await createBlog(formData);
      navigate(`/blog/${result.data.data.newBlog._id}`);
      toast.success("Blog created successfully!");
    } catch (e) {
      toast.error("Failed to create blog");
      setSubmitting(false);
      console.error("Failed to create blog:", e);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: true, autolink: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "editor",
      },
    },
    editable: true,
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${blogImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Box
        sx={{
          width: isMobile ? "95%" : "80%",
          m: isMobile ? "5rem auto 3rem" : "4.5rem auto 2rem",
          padding: "1rem",
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values, errors, touched }) => (
            <Form>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  columnGap: "60px",
                  mb: isMobile ? undefined : "20px",
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <label htmlFor="image">
                    <input
                      type="file"
                      style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={(event) => {
                        setFieldValue("image", event.currentTarget.files[0]);
                      }}
                    />
                    {values.image && (
                      <Box
                        sx={{
                          borderRadius: "30px",
                          position: "relative",
                          width: isBigScreen
                            ? "700px"
                            : isMobile
                            ? "100%"
                            : "600px",
                          height: isBigScreen
                            ? "470px"
                            : isMobile
                            ? "300px"
                            : "400px",
                          mb: !isBigScreen ? "15px" : undefined,
                        }}
                      >
                        <img
                          src={URL.createObjectURL(values.image)}
                          alt="UploadedImage"
                          style={{
                            border: "5px solid #f25f0c",
                            height: "100%",
                            width: "100%",
                            borderRadius: "30px",
                            cursor: "pointer",
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          sx={{
                            width: "65px",
                            height: "65px",
                            borderRadius: "50%",
                            backgroundColor: "#707070",
                            position: "absolute",
                            bottom: "25px",
                            right: "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Edit sx={{ fontSize: "45px", color: "#fff" }} />
                        </Box>
                      </Box>
                    )}
                    {!values.image && (
                      <Box
                        sx={{
                          borderRadius: "30px",
                          position: "relative",
                          width: isBigScreen
                            ? "700px"
                            : isMobile
                            ? "100%"
                            : "600px",
                          height: isBigScreen
                            ? "470px"
                            : isMobile
                            ? "300px"
                            : "400px",
                          mb: !isBigScreen ? "15px" : undefined,
                        }}
                      >
                        <img
                          src={blogImg2}
                          alt="PlaceholderImagesup"
                          style={{
                            width: "100%",
                            borderRadius: "30px",
                            border: "5px solid #f25f0c",
                            cursor: "pointer",
                            objectFit: "cover",
                            height: "100%",
                          }}
                        />
                        <Box
                          sx={{
                            width: "65px",
                            height: "65px",
                            borderRadius: "50%",
                            backgroundColor: "#707070",
                            position: "absolute",
                            bottom: "25px",
                            right: "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Edit sx={{ fontSize: "45px", color: "#fff" }} />
                        </Box>
                      </Box>
                    )}
                  </label>
                </Box>
                <Box>
                  <Box
                    sx={{
                      mb: "10px",
                    }}
                  >
                    <Field
                      placeholder={t("Title")}
                      type="text"
                      id="title"
                      name="title"
                      style={{
                        width: isBigScreen
                          ? "500px"
                          : isMobile
                          ? "100%"
                          : "400px",
                        padding: "14px 20px",
                        fontSize: "17px",
                        borderRadius: "8px",
                        border: "none",
                        marginBottom: "5px",
                        boxShadow: "1px 4px 7px 0px #707070",
                        outline: "none",
                        "&::before, &::after": {
                          border: "none",
                        },
                        "&:hover:not(.MuiDisabled):before": {
                          border: "none",
                        },
                      }}
                    />
                    <ErrorMessage
                      style={{ color: "red" }}
                      name="title"
                      component="div"
                    />
                  </Box>
                  <Box
                    sx={{
                      display: isMobile ? "block" : "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: isMobile ? undefined : "10px",
                    }}
                  >
                    <Box>
                      {categoryLoading ? (
                        <Box
                          sx={{
                            width: isBigScreen
                              ? "500px"
                              : isMobile
                              ? "100%"
                              : "400px",
                            padding: "14px 20px",
                            fontSize: "17px",
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            border: "none",
                            marginBottom: "5px",
                            boxShadow: "1px 4px 7px 0px #707070",
                            outline: "none",
                            "&::before, &::after": {
                              border: "none",
                            },
                            "&:hover:not(.MuiDisabled):before": {
                              border: "none",
                            },
                          }}
                        >
                          {
                            <Bars
                              height="20"
                              width="45"
                              color="#f25f0c"
                              ariaLabel="bars-loading"
                              wrapperStyle={{}}
                              wrapperClass=""
                              visible={true}
                            />
                          }
                        </Box>
                      ) : (
                        <Field
                          as="select"
                          id="category"
                          name="category"
                          style={{
                            width: isBigScreen
                              ? "500px"
                              : isMobile
                              ? "100%"
                              : "400px",
                            padding: "14px 20px",
                            fontSize: "17px",
                            textTransform: "capitalize",
                            borderRadius: "8px",
                            border: "none",
                            marginBottom: isMobile ? "10px" : "5px",
                            boxShadow: "1px 4px 7px 0px #707070",
                            cursor: "pointer",
                            outline: "none",
                            "&::before, &::after": {
                              border: "none",
                            },
                            "&&:hover:not(.MuiDisabled):before": {
                              border: "none",
                            },
                          }}
                        >
                          {categorys?.map((category, index) => (
                            <option
                              key={index}
                              value={category}
                              style={{
                                textTransform: "capitalize",
                              }}
                            >
                              {category}
                            </option>
                          ))}
                        </Field>
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: isMobile ? "block" : "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: "10px",
                    }}
                  ></Box>
                  {!isMobile && (
                    <Button
                      sx={{
                        width: isBigScreen
                          ? "500px"
                          : isMobile
                          ? "100%"
                          : "400px",
                        padding: "8px 15px",
                        backgroundColor: "#f25f0c",
                        borderRadius: "8px",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "18px",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          background: "#fff",
                          color: "#f25f0c",
                        },
                      }}
                      type="submit"
                      variant="outlined"
                      disabled={isSubmitting}
                    >
                      {isLoading ? (
                        <Bars
                          height="26"
                          width="45"
                          color="#f25f0c"
                          ariaLabel="bars-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                          visible={true}
                        />
                      ) : (
                        t("Save")
                      )}
                    </Button>
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  mb: isMobile ? "10px" : undefined,
                  width: "100%",
                  minHeight: "250px",
                  padding: "14px 20px",
                  fontSize: "17px",
                  backgroundColor: "#ffffff60",
                  borderRadius: "15px",
                  border: "none",
                  marginBottom: "5px",
                  boxShadow: "1px 4px 7px 0px #707070",
                }}
              >
                <Fragment>
                  <EditorMenuBar editor={editor} />
                  <hr />
                </Fragment>
                <EditorContent editor={editor} />
              </Box>
              {errors.content && (
                <Box sx={{ color: "red", mt: "10px" }}>{errors.content}</Box>
              )}
              {isMobile && (
                <Button
                  sx={{
                    width: isBigScreen ? "500px" : isMobile ? "100%" : "400px",
                    padding: "8px 15px",
                    mt: isMobile ? "10px" : undefined,
                    backgroundColor: "#f25f0c",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      background: "#fff",
                      color: "#f25f0c",
                    },
                  }}
                  type="submit"
                  variant="outlined"
                  disabled={isSubmitting}
                >
                  {isLoading ? (
                    <Bars
                      height="26"
                      width="45"
                      color="#f25f0c"
                      ariaLabel="bars-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                    />
                  ) : (
                    t("Save")
                  )}
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default CreateBlog;
