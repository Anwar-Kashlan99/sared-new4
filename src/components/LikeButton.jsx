import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

const LikeButton = ({ userLiked, postId, likePost }) => {
  const currentUserId = useSelector((state) => state.user.userDetails._id);

  // Check if the current user has already liked the post
  const hasUserLiked = userLiked?.includes(currentUserId);

  // Initialize the liked state based on whether the user has already liked the post
  const [isLikedState, setIsLikedState] = useState(hasUserLiked);

  const handleLike = async () => {
    try {
      // Optimistically toggle the like state
      setIsLikedState((prev) => !prev);

      // Call the API to like/unlike the post
      await likePost({ userId: currentUserId, postId }).unwrap();

      // You can also show success/failure messages here if needed
    } catch (error) {
      // Revert the optimistic update if the API request fails
      setIsLikedState((prev) => !prev);
      console.error("Failed to like the blog:", error);
    }
  };

  return (
    <IconButton onClick={handleLike}>
      {isLikedState ? (
        <FavoriteOutlined sx={{ fontSize: "40px", color: "#F74B4B" }} />
      ) : (
        <FavoriteBorderOutlined sx={{ fontSize: "40px" }} />
      )}
    </IconButton>
  );
};

export default LikeButton;
