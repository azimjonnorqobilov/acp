import axios from "axios";
import baseURL from "./getBaseUrl";
// import { memoizedRefreshToken } from "./refreshToken";

axios.defaults.baseURL = baseURL();

axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Token ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// axios.interceptors.response.use(
//   (response) => response,
//   // console.log(config);
//   async (error) => {
//     const config = error?.config;

//     if (error?.response?.status === 401 && !config?.sent) {
//       config.sent = true;

//       // const result = await memoizedRefreshToken();

//       // if (result?.access) {
//       //   config.headers = {
//       //     ...config.headers,
//       //     authorization: `Token ${result?.access}`,
//       //   };
//       // }

//       return axios(config);
//     }
//     return Promise.reject(error);
//   }
// );

export const axiosPrivate = axios;
