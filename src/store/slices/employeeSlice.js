import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "services/axiosPrivate";

const initialState = {
  employee: {},
  posted: [],
  employees: {
    employees: [],
    pagination: { page: 1, page_size: 100, count: null, next: null, previous: null },
  },
  unverifiedEmployees: {
    employees: [],
    pagination: { page: 1, page_size: 100, count: null, next: null, previous: null },
  },
};

export const getEmployees = createAsyncThunk(
  "get-employees",
  async ({
    search,
    scroll = false,
    pagination = { page: 1, page_size: 100 },
    entity_type = "",
    verify_request,
  }) => {
    const response = await axiosPrivate.get(
      `dashboard/employee/?${
        verify_request === true || verify_request === false
          ? `verify_request=${verify_request}&`
          : ""
      }entity=${entity_type}&mc_usdot=${search || ""}&page=${pagination?.page}&page_size=${
        pagination?.page_size
      }`
    );
    return {
      scroll,
      pagination: {
        ...pagination,
        next: response?.data?.next,
        count: response?.data?.count,
        previous: response?.data?.previous,
      },
      results: response?.data?.results,
      verify_request,
    };
  }
);

export const getEmployee = createAsyncThunk("get-employee", async ({ employee_id }) => {
  const response = await axiosPrivate.get(`dashboard/employee/${employee_id}`);
  return response?.data;
});

export const verifyEmployee = createAsyncThunk("verify-employee", async ({ employee_id }) => {
  const response = await axiosPrivate.post(`dashboard/upgrade/`, { employee_id });
  return response?.data;
});

export const updateEmployee = createAsyncThunk(
  "update-employee",
  async ({ employee_id, employee }) => {
    try {
      const response = await axiosPrivate.put(`dashboard/employee/${employee_id}/`, employee);
      return { messages: response?.data, status: response?.status };
    } catch (error) {
      return { messages: error?.response?.data, status: error?.response?.status };
    }
  }
);

export const updateCompanyEmployee = createAsyncThunk(
  "update-company-employee",
  async ({ employee_id, employee }) => {
    try {
      const response = await axiosPrivate.put(
        `dashboard/employee_update/${employee_id}/`,
        employee
      );
      return { messages: response?.data, status: response?.status };
    } catch (error) {
      return { messages: error?.response?.data, status: error?.response?.status };
    }
  }
);

export const deleteEmployee = createAsyncThunk("delete-employee", async ({ employee_id }) => {
  const response = await axiosPrivate.delete(`dashboard/employee/${employee_id}`);
  return response?.data;
});

export const getEmployeePosted = createAsyncThunk(
  "get-employee-posted",
  async ({ employee_id }) => {
    const response = await axiosPrivate.get(`shipper/shipper-load?by_owner_profile=${employee_id}`);
    return response?.data?.results;
  }
);

export const employeeSlice = createSlice({
  name: "support",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.fulfilled, (state, action) => {
        const { scroll, results, pagination, verify_request } = action.payload;
        if (verify_request) {
          state.unverifiedEmployees.employees = scroll
            ? [...state.unverifiedEmployees.employees, ...results]
            : results;
          state.unverifiedEmployees.pagination = pagination;
        } else {
          state.employees.employees = scroll ? [...state.employees.employees, ...results] : results;
          state.employees.pagination = pagination;
        }
      })
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.employee = action.payload;
      })
      .addCase(getEmployeePosted.fulfilled, (state, action) => {
        state.posted = action.payload;
      });
  },
});

const { reducer } = employeeSlice;

// export const {} = actions;

export default reducer;
