import {
  PersonAddOutlined,
  PersonRemoveOutlined,
  MoreVertOutlined,
  ArrowRight,
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { setPosts } from "state";
import PostCreatedAt from "./PostCreatedAt";

const Friend = ({ friendId, name, subtitle, userPicturePath, postId }) => {
  //here the friendId is not a friends id but actually it is the id of the person who created the post
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  // console.log(friends[0]);
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // console.log(friendId);
  // console.log(name);
  // const isFriend = friends.find((friend) => friend._id === friendId);
  const isFriend = Array.isArray(friends)
    ? friends.find((friend) => friend._id === friendId)
    : undefined;

  // console.log(isFriend);
  const handleMoreIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const patchFriend = async () => {
    const response = await fetch(
      `https://socialpedia-serverr.onrender.com/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  const deletePost = async () => {
    const response = await fetch(
      `https://socialpedia-serverr.onrender.com/posts/${postId}/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const posts = await response.json();
    dispatch(setPosts({ posts }));
    // console.log(posts);
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
          sx={{
            "&:hover": { color: palette.neutral.main, cursor: "pointer" },
          }}
        >
          <UserImage image={userPicturePath} size="55px" />
        </Box>
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Box display="flex">
            <Typography
              color={main}
              variant="h5"
              fontWeight="500"
              sx={{
                "&:hover": { color: palette.primary.light, cursor: "pointer" },
              }}
            >
              {name}&nbsp;
            </Typography>
            {/* new */}
            {postId && (
              <Box display="flex">
                <ArrowRight />
                <PostCreatedAt postId={postId} />
              </Box>
            )}
          </Box>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {friendId === _id && postId ? (
        <>
          <IconButton
            sx={{ backgroundColor: primaryLight, pb: "0.6rem" }}
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleMoreIconClick}
          >
            <MoreVertOutlined sx={{ color: primaryDark }} />
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
                deletePost();
              }}
              sx={{ color: "red" }}
            >
              Delete
            </MenuItem>
          </Menu>
        </>
      ) : (
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;
