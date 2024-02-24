import { Box, Divider, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUnknownPeople } from "state";

const UnknownPeopleWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const unknown = useSelector((state) => state.user.unknown);

  const getUnknownPeople = async () => {
    const response = await fetch(
      `https://socialpedia-serverr.onrender.com/users/${userId}/unknownPeople`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    dispatch(setUnknownPeople({ unknown: data }));
  };

  useEffect(() => {
    getUnknownPeople();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        People You May Know
        <Divider />
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {Array.isArray(unknown) &&
          unknown.map((person, index) => (
            <Friend
              // key={friend._id}
              key={`${person._id}-${index}`}
              friendId={person._id}
              name={`${person.firstName} ${person.lastName}`}
              subtitle={person.occupation}
              // userPicturePath={friend.picturePath}
              userPicturePath={
                person.picturePath ? person.picturePath : "p1.jpeg"
              }
            />
          ))}
      </Box>
    </WidgetWrapper>
  );
};

export default UnknownPeopleWidget;
