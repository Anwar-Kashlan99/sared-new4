import { SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Input,
  MenuItem,
  Pagination,
  Select,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "./BlogCard";
import { useTranslation } from "react-i18next";
import {
  useGetAllBlogsQuery,
  useGetCategoryQuery,
} from "../../store/blogSlice";
import { Bars } from "react-loader-spinner";

const BlogsList = () => {
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, error, isLoading, refetch } = useGetAllBlogsQuery({
    key: "value",
    page,
    limit,
  });

  const blogs = data?.data?.blogs || [];
  const totalBlogs = data?.data?.totalBlogs || 0;
  const totalPages = Math.ceil(totalBlogs / limit);
  console.log("blogs", blogs);

  useEffect(() => {
    refetch(); // Refetch data when page or limit changes
  }, [page, limit]);

  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
  };

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };

  const handlePageChange = (event, value) => setPage(value);

  const {
    data: category,
    isLoading: categoryLoading,
    error: categorError,
  } = useGetCategoryQuery({
    key: "value",
  });

  const categorys = category?.data?.category;

  const filteredBlogs = blogs.filter((blog) => {
    return (
      (filterCategory === "" ||
        filterCategory === "all" ||
        blog.category === filterCategory) &&
      (searchValue === "" ||
        blog.username.toLowerCase().includes(searchValue.toLowerCase()) ||
        blog.title.toLowerCase().includes(searchValue.toLowerCase()))
    );
  });

  return (
    <Box
      sx={{
        minHeight: "100vh", // Full viewport height
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Keep content and pagination spaced
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          width: "90%",
          margin: isMobile ? "6rem auto 3rem" : "5.5rem auto 2rem",
          padding: "1rem",
        }}
      >
        {/* Filter and Search */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {/* Category Filter */}
          <Box
            sx={{
              display: "flex",
              columnGap: "10px",
              alignItems: "center",
              order: isMobile ? "2" : "1",
            }}
          >
            <Button
              sx={{
                backgroundColor: "#f25f0c",
                color: "white",
                py: "6px",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  background: "#fff",
                  color: "#f25f0c",
                },
              }}
              variant="outlined"
              onClick={() => navigate("/blogs/createblog")}
            >
              {t("Create Blog")}
            </Button>
            <Box>
              {categorys?.length > 0 || !categoryLoading ? (
                <Select
                  size="small"
                  value={filterCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  variant="outlined"
                  sx={{
                    width: "135px",
                    color: "#707070",
                    backgroundColor: "#fff",
                    padding: "0px 15px",
                    fontSize: "16px",
                    ml: "5px",
                    borderRadius: "8px",
                    boxShadow: "1px 4px 7px 0px #707070",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <MenuItem
                    sx={{
                      color: filterCategory === "all" ? "#f25f0c" : "#707070",
                    }}
                    value={"all"}
                  >
                    All
                  </MenuItem>
                  {categorys?.map((category, index) => (
                    <MenuItem
                      sx={{
                        color:
                          filterCategory === category ? "#f25f0c" : "#707070",
                      }}
                      key={index}
                      value={category}
                    >
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <Box
                  sx={{
                    width: "135px",
                    padding: "8px 15px",
                    fontSize: "17px",
                    ml: "5px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "1px 4px 7px 0px #707070",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Bars
                    height="20"
                    width="45"
                    color="#f25f0c"
                    ariaLabel="bars-loading"
                    visible={true}
                  />
                </Box>
              )}
            </Box>
          </Box>

          {/* Search Input */}
          <Box
            sx={{
              marginBottom: isMobile ? "25px" : "15px",
              position: "relative",
              order: isMobile ? "1" : "2",
            }}
          >
            <Input
              type="text"
              placeholder={t("Search")}
              value={searchValue}
              sx={{
                width: isMobile ? "300px" : "500px",
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "20px",
                border: "none",
                boxShadow: "1px 4px 7px 0px #707070",
                outline: "none",
                "&::before, &::after": {
                  border: "none",
                },
                "&:hover:not(.Mui-disabled):before": {
                  border: "none",
                },
              }}
              onChange={handleSearch}
            />

            <SearchOutlined
              sx={{
                position: "absolute",
                fontSize: "30px",
                right: "5px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </Box>
        </Box>

        {/* Blog Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
          }}
        >
          {filteredBlogs.map((card, index) => (
            <BlogCard
              card={card}
              index={index}
              key={`${card.username}-${card._id}`}
            />
          ))}
        </Box>
      </Box>

      {/* Pagination at Bottom */}
      <Box
        sx={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          padding: "1rem",
          backgroundColor: "#f5f5f5", // Optional background for visibility
        }}
      >
        <Stack spacing={2}>
          <Pagination
            count={totalPages} // Number of pages
            page={page} // Current page
            onChange={handlePageChange} // Handle page change
            shape="rounded"
            color="primary"
            variant="outlined"
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default BlogsList;
