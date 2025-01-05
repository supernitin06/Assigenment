import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adduser } from '../Slicer/Userslice';
import axios from 'axios';

function Usersignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const newUser = {
      name,
      email,
      password,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/signup`, newUser);

      if (response.status === 201) {
        const data = response.data;
        dispatch(adduser(data.user));
        localStorage.setItem('token', data.token);
        navigate('/home');
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }

    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 animate__animated animate__fadeInUp">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-2xl space-y-8 animate__animated animate__fadeInUp">
        <form onSubmit={submitHandler} className="space-y-8">
          <h2 className="text-3xl font-semibold text-black text-center">
            Create an Account
          </h2>

          <div>
            <input
              required
              className="bg-gray-100 w-full rounded-lg px-6 py-4 border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-lg"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-black">
              Email Address
            </label>
            <input
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-100 w-full rounded-lg px-6 py-4 mt-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-lg"
              type="email"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              required
              className="bg-gray-100 w-full rounded-lg px-6 py-4 mt-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 text-lg"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-indigo-600 hover:text-indigo-700">
            Login here
          </Link>
        </p>

        <div className="mt-6 text-xs text-center text-gray-500">
          <p>
            This site is protected by reCAPTCHA and the{' '}
            <span className="underline">Google Privacy Policy</span> and{' '}
            <span className="underline">Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Usersignup;
