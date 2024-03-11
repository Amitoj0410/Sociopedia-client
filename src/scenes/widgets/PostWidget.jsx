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
import IsCommentLiked from "components/IsCommentLiked";
import SpecialWidgetWrapper from "components/SpecialWidgetWrapper";
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

  const patchCommentLike = async (commId) => {
    const response = await fetch(
      `https://socialpedia-serverr.onrender.com/posts/${postId}/comment/${commId}/like`,
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

    // Update local state with the new comment if necessary
    setNewComment("");
  };

  const handleMoreIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleWhatsAppShare = () => {
    const shareableLink = `https://socialpedia-serverr.onrender.com/assets/${picturePath}`;
    const shareableText = `${description}`;
    const message = `${shareableText}\n${shareableLink}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  const handleInstagramShare = () => {
    // Handle Instagram share logic
  };

  const showPart2 = (currentComment) => {
    var resultArray = currentComment.split(":");
    var secondPart = resultArray.slice(1).join(":");
    return secondPart;
  };

  return (
    <SpecialWidgetWrapper
      mb={`2rem`}
      maxWidth={"35rem"}
      sx={{ wordWrap: "break-word" }}
      overflow={"hidden"}
    >
      <Box className="inner-icons">
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
          postId={postId}
        />
      </Box>
      <Typography
        color={main}
        sx={{
          mt: "1rem",
          fontSize: "1rem",
          overflow: "hidden",
        }}
        className="inner-icons"
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
          src={picturePath}
          className="inner-icons"
        />
      )}
      {videoPath && (
        <Box sx={{ "&:hover": { cursor: "pointer" } }} className="inner-icons">
          <video
            width="100%"
            controls
            style={{
              borderRadius: "0.75rem",
              marginTop: "0.75rem",
              maxHeight: "25rem",
              objectFit: "cover",
            }}
          >
            <source src={videoPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      )}
      <FlexBetween mt="0.25rem" className="inner-icons">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton
              onClick={patchLike}
              sx={{
                "&:hover": {
                  backgroundColor: palette.primary.light,
                },
              }}
            >
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
        <Box
          mt="0.5rem"
          border={`3px solid ${main}`}
          borderRadius={`5px`}
          className="inner-icons"
        >
          <FlexBetween>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ mt: "0.3rem", ml: "0.4rem" }}
            >
              Comments
            </Typography>
            <IconButton
              sx={{
                mr: "0.5rem",
              }}
              onClick={() => setIsComments(!isComments)}
            >
              <Close />
            </IconButton>
          </FlexBetween>
          <Divider />
          <FlexBetween>
            <List
              sx={{
                maxHeight: "12rem",
                overflowY: "auto",
                width: "100%",
              }}
            >
              {Array.isArray(comments) &&
                comments.map((comment, index) => (
                  <FlexBetween key={index} sx={{ mb: "0.5rem" }}>
                    <ListItem>
                      <Typography component="div">
                        <FlexBetween>
                          <Box sx={{ display: "flex" }}>
                            <Box>
                              <FindUserById
                                userId={comment.userId}
                                commentTime={comment.timestamp}
                              />
                            </Box>
                            <ArrowRight sx={{ mt: "0.1rem" }} />
                            <Box sx={{ mt: "0.1rem" }}>{comment.body}</Box>
                          </Box>
                        </FlexBetween>
                      </Typography>
                    </ListItem>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        mr: "1rem",
                      }}
                    >
                      <IconButton
                        sx={{
                          "&:hover": {
                            backgroundColor: palette.primary.light,
                          },
                        }}
                        onClick={() => patchCommentLike(comment.id)}
                      >
                        <IsCommentLiked comment={comment} />
                      </IconButton>
                      <Typography>
                        {comment.likes ? Object.keys(comment.likes).length : 0}
                      </Typography>
                    </Box>
                    {index < comments.length - 1 && <Divider />}
                    {/* <Divider /> */}
                  </FlexBetween>
                ))}
            </List>
          </FlexBetween>
          <Box display="flex">
            <TextField
              label="Add a comment"
              fullWidth
              variant="outlined"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
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
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </SpecialWidgetWrapper>
  );
};

export default PostWidget;
