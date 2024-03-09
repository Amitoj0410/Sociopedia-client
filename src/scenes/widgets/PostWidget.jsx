import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Close,
  WhatsApp,
  Instagram,
  Send,
  ArrowRight,
} from "@mui/icons-material";

import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  TextField,
  List,
  ListItem,
  Menu,
  MenuItem,
} from "@mui/material";
import FindUserById from "components/FindUserById";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  videoPath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  // const [allComments, setAllComments] = useState([]);
  // var allComents = [];
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [newComment, setNewComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const splittedDesc = description.split("\n");
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(
      `https://socialpedia-serverr.onrender.com/posts/${postId}/like`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleCommentSubmit = async () => {
    const trimmedComment = newComment.trim();
    const response = await fetch(
      `https://socialpedia-serverr.onrender.com/posts/${postId}/comment`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: loggedInUserId,
          commentBody: trimmedComment,
        }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  // Share Icon functionality
  const handleMoreIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // later
  const handleWhatsAppShare = () => {
    const shareableLink = `https://socialpedia-serverr.onrender.com/assets/${picturePath}`;
    const shareableText = `${description}`;
    const message = `${shareableText}\n${shareableLink}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  const handleInstagramShare = () => {
    // console.log("hello");
    // const shareableLink = `https://socialpedia-serverr.onrender.com/assets/${encodeURIComponent(
    //   picturePath
    // )}`;
    // const shareableText = encodeURIComponent(description);
    // const instagramLink = `https://www.instagram.com/intent/post/?caption=${shareableText}&url=${shareableLink}`;
    // window.open(instagramLink, "_blank");
  };

  const showPart2 = (currentComment) => {
    var resultArray = currentComment.split(":");

    // resultArray will now contain two elements, with the string broken at the first ':'
    // var firstPart = resultArray[0];
    var secondPart = resultArray.slice(1).join(":");
    return secondPart;
  };

  return (
    <WidgetWrapper
      mb={`2rem`}
      maxWidth={"35rem"}
      sx={{ wordWrap: "break-word" }}
      overflow={"hidden"}
    >
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        postId={postId}
      />
      <Typography
        color={main}
        sx={{
          mt: "1rem",
          fontSize: "1rem",
          overflow: "hidden",
          // wordWrap: "break-word",
          // whiteSpace: "normal",
        }}
      >
        {splittedDesc.map((singleLine, index) => (
          <React.Fragment key={index}>
            {singleLine}
            <br />
          </React.Fragment>
        ))}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          // src={`https://socialpedia-serverr.onrender.com/assets/${picturePath}`}
          src={picturePath}
        />
      )}
      {videoPath && (
        <Box sx={{ "&:hover": { cursor: "pointer" } }}>
          <video
            width="100%"
            // height="auto"
            controls
            style={{
              borderRadius: "0.75rem",
              marginTop: "0.75rem",
              maxHeight: "25rem",
              objectFit: "cover",
              // ":hover": { cursor: "pointer" },
            }}
          >
            <source
              // src={`https://socialpedia-serverr.onrender.com/assets/${videoPath}`}
              src={videoPath}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </Box>
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        {/* Share icon */}
        <>
          <IconButton
            sx={{ p: "0.6rem" }}
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleMoreIconClick}
          >
            <ShareOutlined />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                handleWhatsAppShare();
              }}
              sx={{ color: "green", gap: "0.2rem" }}
            >
              <WhatsApp />
              <Typography>WhatsApp</Typography>
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleInstagramShare();
              }}
              sx={{ color: "#f028d4", gap: "0.2rem" }}
            >
              <Instagram />
              <Typography>Instagram</Typography>
            </MenuItem>
          </Menu>
        </>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem" border={`3px solid ${main}`} borderRadius={`5px`}>
          <FlexBetween>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ mt: "0.3rem", ml: "0.4rem" }}
            >
              Comments
            </Typography>
            <IconButton
              sx={{ mr: "0.5rem" }}
              onClick={() => setIsComments(!isComments)}
            >
              <Close />
            </IconButton>
          </FlexBetween>
          <Divider />
          {/* <List sx={{ maxHeight: "12rem", overflowY: "auto" }}>
            {Array.isArray(comments) &&
              comments.map((comment, index) => (
                <>
                  <ListItem key={index}>
                    <KeyboardArrowRight />
                    <Typography>
                      <Box sx={{ display: "inline" }}>{showPart1(comment)}</Box>
                      <Box sx={{ display: "inline" }}> :- </Box>
                      <Box sx={{ display: "inline" }}>{showPart2(comment)}</Box>
                    </Typography>
                  </ListItem>
                  <Divider />
                </>
              ))}
          </List> */}
          <List sx={{ maxHeight: "12rem", overflowY: "auto" }}>
            {Array.isArray(comments) &&
              comments.map((comment, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    {/* <KeyboardArrowRight /> */}
                    <Typography component="div">
                      <FlexBetween>
                        <Box
                          sx={{
                            display: "inline",
                            color: palette.primary.main,
                            "&:hover": {
                              cursor: "pointer",
                              color: palette.primary.light,
                            },
                          }}
                          // onClick={() => {
                          //   navigate(`/profile/${postUserId}`);
                          // }}
                        >
                          <FindUserById comment={comment} />
                        </Box>
                        <ArrowRight />
                        <Box>{showPart2(comment)}</Box>
                      </FlexBetween>
                    </Typography>
                  </ListItem>
                  {index < comments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
          </List>
          <Box display="flex">
            <TextField
              label="Add a comment"
              fullWidth
              variant="outlined"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              // onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit()}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                newComment.length > 0 &&
                handleCommentSubmit() &&
                setNewComment("")
              }
            />
            <Box display="flex" justifyContent="center" alignItems="center">
              <IconButton
                onClick={() => {
                  if (newComment.length > 0) {
                    handleCommentSubmit();
                    setNewComment("");
                  }
                }}
              >
                <Send
                  sx={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: palette.primary.main,
                    borderRadius: "0.5rem",
                    mb: "0.2rem",
                    // "&:hover": { backgroundColor: palette.primary.main },
                  }}
                />
              </IconButton>
            </Box>
          </Box>
          {/* <Divider /> */}
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
