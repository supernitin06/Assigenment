import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  users: [
    {
      id: "",
      name: "",
      email: "",
    },
  ],
  friends: [
    {
      name: "John",
      id: "1",
    },
  ],
  friendRequests: [], // Track friend requests separately
  sentRequests: [],   // Track sent friend requests




  friendRecommendations: [], // Add this line to initialState
};

export const userslice = createSlice({
  name: "user",
  initialState,
  reducers: {
    adduser: (state, action) => {
      const user = {
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
      };
      state.users.push(user);
    },
    addfriend: (state, action) => {
      const friend = {
        id: action.payload.id,
        name: action.payload.name,
      };
      state.friends.push(friend);
    },
    removefriend: (state, action) => {
      state.friends = state.friends.filter(
        (friend) => friend.id !== action.payload
      );
    },
    sendFriendRequest: (state, action) => {
      const request = {
        id: nanoid(),
        fromId: action.payload.fromId,
        toId: action.payload.toId,
        status: "pending", // Track request status
      };
      state.sentRequests.push(request);
    },
    acceptFriendRequest: (state, action) => {
      const request = state.friendRequests.find(
        (req) => req.id === action.payload.id
      );
      if (request) {
        request.status = "accepted";
        state.friends.push({
          id: request.fromId,
          name: request.fromName, // Corrected to use the `fromName` from request
        });
        // Remove from friendRequests
        state.friendRequests = state.friendRequests.filter(
          (req) => req.id !== action.payload.id
        );
      }
    },
    rejectFriendRequest: (state, action) => {
      state.friendRequests = state.friendRequests.filter(
        (request) => request.id !== action.payload
      );
    },
    addFriendRequestReceived: (state, action) => {
      const friendRequest = {
        id: nanoid(),
        fromId: action.payload.fromId,
        fromName: action.payload.fromName,
        toId: action.payload.toId,
        status: "pending",
      };
      state.friendRequests.push(friendRequest);
    },
    setFriendRecommendations: (state, action) => {
      state.friendRecommendations = action.payload;
    },
  },
});

export const {
  adduser,
  addfriend,
  removefriend,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  addFriendRequestReceived,
  setFriendRecommendations,
} = userslice.actions;

export default userslice.reducer;
