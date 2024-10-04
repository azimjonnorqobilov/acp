import { axiosPublic } from "services/axiosPublic";
import { axiosPrivate } from "services/axiosPrivate";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  companyInformation: {
    isLoading: true,
    companyInfo: {},
    employees: [],
    ratesStatus: null,
    createdEmployes: {},
  },
  commentAndReview: {
    isLoading: true,
    comments: [],
    refresh: null,
    reportStatus: null,
  },
  verificationCompany: {
    response: {},
    checkedEmail: {},
    companyInfo: {
      country: "USA",
    },
  },
};

export const verifyCompany = createAsyncThunk("user/verify-company", async ({ info, files }) => {
  const formData = new FormData();
  files?.authority && formData.append("authority", files?.authority);
  files?.w9 && formData.append("w9", files?.w9);
  files?.insurance && formData.append("insurance", files?.insurance);
  files?.other1 && formData.append("other1", files?.other1);
  files?.other2 && formData.append("other2", files?.other2);
  // console.log(files);
  Object.keys(info)?.map((key) => formData.append(key, info?.[key]));

  const response = await axiosPrivate.post(`company/verify/`, formData);
  return response.data;
});

export const createEmployee = createAsyncThunk("user/create-employee", async (employee) => {
  const response = await axiosPrivate.post(`company/employees/`, employee);
  return response.data;
});

export const verifyEmployee = createAsyncThunk("user/employee-verify", async (employee) => {
  const response = await axiosPrivate.post(`company/employee-verify/`, employee);
  return response.data;
});

export const checkingEmail = createAsyncThunk("user/checking-email", async (email) => {
  try {
    const response = await axiosPrivate.post("auth/check-email/", { email });
    return { status: response?.status, message: response?.data?.message };
  } catch (ex) {
    return {
      status: ex?.response?.status,
      message: ex?.response?.data?.message || ex?.response?.data?.email?.[0],
    };
  }
});

export const getMyCompanyInformation = createAsyncThunk(
  "user/get-my-company-information",
  async () => {
    const response = await axiosPrivate.get(`company/my-company`);
    return { ...response?.data, my_company: true };
  }
);

export const searchCompanyInformation = createAsyncThunk(
  "user/search-company-information",
  async (search) => {
    const response = await axiosPrivate.get(`company/company/?search=${search}`);
    return response?.data?.length ? { ...response?.data?.[0], my_company: false } : {};
  }
);

export const getCompanyInformation = createAsyncThunk(
  "user/get-company-information",
  async (companyId) => {
    const response = await axiosPrivate.get(`company/company/${companyId}`);
    return response?.data;
  }
);

export const sendCompanyRates = createAsyncThunk("user/send-company-rates", async (rates) => {
  const response = await axiosPrivate.post(`company/rate/`, rates);
  return response?.data;
});

export const getComments = createAsyncThunk("user/get-comments", async ({ company }) => {
  const response = await axiosPrivate.get(`comment/comment/?company=${company}`);
  return response?.data;
});

export const sendComment = createAsyncThunk("user/send-comment", async (newComment) => {
  const response = await axiosPrivate.post(`comment/comment/`, newComment);
  return response?.data;
});

export const deleteComment = createAsyncThunk("user/delete-comment", async (comment) => {
  await axiosPrivate.delete(`comment/comment/${comment}`);
  return comment;
});

export const sendCommentRate = createAsyncThunk("user/send-comment-rate", async (rate) => {
  const response = await axiosPrivate.post(`comment/rate/`, rate);
  return response?.data;
});

export const sendCommentReport = createAsyncThunk("user/send-comment-report", async (report) => {
  const response = await axiosPrivate.post(`comment/report/`, report);
  return {
    comment: response?.data?.comment,
    value: Object.keys(response?.data)?.filter((key) => response?.data?.[key] === true)?.[0],
  };
});

export const getEmployees = createAsyncThunk("user/get-employees", async () => {
  const response = await axiosPrivate.get(`company/employees`);
  return response?.data;
});

export const getCompanyByAuthorityType = createAsyncThunk(
  "register/get-company-by-authority-type",
  async ({ authorityType, number, entity_type }) => {
    try {
      const response = axiosPublic.get(
        `https://places.anycappro.com/fmcsa?query_param=${authorityType}&query_string=${number}&entity_type=${entity_type}`
      );
      return response?.data;
    } catch (ex) {
      return { detail: ex?.response?.statusText };
    }
  }
);

const handleChangeCompanyRates = (companyInfo, payload) => {
  return {
    ...companyInfo,
    ...payload.result_rate,
    my_rate: {
      loc: payload?.loc,
      los: payload?.los,
      ri: payload?.ri,
      lofc: payload?.lofc,
      sop: payload?.sop,
    },
  };
};

const handleChangeCommentRate = (comments, payload) => {
  return comments?.map((comment) =>
    comment?.id === payload?.comment
      ? {
          ...comment,
          ...payload?.rates,
          my_reactions: { ...comment?.my_reactions, reaction: payload?.value },
        }
      : comment
  );
};

const handleChangeCommentReport = (comments, payload) => {
  return comments?.map((comment) =>
    comment?.id === payload?.comment
      ? {
          ...comment,
          ...payload?.rates,
          my_reactions: { ...comment?.my_reactions, report: payload?.value },
        }
      : comment
  );
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    deleteVerifyCompanyInfoField: (state, action) => {
      delete state.verificationCompany.companyInfo[action.payload];
    },
    changeVerifyCompanyInfo: (state, action) => {
      state.verificationCompany.companyInfo[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmployee.fulfilled, (state, action) => {
        state.companyInformation.createdEmployes = action.payload;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.companyInformation.createdEmployes = action.payload;
      })
      .addCase(verifyCompany.fulfilled, (state, action) => {
        state.verificationCompany.response = action.payload;
      })
      .addCase(checkingEmail.fulfilled, (state, action) => {
        state.verificationCompany.checkedEmail = action.payload;
      })
      .addCase(getMyCompanyInformation.pending, (state, action) => {
        state.companyInformation.companyInfo = action.payload;
        state.companyInformation.isLoading = true;
        state.commentAndReview.isLoading = true;
      })
      .addCase(getMyCompanyInformation.fulfilled, (state, action) => {
        state.companyInformation.companyInfo = action.payload;
        state.companyInformation.isLoading = false;
      })
      .addCase(getCompanyInformation.pending, (state) => {
        state.companyInformation.isLoading = true;
        state.commentAndReview.isLoading = true;
      })
      .addCase(getCompanyInformation.fulfilled, (state, action) => {
        state.companyInformation.companyInfo = action.payload;
        state.companyInformation.isLoading = false;
        state.commentAndReview.comments.length && (state.commentAndReview.isLoading = false);
      })
      .addCase(searchCompanyInformation.pending, (state) => {
        state.companyInformation.isLoading = true;
        state.commentAndReview.isLoading = true;
      })
      .addCase(searchCompanyInformation.fulfilled, (state, action) => {
        state.companyInformation.companyInfo = action.payload;
        state.companyInformation.isLoading = false;
        state.commentAndReview.comments.length && (state.commentAndReview.isLoading = false);
      })
      .addCase(sendCompanyRates.fulfilled, (state, action) => {
        state.companyInformation.companyInfo = handleChangeCompanyRates(
          state.companyInformation.companyInfo,
          action.payload
        );
        state.companyInformation.ratesStatus = `send-compony-rates-${new Date()}`;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.commentAndReview.comments = action.payload;
        state.commentAndReview.isLoading = false;
      })
      .addCase(sendComment.fulfilled, (state, action) => {
        state.commentAndReview.refresh = `send-new-comment-${new Date()}`;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.commentAndReview.comments = state.commentAndReview.comments?.filter(
          (comment) => comment?.id !== action.payload
        );
      })
      .addCase(sendCommentRate.fulfilled, (state, action) => {
        state.commentAndReview.comments = handleChangeCommentRate(
          state.commentAndReview.comments,
          action.payload
        );
      })
      .addCase(sendCommentReport.fulfilled, (state, action) => {
        state.commentAndReview.comments = handleChangeCommentReport(
          state.commentAndReview.comments,
          action.payload
        );
        state.commentAndReview.reportStatus = `send-comment-report-${new Date()}`;
      })
      .addCase(getEmployees.pending, (state, action) => {
        state.companyInformation.isLoading = true;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.companyInformation.employees = action.payload;
        state.companyInformation.isLoading = false;
      });
  },
});

const { reducer, actions } = userSlice;

export const { changeVerifyCompanyInfo, deleteVerifyCompanyInfoField } = actions;

export default reducer;
