import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "services/axiosPrivate";
import axios from "axios";

const registerInformation = JSON.parse(localStorage.getItem("register-information"));

const initialState = registerInformation || {
  step: 0,
  newUserInfo: {},
  companyInfo: {
    info: {},
    isLoading: false,
    authorityType: "",
    authorityNumber: "",
    successed: true,
  },
  personalInfo: {
    info: {},
    checkedPhone: {},
    checkedEmail: {},
    successed: false,
  },
  createdUserInfo: {},
  isLoading: false,
};

export const checkingPhone = createAsyncThunk("register/checking-phone", async (phone) => {
  try {
    const response = await axiosPrivate.post("auth/check-phone/", { phone });
    return { status: response?.status, message: response?.data?.message };
  } catch (ex) {
    return {
      status: ex?.response?.status,
      message: ex?.response?.data?.message || ex?.response?.data?.phone?.[0],
    };
  }
});

export const checkingEmail = createAsyncThunk("register/checking-email", async (email) => {
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

export const getCompany = createAsyncThunk(
  "register/get-company",
  async ({ authorityType, number, entity_type }) => {
    try {
      const response = await axios.get(
        `https://places.anycappro.com/fmcsa?query_param=${authorityType}&query_string=${number}&entity_type=${entity_type}`
      );
      return response?.data;
    } catch (ex) {
      return { detail: ex?.response?.statusText };
    }
  }
);

export const registerNewUser = createAsyncThunk("register/register-new-user", async (newUser) => {
  const response = await axiosPrivate.post("auth/register/", newUser);
  return { status: response?.status, user: response?.data };
});

const setLocalStorage = (state) => {
  localStorage.setItem("register-information", JSON.stringify(state));
};

const checkingPersonalInfoSuccess = (personalInfo) =>
  personalInfo?.info?.first_name &&
  personalInfo?.info?.last_name &&
  personalInfo?.checkedEmail?.status === 200 &&
  personalInfo?.info?.password &&
  personalInfo?.info?.confirm_password &&
  personalInfo?.info?.password === personalInfo?.info?.confirm_password
    ? true
    : false;

const checkingCompanyInfoSuccess = (companyInfo) =>
  !companyInfo?.authorityType || (companyInfo?.authorityType && companyInfo?.info?.entity_type)
    ? true
    : false;

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetRegister: (state) => {
      localStorage.removeItem("register-information");
      state.step = 0;
      state.companyInfo = { info: {}, isLoading: false, authorityType: "", authorityNumber: "" };
      state.personalInfo = {
        info: {},
        checkedPhone: {},
        checkedEmail: {},
      };
      state.newUserInfo = {};
    },
    prevStep: (state, action) => {
      state.step = state.step > 0 ? state.step - 1 : 0;
      setLocalStorage(state);
    },
    nextStep: (state, action) => {
      if (state.step === 0) {
        state.newUserInfo = { ...state.newUserInfo, ...action.payload };
        state.personalInfo = {
          info: {},
          checkedPhone: {},
          checkedEmail: {},
          successed: false,
        };
      }

      state.step === 3 && console.log(state.newUserInfo);

      state.step = state.step < 3 ? state.step + 1 : 4;

      if (state.step === 2) {
        state.newUserInfo = { ...state.newUserInfo, ...state.personalInfo.info };
        state.companyInfo = {
          info: {},
          isLoading: false,
          authorityType: state.newUserInfo?.entity_type === "broker" ? "MC_MX" : "",
          authorityNumber: "",
          successed: state.newUserInfo?.entity_type === "broker" ? false : true,
        };
      }

      state.step === 3 &&
        state.companyInfo.info &&
        (state.newUserInfo = {
          ...state.newUserInfo,
          mc: state.companyInfo.info?.mc_mx_ff_numbers,
          usdot: state.companyInfo.info?.usdot_number,
          company_name: state.companyInfo.info?.legal_name,
          company_address: state.companyInfo.info?.physical_address,
          company_phone: state.companyInfo.info?.phone,
        });

      setLocalStorage(state);
    },
    changePersonalInfo: (state, { payload: { name, value } }) => {
      state.personalInfo.info[name] = value;
      state.personalInfo.successed = checkingPersonalInfoSuccess(state.personalInfo);
    },
    changeAuthorityType: (state, action) => {
      state.companyInfo.authorityType = action.payload;
      state.companyInfo.authorityNumber = "";
      state.companyInfo.info = {};
      state.companyInfo.successed = checkingCompanyInfoSuccess(state.companyInfo);
    },
    changeAuthorityNumber: (state, action) => {
      state.companyInfo.authorityNumber = action.payload;
    },
    changeNewUserInfo: (state, action) => {
      state.newUserInfo = { ...state.newUserInfo, ...action.payload };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(checkingPhone.fulfilled, (state, action) => {
        state.personalInfo.checkedPhone = action.payload;
      })
      .addCase(checkingEmail.fulfilled, (state, action) => {
        state.personalInfo.checkedEmail = action.payload;
      })
      .addCase(getCompany.pending, (state, action) => {
        state.companyInfo.isLoading = true;
        state.companyInfo.info = {};
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.companyInfo.isLoading = false;
        state.companyInfo.info = action.payload;
        state.companyInfo.successed = checkingCompanyInfoSuccess(state.companyInfo);
      })
      .addCase(registerNewUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerNewUser.fulfilled, (state, action) => {
        localStorage.removeItem("register-information");
        state.step = 4;
        state.createdUserInfo = action.payload;
        state.companyInfo = { info: {}, isLoading: false, authorityType: "", authorityNumber: "" };
        state.personalInfo = {
          info: {},
          checkedPhone: {},
          checkedEmail: {},
        };
        state.newUserInfo = {};
        state.isLoading = false;
      });
  },
});

const { reducer, actions } = registerSlice;

export const {
  changeNewUserInfo,
  changePersonalInfo,
  nextStep,
  prevStep,
  resetRegister,
  changeAuthorityType,
  changeAuthorityNumber,
} = actions;

export default reducer;
