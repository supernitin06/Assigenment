import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import debounce from 'lodash.debounce';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const user = useSelector((state) => state.user.users[1]); // Access the first user
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 
  const id = localStorage.getItem('id'); 

  const fetchFriends = useCallback(
    debounce(async (query) => {
      if (!query) {
        setFriends([]);
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/all?search=${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setFriends(response.data || []);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    }, 300), // Debounce delay
    [token]
  );

  useEffect(() => {
    fetchFriends(searchQuery);
    return fetchFriends.cancel;
  }, [searchQuery, fetchFriends]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/friend/requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFriendRequests(response.data.friendRequestsReceived || []);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    fetchFriendRequests();
  }, [token]);

  const sendFriendRequest = async (friendId, friendName) => {
    const userId = id; 
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/friend/add`, 
        { toId: friendId, fromId: userId }, // Use userId here
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      console.log(friendId);
      console.log(userId);
      
      if (response.status === 200) {
        alert(`Friend request sent to ${friendName} (ID: ${friendId})!`);
      } else {
        alert('Failed to send friend request.');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request. Please try again.');
    }
  };
  
  const handleLogout = () => {
    navigate('/userlogout');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-6 shadow-lg">
        <div className="flex justify-center mb-6">
          <img
            src={
              user?.profilePic ||
              'https://via.placeholder.com/150/blue/FFFFFF?text=User'
            }
            alt="User Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500"
          />
        </div>
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {user?.name || 'User'}
          </h2>
          <p className="text-gray-500">{user?.email || 'user@example.com'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded-lg mt-4 hover:bg-red-700 transition"
        >
          Logout
        </button>
        <Link to="/recommendations" className="block mt-4 text-center text-blue-600 hover:underline">
          Friend Recommendations
        </Link>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={(e) => e.preventDefault()} className="flex space-x-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300"
              />
            </div>
          </form>
        </div>

        {/* Friends List */}
        <div className="mt-4">
          {friends.length > 0 ? (
            <ul className="space-y-4">
              {friends.map((friend, index) => (
                <li
                  key={index}
                  className="flex items-center p-4 bg-white shadow rounded-lg"
                >
                  <img
                    src={friend.profilePic || 'https://via.placeholder.com/50'}
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
                    onClick={() => sendFriendRequest(friend._id, friend.name)} // Pass friend.id and friend.name
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Send Request
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Friend Requests</h2>
          {friendRequests.length > 0 ? (
            <ul className="space-y-4">
              {friendRequests.map((request) => (
                <li
                  key={request._id}
                  className="flex items-center p-4 bg-white shadow rounded-lg"
                >
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {request.fromId} has sent you a friend request.
                    </h3>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No friend requests found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;