import { useState } from "react";
import { useDispatch } from "react-redux";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { logout } from "store/slices/authSlice";
import { Link, useLocation } from "react-router-dom";
import MUIModal from "components/mui-modal/MUIModal";
import Help from "pages/user-profile/help/Help";
import Logout from "layers/logout/Logout";

const PROFILE_ROUTES = {
  "CARRIER-DISPATCHER": [
    { id: 1, icon: <icons.profile />, label: "profile", path: "/carrier-dispatcher/profile" },
    {
      id: 2,
      icon: <icons.rate />,
      label: "comment-and-review",
      path: "/carrier-dispatcher/comment-and-review",
    },
    { id: 3, icon: <icons.help />, label: "help", path: "help" },
  ],

  CARRIER: [
    { id: 1, icon: <icons.profile />, label: "profile", path: "/carrier/profile" },
    {
      id: 2,
      icon: <icons.info />,
      label: "company-information",
      path: "/carrier/company-information",
    },
    {
      id: 3,
      icon: <icons.rate />,
      label: "comment-and-review",
      path: "/carrier/comment-and-review",
    },
    { id: 4, icon: <icons.table />, label: "posted-trucks", path: "/carrier/posted-trucks" },
    { id: 5, icon: <icons.help />, label: "help", path: "help" },
  ],

  BROKER: [
    { id: 1, icon: <icons.profile />, label: "profile", path: "/broker/profile" },
    {
      id: 2,
      icon: <icons.info />,
      label: "company-information",
      path: "/broker/company-information",
    },
    {
      id: 3,
      icon: <icons.rate />,
      label: "comment-and-review",
      path: "/broker/comment-and-review",
    },
    { id: 4, icon: <icons.table />, label: "posted-loads", path: "/broker/posted-loads" },
    { id: 5, icon: <icons.help />, label: "help", path: "help" },
  ],

  SHIPPER: [
    { id: 1, icon: <icons.profile />, label: "profile", path: "/shipper/profile" },
    {
      id: 2,
      icon: <icons.rate />,
      label: "comment-and-review",
      path: "/shipper/comment-and-review",
    },
    { id: 3, icon: <icons.table />, label: "posted-loads", path: "/shipper/posted-loads" },
    { id: 4, icon: <icons.help />, label: "help", path: "help" },
  ],
};

function UserSidebar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [openModal, setOpenModal] = useState({ open: false, action: "" });

  const currentPath = pathname?.split("/");

  const handleOpenModal = (action) => setOpenModal({ open: true, action });
  const handleCloseModal = () => setOpenModal({ ...openModal, open: false });

  const handleLogout = () => dispatch(logout());

  return (
    <>
      <MUIModal open={openModal?.open}>
        {openModal?.action === "help" && <Help onClose={handleCloseModal} />}
        {openModal?.action === "logout" && (
          <Logout onLogout={handleLogout} onClose={handleCloseModal} />
        )}
      </MUIModal>
      <div className="flex flex-col justify-between text-sm h-full p-6 rounded-2xl relative bg-white dark:bg-green_4">
        <div className="w-full flex flex-col gap-4">
          {PROFILE_ROUTES?.[currentPath?.[1]?.toUpperCase()]?.map((route, idx) =>
            route?.path !== "help" ? (
              <div
                key={route?.id}
                className={`w-full flex items-center  py-2 ${
                  idx !== PROFILE_ROUTES?.[currentPath?.[1]?.toUpperCase()]?.length - 1
                    ? "border-b border-gray_lighter dark:border-green_5"
                    : ""
                }`}
              >
                <Link
                  to={route?.path}
                  className={`w-full flex items-center gap-4 ${
                    pathname === route?.path
                      ? "text-blue [&>*:nth-child(1)]:fill-blue"
                      : "[&>*:nth-child(1)]:fill-black  dark:[&>*:nth-child(1)]:fill-white dark:text-white "
                  }`}
                >
                  {route?.icon}
                  <span>{t(route?.label)}</span>
                </Link>
                <div
                  className={`w-[0.3rem] h-8  rounded-bl rounded-tl absolute right-0 ${
                    pathname === route?.path ? "bg-blue" : ""
                  }`}
                />
              </div>
            ) : (
              <div
                key={route?.id}
                onClick={() => handleOpenModal("help")}
                className={`w-full flex items-center  py-2 cursor-pointer  ${
                  idx !== PROFILE_ROUTES?.[currentPath?.[1]?.toUpperCase()]?.length - 1
                    ? "border-b border-gray_lighter dark:border-green_5"
                    : ""
                }`}
              >
                <div
                  className={`w-full flex items-center gap-4 ${
                    pathname === route?.path
                      ? "text-blue [&>*:nth-child(1)]:fill-blue"
                      : "[&>*:nth-child(1)]:fill-black  dark:[&>*:nth-child(1)]:fill-white dark:text-white "
                  }`}
                >
                  {route?.icon}
                  <span>{t(route?.label)}</span>
                </div>
                <div
                  className={`w-[0.3rem] h-8  rounded-bl rounded-tl absolute right-0 ${
                    pathname === route?.path ? "bg-blue" : ""
                  }`}
                />
              </div>
            )
          )}
        </div>
        <button
          onClick={() => handleOpenModal("logout")}
          className="flex items-center gap-4 dark:text-white hover:text-red dark:hover:text-red [&>*:nth-child(1)]:hover:fill-red"
        >
          <icons.logout className="fill-black dark:fill-white" />
          <span>{t("log-out")}</span>
        </button>
      </div>
    </>
  );
}

export default UserSidebar;
