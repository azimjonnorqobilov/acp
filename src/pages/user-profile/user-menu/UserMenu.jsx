import { icons } from "assets/icons/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { logout } from "store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MUIModal from "components/mui-modal/MUIModal";
import Help from "../help/Help";

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

function UserMenu() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    theme: {
      device: { deviceType },
    },
  } = useSelector((store) => store);

  const currentPath = pathname?.split("/");

  const prevPath = pathname?.split("/");

  const [openModal, setOpenModal] = useState({ open: false });

  const handleOpenModal = () => setOpenModal({ open: true });
  const handleCloseModal = () => setOpenModal({ open: false });

  const handleLogout = () => dispatch(logout());

  useEffect(() => {
    prevPath.pop();
    prevPath.push("profile");
    deviceType === "desktop" && navigate(prevPath?.join("/"));
  }, [deviceType]);

  return (
    <>
      <MUIModal open={openModal?.open} onClose={handleCloseModal}>
        <Help onClose={handleCloseModal} />
      </MUIModal>

      <div className="w-full h-full flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          {PROFILE_ROUTES?.[currentPath?.[1]?.toUpperCase()]?.map((route, idx) =>
            route?.path !== "help" ? (
              <Link
                key={route?.id}
                to={route?.path}
                className={`w-full flex items-center gap-4 bg-white dark:bg-[#2C495A] dark:text-white dark:[&>*:nth-child(1)]:fill-white rounded-xl px-4 py-2`}
              >
                {route?.icon}
                <span>{t(route?.label)}</span>
              </Link>
            ) : (
              <div
                key={route?.id}
                onClick={handleOpenModal}
                className={`w-full flex items-center gap-4 bg-white dark:bg-[#2C495A] dark:text-white dark:[&>*:nth-child(1)]:fill-white rounded-xl px-4 py-2`}
              >
                {route?.icon}
                <span>{t(route?.label)}</span>
              </div>
            )
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-4 dark:text-white bg-white dark:bg-[#2C495A] rounded-xl px-4 py-2"
        >
          <icons.logout className="fill-black dark:fill-white" />
          <span>{t("log-out")}</span>
        </button>
      </div>
    </>
  );
}

export default UserMenu;
