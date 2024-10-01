import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import FollowButton from "./FollowButton";

const FollowerDialog = ({ open, setOpen, user, state, currentUser }) => {
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
  };
  console.log(user);

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={"paper"}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: "450px",
        },
      }}
    >
      <DialogTitle id="scroll-dialog-title">
        {state === "Followers" ? "Followers" : "Following"}
      </DialogTitle>
      <DialogContent dividers={true}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {state === "Followers"
            ? user?.Follower?.map((item) => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={item?._id}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      columnGap: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate(`/profile/${item.id}`);
                      handleClose();
                    }}
                  >
                    <Avatar
                      src={`${process.env.REACT_APP_SERVER_DOMAIN}/${item.profile}`}
                      sx={{ width: "45px", height: "45px" }}
                    />
                    <Typography sx={{ fontSize: "18px" }}>
                      {item?.name}
                    </Typography>
                  </Box>
                  {/*currentUser?._id !== item?.id && (
                    <FollowButton currentUser={currentUser} userId={item?.id} />
                  )*/}
                </Box>
              ))
            : state === "Following"
            ? user?.following?.map((item) => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={item?._id}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      columnGap: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate(`/profile/${item?.id}`);
                      handleClose();
                    }}
                  >
                    <Avatar
                      src={`${process.env.REACT_APP_SERVER_DOMAIN}/${item.profile}`}
                      sx={{ width: "45px", height: "45px" }}
                    />
                    <Typography sx={{ fontSize: "18px" }}>
                      {item?.name}
                    </Typography>
                  </Box>
                  {/*currentUser?._id !== item?.id && (
                    <FollowButton currentUser={currentUser} userId={item?.id} />
                  )*/}
                </Box>
              ))
            : ""}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FollowerDialog;
