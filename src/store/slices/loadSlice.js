import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "services/axiosPrivate";

const initialState = {
  loads: {
    loads: [],
    loadsByCompany: [],
    refresh: null,
    isLoading: true,
    isLoadingByCompany: true,
    activeLoad: {},
    loadsPagination: { page: 1, page_size: 100, count: null, next: null, previous: null },
  },
  searchLoads: {
    searchLoads: [],
    isLoading: false,
    refresh: null,
    activeSearchLoad: {},
    searchLoadsPagination: { count: null, next: null, previous: null },
  },
};

export const newSearchLoad = createAsyncThunk("load/new-search-load", async ({ role, search }) => {
  const response = await axiosPrivate.post(`${role}/search/`, search);
  return response.data;
});

export const updateSearchLoad = createAsyncThunk(
  "load/update-search-load",
  async ({ role, search }) => {
    const response = await axiosPrivate.patch(`${role}/search/${search?.id}/`, search);
    return response.data;
  }
);

export const changeSearchLoadNotificationStatus = createAsyncThunk(
  "load/update-search-load",
  async ({ id, role, notification_status }) => {
    const response = await axiosPrivate.patch(`${role}/search/${id}/`, { notification_status });
    return response.data;
  }
);

export const deleteSearchLoads = createAsyncThunk(
  "load/delete-search-loads",
  async ({ role, searchId }) => {
    const response = await axiosPrivate.delete(`${role}/search/${searchId}`);
    return response.status >= 200 && response.status < 300 && searchId;
  }
);

export const getSearchLoads = createAsyncThunk(
  "load/get-search-loads",
  async ({ role, execute, pagination = { page: 1, page_size: 100 } }) => {
    const response = await axiosPrivate.get(
      `${role}/search/?page=${pagination?.page}&page_size=${pagination?.page_size}&execute=${
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
export const getSearchLoad = createAsyncThunk("load/get-search-load", async ({ role, loadId }) => {
  const response = await axiosPrivate.get(`${role}/search/${loadId}`);
  return response.data;
});

export const createLoad = createAsyncThunk("load/create-load", async ({ role, newLoad }) => {
  const response = await axiosPrivate.post(`${role}/load/`, newLoad);
  return response.data;
});

export const updateLoad = createAsyncThunk("load/update-load", async ({ role, load }) => {
  const response = await axiosPrivate.patch(`${role}/load/${load?.id}/`, load);
  return { ...response.data, id: load?.id };
});

export const getLoads = createAsyncThunk(
  "load/get-loads",
  async ({
    role,
    by_search,
    by_truck,
    execute,
    ordering,
    pagination = { page: 1, page_size: 100 },
    availableLoad = false,
  }) => {
    const response = await axiosPrivate.get(
      `${role}/load/?page=${pagination?.page}&page_size=${pagination?.page_size}&ordering=${
        ordering || ""
      }&by_search=${by_search || ""}&by_truck=${by_truck || ""}&execute=${
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

export const getLoad = createAsyncThunk("load/get-load-by-id", async ({ role, loadId }) => {
  const response = await axiosPrivate.get(`${role}/load/${loadId || ""}`);
  return response.data;
});

export const getLoadsByCompany = createAsyncThunk(
  "load/get-loads-by-company",
  async ({ role, company }) => {
    const response = await axiosPrivate.get(`${role}/load/?by_company=${company || ""}`);
    return response.data;
  }
);

export const deleteLoad = createAsyncThunk("load/delete-load", async ({ role, loadId }) => {
  const response = await axiosPrivate.delete(`${role}/load/${loadId}/`);
  return response.status >= 200 && response.status < 300 && loadId;
});

export const createShipperLoad = createAsyncThunk(
  "load/create-shipper-load",
  async ({ role, newLoad }) => {
    const response = await axiosPrivate.post(`${role}/shipper-load/`, newLoad);
    return response.data;
  }
);

export const updateShipperLoad = createAsyncThunk(
  "load/update-shipper-load",
  async ({ role, load }) => {
    const response = await axiosPrivate.patch(`${role}/shipper-load/${load?.id}/`, load);
    return { ...response.data, id: load?.id };
  }
);

export const getShipperLoads = createAsyncThunk(
  "load/get-shipper-loads",
  async ({
    role,
    by_search,
    execute,
    pagination = { page: 1, page_size: 100 },
    availableLoad = false,
  }) => {
    const response = await axiosPrivate.get(
      `${role}/shipper-load/?page=${pagination?.page}&page_size=${
        pagination?.page_size
      }&by_search=${by_search || ""}&execute=${execute === true || ""}`
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

export const getShipperLoad = createAsyncThunk(
  "load/get-shipper-load-by-id",
  async ({ role, loadId }) => {
    const response = await axiosPrivate.get(`${role}/shipper-load/${loadId || ""}`);
    return response.data;
  }
);

export const getShipperLoadsByCompany = createAsyncThunk(
  "load/get-shipper-loads-by-company",
  async ({ role, company }) => {
    const response = await axiosPrivate.get(`${role}/shipper-load/?by_company=${company || ""}`);
    return response.data;
  }
);

export const deleteShipperLoad = createAsyncThunk(
  "load/delete-shipper-load",
  async ({ role, loadId }) => {
    const response = await axiosPrivate.delete(`${role}/shipper-load/${loadId}/`);
    return response.status >= 200 && response.status < 300 && loadId;
  }
);

export const getSearchShipperLoads = createAsyncThunk(
  "load/get-search-shipper-loads",
  async ({ role, execute, pagination = { page: 1, page_size: 100 } }) => {
    const response = await axiosPrivate.get(
      `${role}/search-shipper-load/?&page=${pagination?.page}&page_size=${
        pagination?.page_size
      }&execute=${execute === true || ""}`
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

export const getSearchShipperLoad = createAsyncThunk(
  "load/get-search-shipper-load-by-id",
  async ({ role, searchLoadId }) => {
    const response = await axiosPrivate.get(`${role}/search-shipper-load/${searchLoadId || ""}`);
    return response.data;
  }
);

export const newSearchShipperLoad = createAsyncThunk(
  "load/new-search-shipper-load",
  async ({ role, search }) => {
    const response = await axiosPrivate.post(`${role}/search-shipper-load/`, search);
    return response.data;
  }
);

export const updateSearchShipperLoad = createAsyncThunk(
  "load/update-search-shipper-load",
  async ({ role, search }) => {
    const response = await axiosPrivate.patch(`${role}/search-shipper-load/${search?.id}/`, search);
    return response.data;
  }
);

export const deleteSearchShipperLoad = createAsyncThunk(
  "load/delete-search-shipper-load",
  async ({ role, loadId }) => {
    const response = await axiosPrivate.delete(`${role}/search-shipper-load/${loadId}/`);
    return response.status >= 200 && response.status < 300 && loadId;
  }
);

export const loadSlice = createSlice({
  name: "load",
  initialState,
  reducers: {
    chooseLoad: (state, action) => {
      state.loads.activeLoad = action.payload;
    },
    chooseSearchLoad: (state, action) => {
      state.searchLoads.activeSearchLoad = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(newSearchLoad.fulfilled, (state, action) => {
        state.searchLoads.refresh = `new-search-load-${new Date()}`;
        state.searchLoads.activeSearchLoad = action.payload;
        state.searchLoads.searchLoads = [action.payload, ...state.searchLoads.searchLoads];
      })
      .addCase(updateSearchLoad.fulfilled, (state, action) => {
        const searchLoads = state.searchLoads?.searchLoads?.map((load) =>
          load?.id === action.payload?.id ? action.payload : load
        );

        state.searchLoads.searchLoads = searchLoads;
        state.searchLoads.activeSearchLoad = action.payload;
        state.searchLoads.refresh = `update-search-load-${new Date()}`;
      })
      .addCase(deleteSearchLoads.fulfilled, (state, action) => {
        state.searchLoads.refresh = `delete-search-load-${new Date()}`;
        state.searchLoads.searchLoads = state.searchLoads.searchLoads.filter(
          (load) => load?.id !== action.payload
        );
        if (state.searchLoads.activeSearchLoad?.id === action.payload) {
          state.searchLoads.activeSearchLoad = {};
        }
      })
      .addCase(getSearchLoads.pending, (state) => {
        state.searchLoads.isLoading = true;
      })
      .addCase(getSearchLoads.fulfilled, (state, action) => {
        state.searchLoads.searchLoads = action.payload?.results;
        state.searchLoads.searchLoadsPagination = action.payload?.pagination;
        state.searchLoads.isLoading = false;
      })
      .addCase(getSearchLoad.fulfilled, (state, action) => {
        state.searchLoads.activeSearchLoad = action.payload;
      })
      .addCase(createLoad.fulfilled, (state, action) => {
        state.loads.refresh = `create-load-${new Date()}`;
        state.loads.activeLoad = action.payload;
        state.loads.loads = [action.payload, ...state.loads.loads];
      })
      .addCase(updateLoad.fulfilled, (state, action) => {
        const loads = state.loads.loads.map((load) =>
          load?.id === action?.payload?.id ? action.payload : load
        );
        state.loads.loads = loads;
        state.loads.activeLoad = action.payload;
        state.loads.refresh = `update-load-${new Date()}`;
      })
      .addCase(deleteLoad.fulfilled, (state, action) => {
        state.loads.refresh = `delete-load-${new Date()}`;
        state.loads.loads = state.loads.loads.filter((load) => load?.id !== action.payload);
        if (state.loads.activeLoad?.id === action.payload) {
          state.loads.activeLoad = {};
        }
      })
      .addCase(getLoads.pending, (state) => {
        state.loads.isLoading = true;
      })
      .addCase(getLoads.fulfilled, (state, action) => {
        state.loads.loads = action.payload?.availableLoad
          ? [...state.loads.loads, ...action.payload?.results]
          : action.payload?.results;
        state.loads.loadsPagination = action.payload?.pagination;
        state.loads.isLoading = false;
      })
      .addCase(getLoad.fulfilled, (state, action) => {
        state.loads.activeLoad = action.payload;
      })
      .addCase(getLoadsByCompany.pending, (state) => {
        state.loads.isLoadingByCompany = true;
      })
      .addCase(getLoadsByCompany.fulfilled, (state, action) => {
        state.loads.loadsByCompany = action.payload;
        state.loads.isLoadingByCompany = false;
      })
      .addCase(getShipperLoadsByCompany.pending, (state) => {
        state.loads.isLoadingByCompany = true;
      })
      .addCase(getShipperLoadsByCompany.fulfilled, (state, action) => {
        state.loads.loadsByCompany = action.payload;
        state.loads.isLoadingByCompany = false;
      })
      .addCase(createShipperLoad.fulfilled, (state, action) => {
        state.loads.activeLoad = action.payload;
        state.loads.loads = [action.payload, ...state.loads.loads];
        state.loads.refresh = `create-shipper-load-${new Date()}`;
      })
      .addCase(updateShipperLoad.fulfilled, (state, action) => {
        const loads = state.loads.loads.map((load) =>
          load?.id === action?.payload?.id ? action.payload : load
        );
        state.loads.loads = loads;
        state.loads.activeLoad = action.payload;
        state.loads.refresh = `update-shipper-load-${new Date()}`;
      })
      .addCase(getShipperLoads.pending, (state) => {
        state.loads.isLoading = true;
      })
      .addCase(getShipperLoads.fulfilled, (state, action) => {
        state.loads.loads = action.payload?.availableLoad
          ? [...state.loads.loads, action.payload?.results]
          : action.payload?.results;
        state.loads.loadsPagination = action.payload?.pagination;
        state.loads.isLoading = false;
      })
      .addCase(getShipperLoad.fulfilled, (state, action) => {
        state.loads.activeLoad = action.payload;
      })
      .addCase(deleteShipperLoad.fulfilled, (state, action) => {
        state.loads.refresh = `delete-shipper-load-${new Date()}`;
        state.loads.loads = state.loads.loads.filter((load) => load?.id !== action.payload);
        if (state.loads.activeLoad?.id === action.payload) {
          state.loads.activeLoad = {};
        }
      })
      .addCase(getSearchShipperLoads.pending, (state) => {
        state.searchLoads.isLoading = true;
      })
      .addCase(getSearchShipperLoads.fulfilled, (state, action) => {
        state.searchLoads.searchLoads = action.payload?.results;
        state.searchLoads.searchLoadsPagination = action.payload?.pagination;
        state.searchLoads.isLoading = false;
      })
      .addCase(getSearchShipperLoad.fulfilled, (state, action) => {
        state.searchLoads.activeSearchLoad = action.payload;
      })
      .addCase(newSearchShipperLoad.fulfilled, (state, action) => {
        state.searchLoads.refresh = `new-search-shipper-load-${new Date()}`;
        state.searchLoads.activeSearchLoad = action.payload;
        state.searchLoads.searchLoads = [action.payload, ...state.searchLoads.searchLoads];
      })
      .addCase(updateSearchShipperLoad.fulfilled, (state, action) => {
        const searchLoads = state.searchLoads?.searchLoads?.map((load) =>
          load?.id === action.payload?.id ? action.payload : load
        );

        state.searchLoads.searchLoads = searchLoads;
        state.searchLoads.activeSearchLoad = action.payload;
        state.searchLoads.refresh = `update-search-shipper-load-${new Date()}`;
      })
      .addCase(deleteSearchShipperLoad.fulfilled, (state, action) => {
        state.searchLoads.refresh = `delete-search-shipper-load-${new Date()}`;
        state.searchLoads.searchLoads = state.searchLoads.searchLoads.filter(
          (load) => load?.id !== action.payload
        );
        if (state.searchLoads.activeSearchLoad?.id === action.payload) {
          state.searchLoads.activeSearchLoad = {};
        }
      });
  },
});

const { reducer, actions } = loadSlice;

export const { chooseSearchLoad, chooseLoad } = actions;

export default reducer;
