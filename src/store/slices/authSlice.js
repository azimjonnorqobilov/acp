import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toastify } from "components/toastify/toastify";
import { axiosPrivate } from "services/axiosPrivate";
import { axiosPublic } from "services/axiosPublic";

const userInfo = JSON.parse(localStorage.getItem("user-information"));

const initialState = {
  userInfo: userInfo || null,
  resetPassword: {
    user: {},
    isLoading: false,
    isLoadingConfirmation: false,
    confirmationStatus: null,
  },
  editPassword: { status: null, message: "", refresh: null },
  errorMessage: "",
  isLoading: false,
  verifyAccount: {
    status: null,
    message: "",
  },
};

export const signIn = createAsyncThunk("auth/sign-in", async (user) => {
  try {
    const tokenResponse = await axiosPublic.post("auth/login/", user);

    localStorage.setItem("token", tokenResponse?.data?.token);

    const meResponse = await axiosPrivate.get("auth/me");

    const userInfo = {
      ...meResponse?.data,
      entity_type: meResponse?.data?.entity_type?.toLowerCase()?.replaceAll("_", "-"),
    };

    localStorage.setItem("user-information", JSON.stringify(userInfo));

    return userInfo;
  } catch (error) {
    toastify.error(error?.response?.data?.error);
  }
});

export const editContact = createAsyncThunk("auth/edit-contact", async (userContact) => {
  const response = await axiosPrivate.post("auth/me/edit-contact/", userContact);
  return { phone: response?.data?.phone, telegram: response?.data?.telegram };
});

export const editUserPassword = createAsyncThunk("auth/edit-password", async (passwords) => {
  try {
    const response = await axiosPrivate.post("auth/me/edit-password/", passwords);
    return { message: response?.data?.detail, status: response?.status };
  } catch (error) {
    return { message: error?.response?.data?.[0], status: error?.response?.status };
  }
});

export const resetPassword = createAsyncThunk("auth/reset-password", async (email) => {
  try {
    const response = await axiosPublic.post("auth/reset-password/", { email });
    return response?.data;
  } catch (error) {
    error?.response?.data?.email
      ? error?.response?.data?.email?.map((message) => toastify.error(message))
      : error?.response?.data?.map((message) => toastify.error(message));
    return { message: error?.response?.data?.email?.[0] || error?.response?.data?.[0] };
  }
});

export const verifyAccount = createAsyncThunk("auth/verify-account", async (key) => {
  try {
    const response = await axiosPublic.get(`auth/verify-account/?key=${key}`);
    return { status: response?.status, message: response?.data?.message };
  } catch (error) {
    return { status: error?.response?.status, message: error?.response?.data?.message };
  }
});

export const confirmationPassword = createAsyncThunk(
  "auth/confirmation-password",
  async (verification) => {
    try {
      const response = await axiosPublic.post("auth/confirmation-password/", verification);
      return response?.status;
    } catch (error) {
      return error?.response?.data?.map((message) => toastify.error(message));
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state, action) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user-information");
      window.location.replace("/");
      state.userInfo = null;
    },
    resetPasswordDataClear: (state) => {
      state.resetPassword = { user: {}, isLoading: false };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.userInfo = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action?.error?.message;
      })
      .addCase(editContact.fulfilled, (state, action) => {
        localStorage.setItem(
          "user-information",
          JSON.stringify({ ...state.userInfo, ...action.payload })
        );
        state.userInfo = { ...state.userInfo, ...action.payload };
      })
      .addCase(editUserPassword.fulfilled, (state, action) => {
        state.editPassword = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPassword.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPassword.user = action.payload;
        state.resetPassword.isLoading = false;
      })
      .addCase(confirmationPassword.pending, (state, action) => {
        state.resetPassword.isLoadingConfirmation = true;
      })
      .addCase(confirmationPassword.fulfilled, (state, action) => {
        state.resetPassword.confirmationStatus = action.payload;
        state.resetPassword.isLoadingConfirmation = false;
      });
  },
});

const { reducer, actions } = authSlice;

export const { logout, resetPasswordDataClear } = actions;

export default reducer;
