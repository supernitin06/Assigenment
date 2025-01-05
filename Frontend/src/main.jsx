import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Userlogin from './Pages/Userlogin.jsx';
import Usersignup from './Pages/Usersignup.jsx';
import {store}  from './Store/userstore';
import { Provider } from 'react-redux';
import Home from './Pages/Home.jsx';
import Userlogout from './Pages/Userlogout.jsx';
import Userprotected from './Pages/Userprotected.jsx';
import FriendRecommendations from './Pages/FriendRecommendations.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Userlogin />,
  },
  {
    path: '/usersignup',
    element: <Usersignup />,
  },
  {
    path: '/home',
    element:
    <Userprotected>
    <Home/>
    </Userprotected>
  },
  {
    path: '/userlogout',
    element: <Userlogout/>,
  },
  {
    path: '/recommendations',
    element:
    <Userprotected>
    <FriendRecommendations/>
    </Userprotected>
  },
]);

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
);
