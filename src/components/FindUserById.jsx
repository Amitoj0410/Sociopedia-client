import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserImage from "./UserImage";
import { Box } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { useNavigate } from "react-router-dom";

const FindUserById = ({ comment }) => {
  const [userFullName, setUserFullName] = useState("");
  const [picturePath, setPicturePath] = useState("");
  const [id, setId] = useState("");
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  useEffect(() => {
    var resultArray = [];
    var id = "";
    const fetchData = async () => {
      try {
        resultArray = comment.split(":");
        // setId(resultArray[0]);
        // console.log(comment);
        id = resultArray[0];

        const response = await fetch(
          `https://socialpedia-serverr.onrender.com/users/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              // 'Content-type': 'Application/json', // You may add this if needed
            },
          }
        );

        if (response.ok) {
          const user = await response.json();
          //   console.log(user);

          if (user) {
            const name = `${user.firstName} ${user.lastName}`;
            setUserFullName(name);
            setPicturePath(user.picturePath);
            setId(user._id);
          }
        } else {
          console.error("Error fetching user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [comment, token]); // Include comment and token as dependencies
  return (
    <FlexBetween
      onClick={() => {
        navigate(`/profile/${id}`);
        // navigate(0);
      }}
    >
      <Box sx={{ display: "inline" }}>
        <UserImage image={picturePath} size="30px" />
      </Box>
      <Box sx={{ ml: "0.3rem" }}>{userFullName}</Box>
    </FlexBetween>
  );
};

export default FindUserById;
