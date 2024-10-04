import { useEffect, useState } from "react";
import { changeTheme } from "store/slices/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { resetRegister } from "store/slices/registerSlice";
import { resetPasswordDataClear } from "store/slices/authSlice";
import { ROUTES, ADMIN_ROUTES } from "assets/constants/constants";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import PrivateRoute from "services/PrivateRoute";

// landing page

import LandingPage from "layouts/landing-page/LandingPage";
import Home from "pages/landing-page/Home";
import About from "pages/landing-page/About";
import Contact from "pages/landing-page/Contact";
import HowItWorks from "pages/landing-page/HowItWorks";

// landing page

// authorization

import Authorization from "pages/authorization/Authorization";
import SignIn from "pages/authorization/sign-in/SignIn";
import SignUp from "pages/authorization/sign-up/SignUp";
import ResetPassword from "pages/authorization/reset-password/ResetPassword";
import Verification from "pages/authorization/verification/Verification";

// authorization

// admin page

// import AdminPage from "layouts/admin-page/AdminPage";
// import Dashboard from "pages/admin/dashboard/Dashboard";

// admin page

import "react-toastify/dist/ReactToastify.css";
import "assets/styles/tailwind.css";
// import { toastify } from "components/toastify/toastify";
import CompanyVerification from "pages/company-verification/CompanyVerification";

const renderRoutes = (routes) => {
  return routes?.map((route) => (
    <Route
      key={route?.id}
      path={route?.route}
      element={<PrivateRoute redirectRoute="/">{route?.element}</PrivateRoute>}
    >
      {!route?.noCollapses && route?.collapses?.length && renderRoutes(route?.collapses)}
    </Route>
  ));
};

// const renderAdminRoutes = (routes) => {
//   return routes?.map((route) => (
//     <Route key={route?.id} path={route?.route} element={route?.element}>
//       {!route?.noCollapses && route?.collapses?.length && renderAdminRoutes(route?.collapses)}
//     </Route>
//   ));
// };

function App() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const {
    auth: { userInfo },
    register: { step },
    theme: {
      device: { innerWidth },
    },
  } = useSelector((store) => store);

  const [inWidth, setInWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleSetInWidth = () => setInWidth(window.innerWidth);
    window.addEventListener("resize", handleSetInWidth);
    return () => window.removeEventListener("resize", handleSetInWidth);
  }, []);

  useEffect(() => {
    if ((innerWidth > 1024 && inWidth < 1024) || (innerWidth < 1024 && inWidth > 1024)) {
      dispatch(
        changeTheme({
          name: "device",
          value: { innerWidth: inWidth, deviceType: inWidth > 1024 ? "desktop" : "mobile" },
        })
      );
    }
  }, [inWidth]);

  useEffect(() => {
    pathname?.split("/")?.[1] !== "sign-up" && step > 0 && dispatch(resetRegister());
    pathname?.split("/")?.[1] !== "reset-password" && dispatch(resetPasswordDataClear());
  }, [pathname]);

  return (
    <>
      <ToastContainer hideProgressBar />
      <Routes>
        {/* landing page routes render */}

        <Route element={<LandingPage />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Route>

        {/* landing page routes render */}

        {/* sign-in and sign-up pages routes render */}

        <Route element={<Authorization />}>
          <Route path="verification/:key" element={<Verification />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* sign-in and sign-up pages routes render */}

        {/* system page routes render */}

        {renderRoutes(ROUTES(userInfo?.entity_type))}

        <Route
          path="company-verification"
          element={
            <PrivateRoute redirectRoute="/">
              <CompanyVerification />
            </PrivateRoute>
          }
        />

        {/* system page routes render */}

        {/* admin page routes render */}

        {/* {renderAdminRoutes(ADMIN_ROUTES)} */}

        {/* <Route path="admin" element={<AdminPage />}>
          <Route index element={<Dashboard />} />
        </Route> */}

        {/* admin page routes render */}

        <Route
          path="*"
          element={
            <Navigate
              to={userInfo ? ROUTES(userInfo?.entity_type)?.[0]?.collapses?.[0]?.route : "/"}
              replace
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
