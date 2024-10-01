import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { Fragment, useRef, useState } from "react";
import { Edit, NavigateBefore, NavigateNext } from "@mui/icons-material";
import { XIcon } from "react-share";
import whatsapp from "../../assets/whatsapp.png";
import gmail from "../../assets/gmail.png";
import facebook from "../../assets/facebook.png";
import youtube from "../../assets/youtube.png";
import BlogCard from "../blogs/BlogCard";
import inesta from "../../assets/inesta.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  useGetUserProfileQuery,
  useUpdateCaverMutation,
} from "../../store/userDetailSlice";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Bars } from "react-loader-spinner";
import FollowButton from "../../components/FollowButton";
import { formatNumber } from "../../utils";
import FollowerDialog from "../../components/FollowerDialog";
import { useGetUserBlogQuery } from "../../store/blogSlice";
import Loader from "../../components/Loader";

const podcasterCards = [
  {
    id: "1",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "2",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "3",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "4",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "5",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "6",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "7",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "8",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
];

const vodcasterCards = [
  {
    id: "1",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "2",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "3",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "4",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "5",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "6",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "7",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "8",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
];

const UserProfile = () => {
  const isMobile = useMediaQuery("(max-width: 825px)");
  const isTabScreen = useMediaQuery("(min-width:769px) and (max-width:1060px)");
  const isBigScreen = useMediaQuery("(min-width:1600px)");
  const [caver, setCaver] = useState(null);
  const { userId } = useParams();
  const { t } = useTranslation();
  const sliderRef = useRef(null);
  const slider2Ref = useRef(null);
  const slider3Ref = useRef(null);

  const {
    data: userProfile,
    error,
    isLoading,
  } = useGetUserProfileQuery(userId);

  const [updateCaver, { isLoading: isUploading }] = useUpdateCaverMutation();

  const user = userProfile?.data.DataUser;
  const {
    data: blogs,
    isError: blogError,
    isLoading: blogLoading,
  } = useGetUserBlogQuery(user?._id, {
    skip: !user?._id,
  });
  const userBlogs = blogs?.data?.blogs;
  const currentUser = useSelector((state) => state.user.userDetails);
  const currentUserId = currentUser._id;

  const onUpload = (e) => {
    setCaver(e.target.files[0]);
  };

  const handleCoverEdit = async () => {
    if (!caver) {
      toast.error("Please select a cover image.");
      return;
    }

    try {
      await updateCaver(caver).unwrap();
      toast.success("cover updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error(`Update failed: ${error.message || "Unknown error"}`);
      toast.error("Failed to update cover.");
    }
  };

  const goToNextSlide = () => {
    sliderRef.current.slickNext();
  };

  const goToPrevSlide = () => {
    sliderRef.current.slickPrev();
  };

  const goToNextSlide2 = () => {
    slider2Ref.current.slickNext();
  };

  const goToPrevSlide2 = () => {
    slider2Ref.current.slickPrev();
  };

  const goToNextSlide3 = () => {
    slider3Ref.current.slickNext();
  };

  const goToPrevSlide3 = () => {
    slider3Ref.current.slickPrev();
  };

  let centerSlidePercentage = isMobile
    ? 100
    : isTabScreen
    ? 50
    : !isBigScreen
    ? 33.33
    : 25;

  const settings = {
    infinite: true,
    arrows: false,
    centerMode: true,
    centerPadding: "0",
    slidesToShow: isMobile ? 1 : isTabScreen ? 2 : !isBigScreen ? 3 : 4,
    centerSlidePercentage: centerSlidePercentage,
    autoplay: false,
  };

  // follower dialog
  const [openFollowers, setOpenFollowers] = useState(false);
  const handleClickOpen = () => {
    setOpenFollowers(true);
  };

  // following dialog

  const [openFollowing, setOpenFollowing] = useState(false);
  const handleClickOpenfollowing = () => {
    setOpenFollowing(true);
  };

  if (isLoading) return <Loader />;

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ width: "100%", height: "350px", position: "relative" }}>
        <img
          alt="Profile Cover"
          src={
            caver
              ? URL.createObjectURL(caver)
              : `${process.env.REACT_APP_SERVER_DOMAIN}/${user?.caver}`
          }
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {currentUserId === user?._id && (
          <label htmlFor="cover">
            <Box
              sx={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#707070a6",
                position: "absolute",
                bottom: "25px",
                right: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Edit sx={{ fontSize: "40px", color: "#fff" }} />
              <input
                onChange={onUpload}
                id="cover"
                name="cover"
                type="file"
                accept="image/*"
                style={{ opacity: 0, position: "absolute", zIndex: -1 }}
              />
            </Box>
          </label>
        )}
      </Box>
      <Box
        sx={{
          width: "90%",
          m: isMobile ? "0rem auto 1rem" : "0rem auto 1rem",
          padding: "0.2rem 1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: isMobile ? "column" : undefined,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              columnGap: "15px",
              flexWrap: "wrap",
            }}
          >
            <Avatar
              sx={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                transform: "translateY(-35px)",
              }}
              src={`${process.env.REACT_APP_SERVER_DOMAIN}/${user?.profile}`}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "#f25f0c",
                  fontSize: "17px",
                  my: "5px",
                }}
              >
                {user?.username
                  ? user?.username
                  : `${user?.first_name} ${user?.last_name}`}
              </Typography>
              {currentUserId !== user?._id && (
                <FollowButton currentUser={currentUser} userId={user?._id} />
              )}
            </Box>
            {caver && (isTabScreen || isMobile) && (
              <Button
                sx={{
                  backgroundColor: "#fff",
                  boxShadow: "0px 3px 6px #f25f0c60",
                  p: "6px 18px",
                  color: "#f25f0c",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#f25f0c1c",
                  },
                }}
                onClick={handleCoverEdit}
              >
                {isUploading ? (
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
                  "Save"
                )}
              </Button>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                columnGap: "25px",
                mb: isMobile ? "15px" : "",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#707070",
                    ml: isMobile ? "0px" : "50px",
                    mt: isMobile ? "" : "10px",
                    cursor: "pointer",
                  }}
                  onClick={handleClickOpen}
                >
                  <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {formatNumber(user?.Follower?.length)}
                  </span>{" "}
                  {t("followers")}
                </Typography>
                <Typography
                  sx={{
                    color: "#707070",
                    ml: isMobile ? "0px" : "50px",
                    mt: "10px",
                    cursor: "pointer",
                  }}
                  onClick={handleClickOpenfollowing}
                >
                  <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {formatNumber(user?.following?.length)}
                  </span>{" "}
                  {t("following")}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{ mt: isMobile ? "" : "10px", color: "#707070" }}
                >
                  gender: {user?.gender}
                </Typography>
                <Typography sx={{ mt: "10px", color: "#707070" }}>
                  address: {user?.address}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "22px",
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                columnGap: "5px",
              }}
            >
              {user?.links.length > 0 &&
                user?.links.map((link, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      width: "54px",
                      height: "54px",
                    }}
                  >
                    <a
                      href={
                        link?.url.startsWith("http")
                          ? link?.url
                          : `https://${link?.url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {link?.name === "Facebook" ? (
                        <img
                          alt="facebook"
                          src={facebook}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : link?.name === "WhatsApp" ? (
                        <img
                          alt="whatsapp"
                          src={whatsapp}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : link?.name === "YouTube" ? (
                        <img
                          alt="youtube"
                          src={youtube}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : link?.name === "Instagram" ? (
                        <img
                          alt="inesta"
                          src={inesta}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : link?.name === "X" ? (
                        <XIcon size={36} round />
                      ) : link?.name === "Gmail" ? (
                        <img
                          alt="gmail"
                          src={gmail}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        ""
                      )}
                    </a>
                  </IconButton>
                ))}
            </Box>
            {caver && !isMobile && (
              <Button
                sx={{
                  backgroundColor: "#fff",
                  boxShadow: "0px 3px 6px #f25f0c60",
                  p: "6px 18px",
                  color: "#f25f0c",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#f25f0c1c",
                  },
                }}
                onClick={handleCoverEdit}
              >
                {isUploading ? (
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
                  "Save"
                )}
              </Button>
            )}
          </Box>
        </Box>
        <Box sx={{ mt: "0.5rem" }}>
          <Typography
            sx={{
              maxWidth: "600px",
              color: "#707070",
              fontSize: "16px",
            }}
          >
            {user?.Bios}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#7B7775",
          borderRadius: "20px",
        }}
      >
        <Box
          sx={{
            width: "90%",
            m: "0 auto",
            p: "10px 5px 25px 0",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              color: "#fff",
              mb: "10px",
              ml: "20px",
              fontWeight: "bold",
            }}
          >
            {t("Blogs")}
          </Typography>
          {userBlogs?.length > 0 ? (
            <Fragment>
              <Slider ref={sliderRef} {...settings}>
                {userBlogs?.map((card, index) => (
                  <div key={card._id}>
                    <BlogCard card={card} index={index} />
                  </div>
                ))}
              </Slider>
              <IconButton
                onClick={goToPrevSlide}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "-30px",
                  color: "white",
                  padding: "5px",
                  zIndex: "10",
                  transform: "translateY(-50%)",
                }}
              >
                <NavigateBefore sx={{ fontSize: "40px", color: "#fff" }} />
              </IconButton>
              <IconButton
                onClick={goToNextSlide}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: "-30px",
                  color: "white",
                  padding: "5px",
                  zIndex: "10",
                  transform: "translateY(-50%)",
                }}
              >
                <NavigateNext sx={{ fontSize: "40px", color: "#fff" }} />
              </IconButton>
            </Fragment>
          ) : (
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "20px",
                my: "80px",
              }}
            >
              There are no blogs created yet.
            </Box>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "90%",
            m: "0 auto",
            p: "25px 5px",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              color: "#707070",
              mb: "20px",
              ml: "20px",
              fontWeight: "bold",
            }}
          >
            {t("Podcasts")}
          </Typography>
          <Slider ref={slider2Ref} {...settings}>
            {podcasterCards?.map((podcaster) => (
              <div key={`${podcaster.userName}-${podcaster.id}`}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: "350px",
                      height: "275px",
                      marginBottom: "5px",
                      borderRadius: "20px",
                      border: "8px solid #EB7635",
                      position: "relative",
                    }}
                  >
                    <img
                      alt={`${podcaster.name}-${podcaster.id}`}
                      src={podcaster.img}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    {podcaster.name}
                  </Typography>
                  <Typography sx={{ maxWidth: "250px", textAlign: "center" }}>
                    {podcaster.title}
                  </Typography>
                </Box>
              </div>
            ))}
          </Slider>
          <IconButton
            onClick={goToPrevSlide2}
            sx={{
              position: "absolute",
              top: "50%",
              left: "-30px",
              color: "white",
              padding: "5px",
              zIndex: "10",
              transform: "translateY(-50%)",
            }}
          >
            <NavigateBefore sx={{ fontSize: "40px", color: "#EB7635" }} />
          </IconButton>
          <IconButton
            onClick={goToNextSlide2}
            sx={{
              position: "absolute",
              top: "50%",
              right: "-30px",
              color: "white",
              padding: "5px",
              zIndex: "10",
              transform: "translateY(-50%)",
            }}
          >
            <NavigateNext sx={{ fontSize: "40px", color: "#EB7635" }} />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#EB7635",
          borderRadius: "20px 20px 0px 0px",
        }}
      >
        <Box
          sx={{
            width: "90%",
            m: "0 auto",
            p: "25px 5px",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              color: "#fff",
              mb: "20px",
              ml: "20px",
              fontWeight: "bold",
            }}
          >
            {t("Vodcasts")}
          </Typography>
          <Slider ref={slider3Ref} {...settings}>
            {vodcasterCards.map((vodcaster) => (
              <div key={`${vodcaster.userName}-${vodcaster.id}`}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: "350px",
                      height: "275px",
                      marginBottom: "5px",
                      borderRadius: "20px",
                      border: "8px solid #fff",
                      position: "relative",
                    }}
                  >
                    <img
                      alt={`${vodcaster.name}-${vodcaster.id}`}
                      src={vodcaster.img}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#f7f7f7",
                    }}
                  >
                    {vodcaster.name}
                  </Typography>
                  <Typography
                    sx={{
                      maxWidth: "250px",
                      textAlign: "center",
                      color: "#f7f7f7",
                    }}
                  >
                    {vodcaster.title}
                  </Typography>
                </Box>
              </div>
            ))}
          </Slider>
          <IconButton
            onClick={goToPrevSlide3}
            sx={{
              position: "absolute",
              top: "50%",
              left: "-30px",
              color: "white",
              padding: "5px",
              zIndex: "10",
              transform: "translateY(-50%)",
            }}
          >
            <NavigateBefore sx={{ fontSize: "40px", color: "#fff" }} />
          </IconButton>
          <IconButton
            onClick={goToNextSlide3}
            sx={{
              position: "absolute",
              top: "50%",
              right: "-30px",
              color: "white",
              padding: "5px",
              zIndex: "10",
              transform: "translateY(-50%)",
            }}
          >
            <NavigateNext sx={{ fontSize: "40px", color: "#fff" }} />
          </IconButton>
        </Box>
      </Box>
      <FollowerDialog
        open={openFollowers}
        setOpen={setOpenFollowers}
        user={user}
        state={"Followers"}
        currentUser={currentUser}
      />
      <FollowerDialog
        open={openFollowing}
        setOpen={setOpenFollowing}
        user={user}
        state={"Following"}
        currentUser={currentUser}
      />
    </Box>
  );
};

export default UserProfile;
