import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const ROUTES = {
  "CARRIER-DISPATCHER": [
    {
      id: 1,
      icon: <icons.find className="fill-black dark:fill-white w-5" />,
      label: "Find loads",
      path: "/carrier-dispatcher",
    },
    {
      id: 2,
      icon: <icons.personOutline />,
      label: "Profile",
      path: "/carrier-dispatcher/user",
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
    {
      id: 3,
      icon: <icons.personOutline />,
      label: "profile",
      path: "/carrier/user",
    },
  ],
  BROKER: [
    {
      id: 1,
      icon: <icons.post className="w-5" />,
      label: "Post loads",
      path: "/broker",
    },
    {
      id: 2,
      icon: <icons.truck className="w-6" />,
      label: "Find trucks",
      path: "/broker/find-trucks",
    },
    {
      id: 3,
      icon: <icons.table className="w-6" />,
      label: "Shippers loads",
      path: "/broker/shippers-loads",
    },
    {
      id: 4,
      icon: <icons.personOutline />,
      label: "Profile",
      path: "/broker/user",
    },
  ],
  SHIPPER: [
    {
      id: 1,
      icon: <icons.table className="w-4 fill-black dark:fill-white" />,
      label: "Shippers loads",
      path: "/shipper",
    },
    {
      id: 2,
      icon: <icons.personOutline />,
      label: "Profile",
      path: "/shipper/user",
    },
  ],
};

function Appbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const currentPath = pathname?.split("/");

  return (
    <div className="w-full bg-white dark:bg-[#2C495A] p-2">
      <div className="flex justify-evenly items-center">
        {ROUTES?.[currentPath?.[1]?.toUpperCase()]?.map((route) => (
          <div
            key={route?.id}
            // to={route?.path}
            onClick={() => navigate(route?.path)}
            className={`flex flex-col items-center cursor-pointer`}
            // className={`flex items-center gap-2 px-6 py-2 rounded-full ${
            //   pathname === route?.path
            //     ? "bg-blue text-white [&>*:nth-child(1)]:fill-white"
            //     : "dark:text-white dark:[&>*:nth-child(1)]:fill-white"
            // }`}
          >
            <span
              className={`w-12 h-12 flex items-center justify-center rounded-full ${
                pathname === route?.path
                  ? "bg-blue [&>*:nth-child(1)]:fill-white"
                  : "bg-[#F2F5F9] dark:bg-[#1A313E] [&>*:nth-child(1)]:fill-blue"
              }`}
            >
              {route?.icon}
            </span>
            <span
              className={`text-xs capitalize ${
                pathname === route?.path ? "text-blue" : "dark:text-white"
              }`}
            >
              {t(route?.label)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Appbar;
