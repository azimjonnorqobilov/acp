import { createSlice } from "@reduxjs/toolkit";

const theme = JSON.parse(localStorage.getItem("theme"));
const language = localStorage.getItem("i18nextLng");

const initialState = {
  device: {
    innerWidth: window.innerWidth,
    deviceType: window.innerWidth > 1024 ? "desktop" : "mobile",
  },
  language: language || "eng",
  themeMode: theme?.themeMode || "light",
  themeType: theme?.themeType || "acp",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem("i18nextLng", action.payload);
    },
    changeTheme: (state, { payload: { name, value } }) => {
      state[name] = value;
      localStorage.setItem("theme", JSON.stringify(state));
    },
  },

  extraReducers: (builder) => {},
});

const { reducer, actions } = themeSlice;

export const { changeTheme, changeLanguage } = actions;

export default reducer;
