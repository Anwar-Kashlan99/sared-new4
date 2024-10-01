import React, { useState, useEffect } from "react";
import { useSearchUsersQuery } from "../store/userDetailSlice";
import {
  Box,
  InputBase,
  List,
  ListItem,
  Avatar,
  Typography,
  CircularProgress,
  IconButton,
  Paper,
  Grow,
} from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const UserSearch = ({ isSearchActive, setIsSearchActive }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const navigate = useNavigate();
  const toggleSearch = () => {
    setIsSearchActive((prev) => !prev);
    setSearchTerm("");
  };

  const {
    data: users,
    isLoading,
    isError,
  } = useSearchUsersQuery(debouncedSearchTerm, {
    skip: !debouncedSearchTerm,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  return (
    <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
      <Grow
        in={isSearchActive}
        style={{ transformOrigin: "right center" }}
        timeout={500}
      >
        <Paper
          sx={{
            ml: 1,
            display: isSearchActive ? "flex" : "none", // Conditionally render
            alignItems: "center",
            width: isSearchActive ? "235px" : "0px",
            p: "2px 4px",
            overflow: "hidden",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search users..."
            onChange={handleInputChange}
            value={searchTerm}
            inputProps={{ "aria-label": "search users" }}
          />
        </Paper>
      </Grow>
      <IconButton onClick={toggleSearch}>
        <SearchOutlined />
      </IconButton>
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {searchTerm && users && users.length > 0 && (
        <List
          sx={{
            position: "absolute",
            top: "45px",
            width: "100%",
            backgroundColor: "#fff",
            boxShadow: "0px 0px 6px rgba(0,0,0,0.1)",
            borderRadius: "4px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {users.map((user) => (
            <ListItem
              key={user._id}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate(`/profile/${user._id}`);
                setSearchTerm("");
                setIsSearchActive(false);
              }}
            >
              <Avatar
                alt={user.username}
                src={`${process.env.REACT_APP_SERVER_DOMAIN}/${user.profile}`}
                sx={{ mr: 2 }}
              />
              <Typography>
                {user.username || `${user.first_name} ${user.last_name}`}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}
      {isError && (
        <Typography color="error" sx={{ mt: 1 }}>
          Something went wrong while searching.
        </Typography>
      )}
    </Box>
  );
};

export default UserSearch;
