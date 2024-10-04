import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "services/axiosPrivate";

const initialState = {
  places: [],
  distance: 0,
  loadTypes: [],
  helpStatus: null,
  loadTypesCategories: [],
};

export const sendHelp = createAsyncThunk("user/send-help", async (data) => {
  const response = await axiosPrivate.post(`common/help/`, data);
  return response.status;
});

export const getPlaces = createAsyncThunk("support/get-places", async (search) => {
  const response = await axiosPrivate.get(`https://places.acploads.com/places?search=${search}`);
  return response?.data?.result?.map((p) => ({ label: p, value: p }));
});

export const getDistance = createAsyncThunk("support/get-distance", async (places) => {
  const response = await axiosPrivate.post("https://places.acploads.com/distance", places);
  return response?.data?.distance;
});

export const getLoadTypes = createAsyncThunk("support/get-load-types", async () => {
  const response = await axiosPrivate.get(`common/load-type`);
  return response?.data;
});

export const getLoadTypesCategories = createAsyncThunk(
  "support/get-load-types-categories",
  async () => {
    const response = await axiosPrivate.get(`common/load-type-category`);
    return response?.data;
  }
);

export const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendHelp.fulfilled, (state, action) => {
        state.helpStatus = action.payload;
      })
      .addCase(getPlaces.fulfilled, (state, action) => {
        state.places = action.payload;
      })
      .addCase(getDistance.fulfilled, (state, action) => {
        state.distance = action.payload;
      })
      .addCase(getLoadTypesCategories.fulfilled, (state, action) => {
        state.loadTypesCategories = action.payload;
      })
      .addCase(getLoadTypes.fulfilled, (state, action) => {
        state.loadTypes = action.payload;
      });
  },
});

const { reducer } = supportSlice;

// export const {} = actions;

export default reducer;
