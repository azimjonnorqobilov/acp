export const baseURL = () => {
  return process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BASE_URL_PRODUCTION
    : process.env.REACT_APP_BASE_URL_DEVELOP;
};

export default baseURL;
