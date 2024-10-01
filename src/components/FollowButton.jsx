import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import toast from "react-hot-toast";
import { Bars } from "react-loader-spinner";
import {
  useFollowUserMutation,
  useGetUserProfileQuery,
} from "../store/userDetailSlice";

const FollowButton = ({ userId, currentUser }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followUser, { isLoading }] = useFollowUserMutation();
  const {
    data: user,
    error,
    isLoading: isgetUserId,
  } = useGetUserProfileQuery(currentUser._id);
  const currentUserFolloing = user?.data?.DataUser?.following;

  useEffect(() => {
    if (currentUserFolloing && userId) {
      const isUserFollowed = currentUserFolloing.some(
        (followedUser) => followedUser.id === userId
      );
      setIsFollowing(isUserFollowed);
    }
  }, [currentUserFolloing, userId]);

  const handleFollow = async () => {
    try {
      const result = await followUser(userId).unwrap();

      if (result.data.follow) {
        toast.success("You are now following this user!");
        setIsFollowing(true);
      } else {
        toast.success("You have unfollowed this user!");
        setIsFollowing(false);
      }
    } catch (error) {
      toast.error(
        "An error occurred while trying to follow/unfollow the user."
      );
    }
  };

  return (
    <Button
      variant="text"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0px 3px 6px #f25f0c60",
        color: "#f25f0c",
        fontWeight: "bold",
        padding: "5px 18px",
        "&:hover": {
          backgroundColor: "#f25f0c1c",
        },
      }}
      onClick={handleFollow}
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
      ) : isFollowing ? (
        "Unfollow"
      ) : (
        "follow"
      )}
    </Button>
  );
};

export default FollowButton;
