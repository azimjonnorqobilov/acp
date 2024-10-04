import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "services/axiosPrivate";

const initialState = {
  posted: [],
  company: {},
  companies: {
    companies: [],
    pagination: { page: 1, page_size: 100, count: null, next: null, previous: null },
  },
  unverifiedCompanies: {
    companies: [],
    pagination: { page: 1, page_size: 100, count: null, next: null, previous: null },
  },
};

export const getCompanies = createAsyncThunk(
  "get-companies",
  async ({
    scroll = false,
    search,
    pagination = { page: 1, page_size: 1000 },
    entity_type = "",
    verify_request = true,
  }) => {
    const response = await axiosPrivate.get(
      `dashboard/company/?${
        verify_request === true || verify_request === false
          ? `verify_request=${verify_request}&`
          : ""
      }entity_type=${entity_type}&mc_usdot=${search || ""}&page=${pagination?.page}&page_size=${
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

export const getCompanyEmployees = createAsyncThunk(
  "get-company-employees",
  async ({
    pagination = { page: 1, page_size: 1000 },
    company_id,
    entity_type = "",
    verify_request = false,
  }) => {
    const response = await axiosPrivate.get(
      `dashboard/employee/?page=${pagination?.page}&page_size=${pagination?.page_size}&entity_type=${entity_type}&company=${company_id}`
    );
    return { verify_request, company_id, results: response?.data?.results };
  }
);

export const getCompany = createAsyncThunk("get-company", async ({ company_id }) => {
  const response = await axiosPrivate.get(`dashboard/company/${company_id}`);
  return response?.data;
});

export const updateCompany = createAsyncThunk("verify-company", async ({ company_id, company }) => {
  try {
    const response = await axiosPrivate.put(`dashboard/company/${company_id}/`, company);
    return { messages: response?.data, status: response?.status };
  } catch (error) {
    return { messages: error?.response?.data, status: error?.response?.status };
  }
});

export const deleteCompany = createAsyncThunk("delete-company", async ({ company_id }) => {
  const response = await axiosPrivate.delete(`dashboard/company/${company_id}`);
  return response?.data;
});

export const getCompanyPosted = createAsyncThunk(
  "get-company-posted",
  async ({ entity_type, company_id }) => {
    const response = await axiosPrivate.get(
      `${entity_type}/${entity_type === "carrier" ? "truck" : "load"}?by_company=${company_id}`
    );
    console.log(response?.data?.results);

    return response?.data?.results;
  }
);

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.fulfilled, (state, action) => {
        const { results, scroll, pagination, verify_request } = action.payload;
        if (verify_request) {
          state.unverifiedCompanies.companies = scroll
            ? [...state.unverifiedCompanies.companies, ...results]
            : results;
          state.unverifiedCompanies.pagination = pagination;
        } else {
          state.companies.companies = scroll ? [...state.companies.companies, ...results] : results;
          state.companies.pagination = pagination;
        }
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.company = action.payload;
      })
      .addCase(getCompanyEmployees.fulfilled, (state, action) => {
        const { company_id, results, verify_request } = action.payload;
        if (verify_request) {
          state.unverifiedCompanies.companies = state.unverifiedCompanies.companies.map((company) =>
            company?.id === company_id ? { ...company, subUsers: results } : company
          );
        } else {
          state.companies.companies = state.companies.companies.map((company) =>
            company?.id === company_id ? { ...company, subUsers: results } : company
          );
        }
      })
      .addCase(getCompanyPosted.fulfilled, (state, action) => {
        state.posted = action.payload;
      });
  },
});

const { reducer } = companySlice;

// export const {} = actions;

export default reducer;
