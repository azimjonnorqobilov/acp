import { icons } from "assets/icons/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { logout } from "store/slices/authSlice";
import { changeTheme } from "store/slices/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { chooseSearchLoad, chooseLoad } from "store/slices/loadSlice";
import { chooseTruck, chooseSearchTruck } from "store/slices/truckSlice";
import ThemeSwitch from "components/switch/ThemeSwitch";
import MUIModal from "components/mui-modal/MUIModal";
import NewSearch from "layers/new-search/NewSearch";
import Help from "pages/user-profile/help/Help";
import NewPost from "layers/new-post/NewPost";
import { Popover } from "@mui/material";

import logoLight from "assets/images/logo-light.svg";
import logoDark from "assets/images/logo-dark.svg";
import Logout from "layers/logout/Logout";

const ROUTES = {
  "CARRIER-DISPATCHER": [
    {
      id: 1,
      icon: <icons.find className="fill-black dark:fill-white w-5" />,
      label: "find-loads",
      path: "/carrier-dispatcher",
    },
  ],
  CARRIER: [
    {
      id: 1,
      icon: <icons.find className="w-5" />,
      label: "find-loads",
      path: "/carrier",
    },
    {
      id: 2,
      icon: <icons.truck className="w-5" />,
      label: "post-trucks",
      path: "/carrier/post-trucks",
    },
  ],
  BROKER: [
    {
      id: 1,
      icon: <icons.post className="w-4" />,
      label: "post-loads",
      path: "/broker",
    },
    {
      id: 2,
      icon: <icons.truck className="w-5" />,
      label: "find-trucks",
      path: "/broker/find-trucks",
    },
    {
      id: 3,
      icon: <icons.table className="w-5" />,
      label: "shippers-loads",
      path: "/broker/shippers-loads",
    },
  ],
  SHIPPER: [
    {
      id: 1,
      icon: <icons.table className="w-4 fill-black dark:fill-white" />,
      label: "shippers-loads",
      path: "/shipper",
    },
  ],
};

const PROFILE_ROUTES = {
  "CARRIER-DISPATCHER": [
    { id: 1, icon: <icons.profile />, label: "profile", path: "profile" },
    { id: 2, icon: <icons.rate />, label: "comment-and-review", path: "comment-and-review" },
    { id: 3, icon: <icons.help />, label: "help", path: "help" },
    { id: 4, icon: <icons.logout />, label: "logout", path: "logout" },
  ],
  CARRIER: [
    { id: 1, icon: <icons.profile />, label: "profile", path: "profile" },
    { id: 2, icon: <icons.info />, label: "company-information", path: "company-information" },
    { id: 3, icon: <icons.rate />, label: "comment-and-review", path: "comment-and-review" },
    { id: 4, icon: <icons.table />, label: "posted-trucks", path: "posted-trucks" },
    { id: 5, icon: <icons.help />, label: "help", path: "help" },
    { id: 6, icon: <icons.logout />, label: "logout", path: "logout" },
  ],
  BROKER: [
    { id: 1, icon: <icons.profile />, label: "profile", path: "profile" },
    { id: 2, icon: <icons.info />, label: "company-information", path: "company-information" },
    { id: 3, icon: <icons.rate />, label: "comment-and-review", path: "comment-and-review" },
    { id: 4, icon: <icons.table />, label: "posted-loads", path: "posted-loads" },
    { id: 5, icon: <icons.help />, label: "help", path: "help" },
    { id: 6, icon: <icons.logout />, label: "logout", path: "logout" },
  ],
  SHIPPER: [
    { id: 1, icon: <icons.profile />, label: "profile", path: "profile" },
    { id: 2, icon: <icons.rate />, label: "comment-and-review", path: "comment-and-review" },
    { id: 3, icon: <icons.table />, label: "posted-loads", path: "posted-loads" },
    { id: 4, icon: <icons.help />, label: "help", path: "help" },
    { id: 5, icon: <icons.logout />, label: "logout", path: "logout" },
  ],
};

function SystemNavbar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    auth: { userInfo },
    theme: {
      themeMode,
      themeType,
      device: { deviceType },
    },
    loads: { loads, searchLoads },
    trucks: { trucks, searchTrucks },
  } = useSelector((store) => store);
  const [openPopover, setOpenPopover] = useState(null);
  const [openModal, setOpenModal] = useState({ open: false, action: "" });

  const currentPath = pathname?.split("/");

  const handleChangeThemeMode = (mode) =>
    dispatch(changeTheme({ name: "themeMode", value: mode ? "dark" : "light" }));

  const handleOpenMenu = (e) => setOpenPopover(e.currentTarget);
  const handleCloseMenu = (e) => setOpenPopover(null);

  const handleOpenModal = (action) => setOpenModal({ open: true, action });
  const handleCloseModal = () => setOpenModal({ ...openModal, open: false });

  const handleNavigateProfile = (path) => {
    navigate(`/${currentPath?.[1]}/${path}`);
    handleCloseMenu();
  };

  const handleLogout = () => dispatch(logout());

  const handleGetTotalResults = () => {
    if (deviceType === "desktop") {
      (currentPath?.[1] === "carrier-dispatcher" || currentPath?.[1] === "carrier") &&
        searchLoads?.activeSearchLoad?.id &&
        dispatch(chooseSearchLoad({}));

      currentPath?.[1] === "carrier" && trucks?.activeTruck?.id && dispatch(chooseTruck({}));

      currentPath?.[1] === "broker" &&
        searchTrucks?.activeSearchTruck?.id &&
        dispatch(chooseSearchTruck({}));

      (currentPath?.[1] === "broker" || currentPath?.[1] === "shipper") &&
        loads?.activeLoad?.id &&
        dispatch(chooseLoad({}));

      currentPath?.[1] === "broker" &&
        currentPath?.[2] === "shippers-loads" &&
        searchLoads?.activeSearchLoad?.id &&
        dispatch(chooseSearchLoad({}));
    } else {
      (["carrier", "carrier-dispatcher"]?.some((e) => pathname?.includes(e)) ||
        ["broker", "shippers-loads"]?.every((e) => pathname?.includes(e))) &&
        navigate(`${pathname}/available-loads`);

      (((currentPath?.[1] === "broker" || currentPath?.[1] === "shipper") && !currentPath?.[2]) ||
        ["broker", "find-trucks"]?.every((e) => pathname?.includes(e))) &&
        navigate(`${pathname}/available-trucks`);
    }
  };

  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  useEffect(() => {
    if (themeType === "acp") {
      document.documentElement.classList.add("acp");
    } else {
      document.documentElement.classList.remove("acp");
    }
  }, [themeType]);

  useEffect(() => {
    handleCloseModal();
  }, [searchLoads?.refresh, loads?.refresh, trucks?.refresh, searchTrucks?.refresh]);

  return (
    <>
      <MUIModal open={openModal?.open}>
        {openModal?.action === "help" && <Help onClose={handleCloseModal} />}
        {openModal?.action === "new-search" && (
          <NewSearch action="create" onClose={handleCloseModal} />
        )}
        {openModal?.action === "new-post" && <NewPost action="create" onClose={handleCloseModal} />}

        {openModal?.action === "logout" && (
          <Logout onLogout={handleLogout} onClose={handleCloseModal} />
        )}
      </MUIModal>
      <Popover
        open={openPopover ? true : false}
        anchorEl={openPopover}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          ".MuiPaper-root": { background: "none", borderRadius: "1rem", marginTop: "0.75rem" },
        }}
      >
        <div className="flex flex-col gap-2 px-6 py-2 bg-white dark:bg-green_4 dark:text-white">
          {PROFILE_ROUTES?.[currentPath?.[1]?.toUpperCase()]?.map((route, idx) =>
            route?.path === "help" ? (
              <span
                key={route?.id}
                onClick={() => handleOpenModal("help")}
                className={`flex items-center gap-2 py-2 pr-2 cursor-pointer hover:text-blue [&>*:nth-child(1)]:hover:fill-blue dark:[&>*:nth-child(1)]:hover:fill-blue dark:[&>*:nth-child(1)]:fill-white ${
                  idx < PROFILE_ROUTES?.[currentPath?.[1]?.toUpperCase()]?.length - 1
                    ? "border-b border-gray_lighter dark:border-green_5"
                    : ""
                }`}
              >
                {route?.icon} <span>{t(route?.label)}</span>
              </span>
            ) : route?.path === "logout" ? (
              <span
                key={route?.id}
                onClick={() => handleOpenModal("logout")}
                className={`flex items-center gap-2 py-2 pr-2 cursor-pointer hover:text-red [&>*:nth-child(1)]:hover:fill-red dark:[&>*:nth-child(1)]:hover:fill-red dark:[&>*:nth-child(1)]:fill-white ${
                  idx < PROFILE_ROUTES?.[currentPath?.[1]?.toUpperCase()]?.length - 1
                    ? "border-b border-gray_lighter dark:border-green_5"
                    : ""
                }`}
              >
                {route?.icon} <span>{t(route?.label)}</span>
              </span>
            ) : (
              <span
                key={route?.id}
                onClick={() => handleNavigateProfile(route?.path)}
                className={`flex items-center gap-2 py-2 pr-2 cursor-pointer hover:text-blue [&>*:nth-child(1)]:hover:fill-blue dark:[&>*:nth-child(1)]:hover:fill-blue dark:[&>*:nth-child(1)]:fill-white ${
                  idx < PROFILE_ROUTES?.[currentPath?.[1]?.toUpperCase()]?.length - 1
                    ? "border-b border-gray_lighter dark:border-green_5"
                    : ""
                }`}
              >
                {route?.icon} <span>{t(route?.label)}</span>
              </span>
            )
          )}
        </div>
      </Popover>

      <div>
        <div className="flex justify-between items-center px-4 py-3 gap-1 lg:py-1 lg:p-2">
          <p
            onClick={() => navigate(`/${currentPath?.[1]}`)}
            className="py-2 w-max cursor-pointer flex items-center gap-2"
          >
            <img src={logoDark} alt="logo-light" className="w-[11rem] lg:w-[9rem] dark:hidden" />
            <img
              src={logoLight}
              alt="logo-dark"
              className="w-[11rem] lg:w-[9rem] hidden dark:block"
            />
            {/* <span className="bg-blue font-bold text-white px-2 text-2xl rounded-lg">ACP</span>
            <span className="font-bold text-2xl dark:text-white">Loads</span> */}
          </p>
          <div
            className={`flex rounded-full lg:hidden ${
              ROUTES?.[currentPath?.[1]?.toUpperCase()]?.length > 1
                ? "bg-white dark:bg-green_2"
                : ""
            }`}
          >
            {ROUTES?.[currentPath?.[1]?.toUpperCase()]?.map((route) =>
              ROUTES?.[currentPath?.[1]?.toUpperCase()]?.length > 1 ? (
                <Link
                  key={route?.id}
                  to={route?.path}
                  className={`w-[12rem]  flex items-center justify-center gap-2 px-4 py-2 rounded-full ${
                    pathname === route?.path
                      ? "bg-blue text-white [&>*:nth-child(1)]:fill-white"
                      : "dark:text-white dark:[&>*:nth-child(1)]:fill-white"
                  }`}
                >
                  {route?.icon}{" "}
                  <span className="text-sm uppercase font-semibold">{t(route?.label)}</span>
                </Link>
              ) : (
                <Link
                  key={route?.id}
                  to={route?.path}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full border-2 border-gray_lighter dark:border-green_3`}
                >
                  {route?.icon}
                  <span className="text-sm font-semibold uppercase dark:text-white">
                    {t(route?.label)}
                  </span>
                </Link>
              )
            )}
          </div>

          <button
            onClick={handleOpenMenu}
            className="bg-white dark:bg-green_2 flex items-center gap-3 p-1 pr-4 rounded-full lg:hidden"
          >
            <div className="w-10 h-10 bg-gray_light dark:bg-green_1 rounded-full flex items-center justify-center">
              <icons.person className="fill-gray_lighter dark:fill-white" />
            </div>
            <span className="text-sm dark:text-white">{`${userInfo?.first_name || ""} ${
              userInfo?.last_name || ""
            }`}</span>
            <icons.hamburger className="fill-gray_dark dark:fill-white" />
          </button>

          <div className="hidden lg:block">
            <ThemeSwitch checked={themeMode === "dark"} onChange={handleChangeThemeMode} />
          </div>
        </div>

        <hr className="mx-4 border border-gray_lighter dark:border-green_3 lg:hidden" />

        {[
          "user",
          "help",
          "profile",
          "posted-loads",
          "posted-trucks",
          "available-loads",
          "available-trucks",
          "company-information",
          "comment-and-review",
        ]?.every((e) => !pathname?.includes(e)) && (
          <div className="px-4 pt-2 pb-0 flex justify-between lg:px-2 lg:pt-0">
            <div className="sm:w-full flex gap-2">
              {((currentPath?.[1] === "carrier" && !currentPath?.[2]) ||
                currentPath?.[1] === "carrier-dispatcher" ||
                (currentPath?.[1] === "broker" &&
                  (currentPath?.[2] === "find-trucks" ||
                    currentPath?.[2] === "shippers-loads"))) && (
                <button
                  onClick={() => handleOpenModal("new-search")}
                  className="w-[10rem] sm:w-1/2 justify-center flex items-center h-8 gap-2 bg-blue px-4 py-1 rounded-lg"
                >
                  <icons.find className="fill-white w-5" />
                  <span className="uppercase text-sm text-white font-semibold sm:text-xs">
                    {t("new-search")}
                  </span>
                </button>
              )}

              {((currentPath?.[1] === "carrier" && currentPath?.[2] === "post-trucks") ||
                (currentPath?.[1] === "broker" && !currentPath?.[2]) ||
                (currentPath?.[1] === "shipper" && !currentPath?.[2])) && (
                <button
                  onClick={() => handleOpenModal("new-post")}
                  className="w-[10rem] sm:w-1/2 justify-center flex items-center h-8 gap-2 bg-blue px-4 py-1 rounded-lg"
                >
                  <icons.plus className="stroke-white w-4 sm:w-3" />
                  <span className="uppercase text-sm text-white font-semibold sm:text-xs">
                    {t("new-post")}
                  </span>
                </button>
              )}

              <button
                onClick={handleGetTotalResults}
                className="sm:w-1/2 sm:justify-center flex items-center h-8 gap-2 bg-white px-4 py-1 dark:bg-green_3 rounded-lg"
              >
                <icons.list className="fill-black w-5 dark:fill-white sm:w-4" />
                <span className="uppercase text-sm text-black font-semibold dark:text-white sm:text-xs">
                  {t("total-results")}
                </span>
              </button>
            </div>
            <div className="lg:hidden">
              <ThemeSwitch checked={themeMode === "dark"} onChange={handleChangeThemeMode} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SystemNavbar;
