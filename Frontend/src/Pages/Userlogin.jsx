import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { adduser } from '../Slicer/Userslice';


function Userlogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const nevigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const newUser = {
      email,
      password,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, newUser);

      if (response) {
        const data = response.data;
        dispatch(adduser(data.user));
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.user.id);
        
        console.log(data.user);
        console.log(data.user.id);
        
        nevigate('/home');
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }

  
    setEmail('');
    setPassword('');
   
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-500 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Welcome Back
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Enter your email</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Enter your password</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-400 transition duration-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 text-xl font-semibold rounded-lg shadow-md hover:bg-gradient-to-l hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-transform transform duration-300 hover:scale-105"
          >
            Login
          </button>
        </form>

        <p className="text-xl mt-6 text-center text-gray-600">
          New User?{' '}
          <Link to="/usersignup" className="text-blue-500 font-bold hover:underline">
            Create New Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Userlogin;
