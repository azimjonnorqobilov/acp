import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "services/axiosPrivate";

const initialState = {
  trucks: {
    trucks: [],
    trucksByCompany: [],
    refresh: null,
    isLoading: true,
    isLoadingByCompany: true,
    activeTruck: {},
    trucksPagination: { count: null, next: null, previous: null },
  },
  searchTrucks: {
    searchTrucks: [],
    isLoading: false,
    refresh: null,
    activeSearchTruck: {},
    searchTrucksPagination: { count: null, next: null, previous: null },
  },
};

export const newSearchTruck = createAsyncThunk(
  "truck/new-search-truck",
  async ({ role, search }) => {
    const response = await axiosPrivate.post(`${role}/search-truck/`, search);
    return response.data;
  }
);

export const updateSearchTruck = createAsyncThunk(
  "truck/update-search-truck",
  async ({ role, search }) => {
    const response = await axiosPrivate.patch(`${role}/search-truck/${search?.id}/`, search);
    return { ...response.data, id: search?.id };
  }
);

export const deleteSearchTruck = createAsyncThunk(
  "truck/delete-search-truck",
  async ({ role, truckId }) => {
    const response = await axiosPrivate.delete(`${role}/search-truck/${truckId}`);
    return response.status >= 200 && response.status < 300 && truckId;
  }
);

export const getSearchTrucks = createAsyncThunk(
  "truck/get-search-trucks",
  async ({ role, execute, pagination = { page: 1, page_size: 100 } }) => {
    const response = await axiosPrivate.get(
      `${role}/search-truck/?page=${pagination?.page}&page_size=${pagination?.page_size}&execute=${
        execute || ""
      }`
    );
    return {
      results: response?.data?.results,
      pagination: {
        count: response.data?.count,
        next: response?.data?.next,
        previous: response?.data?.previous,
      },
    };
  }
);

export const getSearchTruck = createAsyncThunk(
  "truck/get-search-truck-by-id",
  async ({ role, truckId }) => {
    const response = await axiosPrivate.get(`${role}/search-truck/${truckId}`);
    return response.data;
  }
);

export const changeNotificationSearchTruck = createAsyncThunk(
  "truck/change-notification-status-search-truck",
  async ({ role, truckId, status }) => {
    const response = await axiosPrivate.patch(`${role}/search-truck/${truckId}/`, {
      notification_status: status,
    });
    return response.data;
  }
);

export const createTruck = createAsyncThunk("truck/create-truck", async ({ role, newTruck }) => {
  const response = await axiosPrivate.post(`${role}/truck/`, newTruck);
  return response.data;
});

export const updateTruck = createAsyncThunk("truck/update-truck", async ({ role, truck }) => {
  const response = await axiosPrivate.patch(`${role}/truck/${truck?.id}/`, truck);
  return { ...response.data, id: truck?.id };
});

export const getTrucks = createAsyncThunk(
  "truck/get-trucks",
  async ({
    role,
    execute,
    by_load,
    by_search,
    pagination = { page: 1, page_size: 100 },
    availableLoad,
    by_shipper_load,
  }) => {
    const response = await axiosPrivate.get(
      `${role}/truck/?page=${pagination?.page}&page_size=${pagination?.page_size}&by_search=${
        by_search || ""
      }&by_load=${by_load || ""}&by_shipper_load=${by_shipper_load || ""}&execute=${
        execute === true || execute === false ? execute : ""
      }`
    );
    return {
      availableLoad,
      results: response?.data?.results,
      pagination: {
        ...pagination,
        count: response.data?.count,
        next: response?.data?.next,
        previous: response?.data?.previous,
      },
    };
  }
);

export const getTruck = createAsyncThunk("truck/get-truck-by-id", async ({ role, truckId }) => {
  const response = await axiosPrivate.get(`${role}/truck/${truckId}`);
  return response.data;
});

export const getTrucksByCompany = createAsyncThunk(
  "truck/get-trucks-by-company",
  async ({ role, company }) => {
    const response = await axiosPrivate.get(`${role}/truck/?by_company=${company || ""}`);
    return response.data;
  }
);

export const deleteTruck = createAsyncThunk("truck/delete-truck", async ({ role, truckId }) => {
  const response = await axiosPrivate.delete(`${role}/truck/${truckId}/`);
  return response.status >= 200 && response.status < 300 && truckId;
});

export const truckSlice = createSlice({
  name: "truck",
  initialState,
  reducers: {
    chooseTruck: (state, action) => {
      state.trucks.activeTruck = action.payload;
    },
    chooseSearchTruck: (state, action) => {
      state.searchTrucks.activeSearchTruck = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(newSearchTruck.fulfilled, (state, action) => {
        state.searchTrucks.refresh = `new-search-truck-${new Date()}`;
        state.searchTrucks.activeSearchTruck = action.payload;
        state.searchTrucks.searchTrucks = [action.payload, ...state.searchTrucks.searchTrucks];
      })
      .addCase(updateSearchTruck.fulfilled, (state, action) => {
        const searchTrucks = state.searchTrucks.searchTrucks?.map((truck) =>
          truck?.id === action.payload?.id ? action.payload : truck
        );
        state.searchTrucks.searchTrucks = searchTrucks;
        state.searchTrucks.activeSearchTruck = action.payload;
        state.searchTrucks.refresh = `update-search-truck-${new Date()}`;
      })
      .addCase(deleteSearchTruck.fulfilled, (state, action) => {
        state.searchTrucks.refresh = `delete-search-truck-${new Date()}`;
        state.searchTrucks.searchTrucks = state.searchTrucks.searchTrucks.filter(
          (truck) => truck?.id !== action.payload
        );
        if (state.searchTrucks.activeSearchTruck?.id === action.payload) {
          state.searchTrucks.activeSearchTruck = {};
        }
      })
      .addCase(getSearchTrucks.pending, (state) => {
        state.searchTrucks.isLoading = true;
      })
      .addCase(getSearchTrucks.fulfilled, (state, action) => {
        state.searchTrucks.searchTrucks = action.payload?.results;
        state.searchTrucks.searchTrucksPagination = action.payload?.pagination;
        state.searchTrucks.isLoading = false;
      })
      .addCase(getSearchTruck.fulfilled, (state, action) => {
        state.searchTrucks.activeSearchTruck = action.payload;
      })
      .addCase(createTruck.fulfilled, (state, action) => {
        state.trucks.refresh = `create-truck-${new Date()}`;
        state.trucks.activeTruck = action.payload;
        state.trucks.trucks = [action.payload, ...state.trucks.trucks];
      })
      .addCase(updateTruck.fulfilled, (state, action) => {
        const trucks = state.trucks.trucks?.map((truck) =>
          truck?.id === action.payload?.id ? action.payload : truck
        );
        state.trucks.trucks = trucks;
        state.trucks.activeTruck = action.payload;
        state.trucks.refresh = `update-truck-${new Date()}`;
      })
      .addCase(deleteTruck.fulfilled, (state, action) => {
        state.trucks.refresh = `delete-truck-${new Date()}`;
        state.trucks.trucks = state.trucks.trucks.filter((truck) => truck?.id !== action.payload);
        if (state.trucks.activeTruck?.id === action.payload) {
          state.trucks.activeTruck = {};
        }
      })
      .addCase(getTrucks.pending, (state) => {
        state.trucks.isLoading = true;
      })
      .addCase(getTrucks.fulfilled, (state, action) => {
        state.trucks.trucks = action.payload.availableLoad
          ? [...state.trucks.trucks, ...action.payload?.results]
          : action.payload?.results;
        state.trucks.trucksPagination = action.payload?.pagination;
        state.trucks.isLoading = false;
      })
      .addCase(getTruck.fulfilled, (state, action) => {
        state.trucks.activeTruck = action.payload;
      })
      .addCase(getTrucksByCompany.pending, (state) => {
        state.trucks.isLoadingByCompany = true;
      })
      .addCase(getTrucksByCompany.fulfilled, (state, action) => {
        state.trucks.trucksByCompany = action.payload;
        state.trucks.isLoadingByCompany = false;
      });
  },
});

const { reducer, actions } = truckSlice;

export const { chooseTruck, chooseSearchTruck } = actions;

export default reducer;
