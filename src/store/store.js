import { configureStore } from "@reduxjs/toolkit";
import employee from "store/slices/employeeSlice";
import register from "store/slices/registerSlice";
import company from "store/slices/companySlice";
import support from "store/slices/supportSlice";
import trucks from "store/slices/truckSlice";
import theme from "store/slices/themeSlice";
import loads from "store/slices/loadSlice";
import user from "store/slices/userSlice";
import auth from "store/slices/authSlice";

export const store = configureStore({
  reducer: { auth, user, loads, theme, company, register, support, trucks, employee },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(),
  devTools: process.env.NODE_ENV !== "production",
});
