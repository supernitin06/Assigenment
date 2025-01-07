// Import necessary dependencies
import { createSlice, nanoid } from "@reduxjs/toolkit";

// Initial state for the Redux slice
const initialState = {
  users: [], // List of all users
  friends: [], // List of friends
  friendRequests: [], // Friend requests received
  sentRequests: [], // Friend requests sent
};

// Create a Redux slice
export const userslice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Add a new user to the users list
    adduser: (state, action) => {
      const user = {
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
      };
      state.users.push(user);
    },

    // Add a new friend to the friends list
    addFriend: (state, action) => {
      const friend = {
        id: action.payload.id,
        name: action.payload.name,
      };
      state.friends.push(friend);
    },

    // Remove a friend from the friends list
    removeFriend: (state, action) => {
      state.friends = state.friends.filter(
        (friend) => friend.id !== action.payload
      );
    },

    // Send a friend request
    sendFriendRequest: (state, action) => {
      const request = {
        id: nanoid(),
        fromId: action.payload.fromId,
        toId: action.payload.toId,
        status: "pending",
      };
      state.sentRequests.push(request);
    },

    // Store sent friend requests fetched from the backend
    storeSentRequests: (state, action) => {
      state.sentRequests = action.payload;
    },

    // Store received friend requests fetched from the backend
    storeFriendRequests: (state, action) => {
      state.friendRequests = action.payload;
    },

    // Clear all friend requests (used when cleaning up state, e.g., on logout)
    clearFriendRequests: (state) => {
      state.friendRequests = [];
      state.sentRequests = [];
    },
  },
});

// Export actions for use in components
export const {
  adduser,
  addFriend,
  removeFriend,
  sendFriendRequest,
  storeSentRequests,
  storeFriendRequests,
  clearFriendRequests,
} = userslice.actions;

// Export the reducer to be used in the Redux store
export default userslice.reducer;
