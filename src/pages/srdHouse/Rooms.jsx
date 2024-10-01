import { SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Input,
  Pagination,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import RoomDetailModule from "./RoomDetailModule";
import RoomsCard from "./RoomsCard";
import { useTranslation } from "react-i18next";
import { useGetAllRoomsQuery } from "../../store/srdClubSlice";
import { Bars } from "react-loader-spinner";

const Rooms = () => {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [showModule, setShowModule] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t } = useTranslation();

  const { data, error, isLoading, refetch } = useGetAllRoomsQuery({
    page,
    limit,
    search: searchValue,
  });
  const rooms = data?.data?.rooms || [];
  const totalRooms = data?.data?.totalRoom || 0;
  const totalPages = Math.ceil(totalRooms / limit);

  console.log(rooms);

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };

  const handlePageChange = (event, value) => setPage(value);

  const handleModuleOpen = () => {
    setShowModule(true);
  };

  const handleModuleClose = () => {
    setShowModule(false);
    refetch();
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          width: "90%",
          margin: isMobile ? "6rem auto 3rem" : "5.5rem auto 2rem",
          padding: "1rem",
        }}
      >
        {/* Search and Create Room Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Button
            sx={{
              backgroundColor: "#f25f0c",
              color: "white",
              py: "6px",
              "&:hover": {
                background: "#fff",
                color: "#f25f0c",
              },
            }}
            variant="outlined"
            onClick={handleModuleOpen}
          >
            {t("Create Room")}
          </Button>

          <Box sx={{ position: "relative", order: isMobile ? "1" : "2" }}>
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

        {/* Loader */}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px", // Make sure loader is vertically centered
            }}
          >
            <Bars
              height="80"
              width="80"
              color="#f25f0c"
              ariaLabel="loading-indicator"
            />
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Typography color="error" variant="h6" align="center">
            {t("Failed to load rooms. Please try again later.")}
          </Typography>
        )}

        {/* No Rooms Message */}
        {!isLoading && !error && rooms.length === 0 && (
          <Typography
            variant="h6"
            color="textSecondary"
            align="center"
            sx={{ marginTop: "2rem" }}
          >
            {t("No rooms available.")}
          </Typography>
        )}

        {/* Room Cards */}
        {!isLoading && rooms.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "30px",
            }}
          >
            {rooms.map((card, index) => (
              <RoomsCard
                card={card}
                index={index}
                key={`${card.topic}-${card._id}-${card.ownerId}`}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Pagination */}
      {!isLoading && rooms.length > 0 && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "1rem",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              shape="rounded"
              color="primary"
              variant="outlined"
            />
          </Stack>
        </Box>
      )}

      {showModule && <RoomDetailModule onClose={handleModuleClose} />}
    </Box>
  );
};

export default Rooms;
