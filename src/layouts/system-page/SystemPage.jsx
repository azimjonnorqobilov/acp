import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import SystemNavbar from "layers/navbar/SystemNavbar";
import Appbar from "layers/appbar/Appbar";

function SystemPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    auth: { userInfo },
    theme: {
      device: { deviceType },
    },
  } = useSelector((store) => store);

  const dynamicNavbarHeight =
    deviceType === "desktop"
      ? [
          "profile",
          "company-information",
          "comment-and-review",
          "posted-loads",
          "posted-trucks",
          "help",
        ]?.some((e) => pathname?.includes(e))
        ? "74.4px"
        : "114.4px"
      : ["user"]?.some((e) => pathname?.includes(e))
      ? "130.51px"
      : [
          "available-loads",
          "available-trucks",
          "profile",
          "company-information",
          "comment-and-review",
          "posted-loads",
          "posted-trucks",
        ]?.some((e) => pathname?.includes(e))
      ? "51px"
      : "162.51px";

  useEffect(() => {
    !userInfo && navigate("/");
  }, [userInfo]);

  return (
    <div className="bg-blue_light dark:bg-green_1 h-[100dvh]">
      {!userInfo?.status && userInfo?.entity_type !== "shipper" && (
        <div className="w-full bg-blue_7 dark:bg-green_3 text-center flex justify-center py-1">
          <p className="text-black dark:text-white text-xs pt-1 text-end lg:pb-1 lg:pt-0 lg:text-center">
            <span>
              {userInfo?.entity_type === "carrier-dispatcher"
                ? t("upgrade-your-account-with-mc-click") + " "
                : t("verification-of-your-account-through-this-link-click") + " "}
            </span>
            <Link to="/company-verification" target="_blank" className="text-blue cursor-pointer">
              {t("here")}
            </Link>
          </p>
        </div>
      )}
      <div
        className={` ${
          !userInfo?.status && userInfo?.entity_type !== "shipper"
            ? "h-[calc(100%-28px)]"
            : "h-full"
        }`}
      >
        <SystemNavbar />
        <div style={{ height: `calc(100% - ${dynamicNavbarHeight})` }}>
          <Outlet />
        </div>
        {[
          "available-loads",
          "available-trucks",
          "profile",
          "company-information",
          "comment-and-review",
          "posted-loads",
          "posted-trucks",
        ]?.every((e) => !pathname?.includes(e)) && (
          <div className="hidden lg:block">
            <Appbar />
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemPage;
