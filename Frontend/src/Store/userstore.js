import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Slicer/Userslice";

export const store = configureStore({
    reducer: {
      user: userReducer,
    },
  });
