import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  useMediaQuery,
  Input,
  IconButton,
  Avatar,
  Typography,
} from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import { Add, EmojiEmotionsOutlined, Send, Share } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import ChatRoom from "../../components/ChatRoom";
import { SharePopup } from "../../components/SharePopup";
import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import { useWebRTC } from "../../hooks/useWebRTCVideo2";
import { useGetRoomQuery } from "../../store/liveSlice";

const GoLive = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.user.userDetails);
  const [streamerId, setStreamerId] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAudience, setIsAudience] = useState(false);
  const [isMuted, setMuted] = useState(true);

  const [showPicker, setShowPicker] = useState(false);
  const [showPickerComment, setShowPickerComment] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isNonMobile = useMediaQuery("(min-width: 1200px)");
  const isBigScreen = useMediaQuery("(min-width: 1800px)");

  const commentBoxRef = useRef(null);

  const {
    data,
    isError: liveError,
    isLoading: liveLoading,
  } = useGetRoomQuery(roomId);

  const live = data.data;

  // const { clients, provideRef, handleMute, endRoom, blockUser } = useWebRTC(
  //   roomId,
  //   userDetails
  // );

  // const currentUser = clients.find((client) => client._id === userDetails._id);
  // console.log("Clients list:", clients);

  // const videoRef = (instance) => {
  //   if (streamerId && instance) {
  //     provideRef(instance, streamerId);
  //   }
  // };
  // // Effect to determine if the user is an admin or audience
  // useEffect(() => {
  //   console.log("Clients updated:", clients);
  //   const firstAdmin = clients.find((client) => client.role === "admin");
  //   if (firstAdmin) {
  //     setStreamerId(firstAdmin._id);
  //     setIsAdmin(userDetails._id === firstAdmin._id);
  //   }

  //   const currentUserRole = clients.find(
  //     (client) => client._id === userDetails._id
  //   )?.role;
  //   if (currentUserRole === "audience") {
  //     setIsAudience(true);
  //   }
  // }, [clients, userDetails._id]);

  // // Effect to mute/unmute the user

  // useEffect(() => {
  //   if (isAdmin && currentUser) {
  //     handleMute(isMuted, userDetails?._id);
  //   }
  // }, [isMuted, handleMute, isAdmin, currentUser, userDetails?._id]);

  // // Scroll to the bottom of the comments when a new comment is added
  // useEffect(() => {
  //   if (commentBoxRef.current) {
  //     commentBoxRef.current.scrollTop = commentBoxRef.current.scrollHeight;
  //   }
  // }, [comments]);

  // const handleMuteClick = useCallback(() => {
  //   if (isAdmin && currentUser) {
  //     setMuted((prev) => !prev);
  //   }
  // }, [isAdmin, currentUser]);

  // const handleEndRoom = async () => {
  //   await endRoom();
  // };

  // const handleShareClick = () => {
  //   setShowSharePopup((prev) => !prev);
  // };

  console.log("Current user:", userDetails);
  // console.log("Clients list:", clients);
  console.log("Streamer ID:", streamerId);

  return (
    <Box sx={{ minHeight: "calc(100vh - 56px)" }}>
      <Box
        sx={{
          width: "90%",
          m: isMobile ? "6rem auto 3rem" : "4.5rem auto 1.5rem",
          padding: "1rem",
        }}
      >
        {/** the topic of the room */}
        {live && (
          <Typography
            sx={{
              color: "#707070",
              fontSize: "18px",
              fontWeight: "bold",
              mb: isMobile ? "20px" : undefined,
              textAlign: isMobile ? "center" : undefined,
            }}
          >
            {live.topic}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default GoLive;
