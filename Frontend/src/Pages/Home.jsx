import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import {
  storeFriendRequests,
  storeSentRequests,
  sendFriendRequest,
} from "../Slicer/Userslice";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState([]);
  const user = useSelector((state) => state.user.users[0]);
  const friendRequests = useSelector((state) => state.user.friendRequests);
  const sentRequests = useSelector((state) => state.user.sentRequests);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  // Fetch friends based on search query
  const fetchFriends = useCallback(
    debounce(async (query) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/all?search=${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFriends(response.data || []);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setFriends([]);
      }
    }, 300),
    [token]
  );

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFriends([]);
      return;
    }
    fetchFriends(searchQuery);
  }, [searchQuery, fetchFriends]);

  // Fetch all friend requests
  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/allrequestuser`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        dispatch(storeFriendRequests(response.data.friendRequestsSent
          || []));
        dispatch(storeSentRequests(response.data.friendRequestsSent
          || []));
        console.log(response.data);
        
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  // Handle sending a friend request
  const handleSendRequest = async (friendId, friendName) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/friend/add`,
        { toId: friendId, fromId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert(`Friend request sent to ${friendName}!`);
        dispatch(
          sendFriendRequest({
            toId: friendId,
            fromId: id,
          })
        );
        fetchFriendRequests(); // Refresh requests after sending
      } else {
        alert("Failed to send friend request.");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request. Please try again.");
    }
  };

  const handleLogout = () => {
    navigate("/userlogout");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-6 shadow-lg">
        <div className="flex justify-center mb-6">
          <img
            src={
              user?.profilePic ||
              "https://via.placeholder.com/150/blue/FFFFFF?text=User"
            }
            alt="User Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500"
          />
        </div>
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {user?.name || "User"}
          </h2>
          <p className="text-gray-500">{user?.email || "user@example.com"}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded-lg mt-4 hover:bg-red-700 transition"
        >
          Logout
        </button>
        <Link
          to="/recommendations"
          className="block mt-4 text-center text-blue-600 hover:underline"
        >
          Friend Recommendations
        </Link>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300"
          />
        </div>

        {/* Friends List */}
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-4">Search Results:</h3>
          {friends.length > 0 ? (
            <ul className="space-y-4">
              {friends.map((friend) => (
                <li
                  key={friend._id}
                  className="flex items-center p-4 bg-white shadow rounded-lg"
                >
                  <img
                    src={friend.profilePic || "https://via.placeholder.com/50"}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full border-2 border-blue-500 mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {friend.name}
                    </h3>
                    <p className="text-gray-500">{friend.email}</p>
                  </div>
                  <button
                    onClick={() => handleSendRequest(friend._id, friend.name)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    disabled={sentRequests.some(
                      (req) => req.toId === friend._id
                    )}
                  >
                    {sentRequests.some((req) => req.toId === friend._id)
                      ? "Request Sent"
                      : "Send Request"}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No friends found.</p>
          )}
        </div>

        {/* Friend Requests */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Friend Requests:</h3>
          {friendRequests.length > 0 ? (
            <ul className="space-y-4">
              {friendRequests.map((request) => (
                <li
                  key={request._id}
                  className="flex items-center p-4 bg-white shadow rounded-lg"
                >
                  <img
                    src={
                      request.profilePic || "https://via.placeholder.com/50"
                    }
                    alt={request.name}
                    className="w-12 h-12 rounded-full border-2 border-blue-500 mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {request.name}
                    </h3>
                    <p className="text-gray-500">{request.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No friend requests available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
