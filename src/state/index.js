import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  otp: null, // new
  posts: [],
  searchType: "people",
  searchValue: "",
  searchResults: {
    people: [],
    posts: [],
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state, action) => {
      state.user = null;
      state.token = null;
      state.posts = [];
      state.searchType = "people";
      state.searchValue = "";
      state.searchResults.people = [];
      state.searchResults.posts = [];
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setUnknownPeople: (state, action) => {
      if (state.user) {
        state.user.unknown = action.payload.unknown;
      } else {
        console.error("unknown non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPost = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPost;
    },
    setOtp: (state, action) => {
      //new
      state.otp = action.payload.otp;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
    },
    clearToken: (state) => {
      state.token = null;
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setUnknownPeople,
  setPosts,
  setPost,
  setOtp,
  setUser,
  setToken,
  clearToken,
  setSearchType,
  setSearchValue,
  setSearchResults,
} = authSlice.actions;
export default authSlice.reducer;
