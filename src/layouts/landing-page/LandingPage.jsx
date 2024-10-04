import { useState } from "react";
import { icons } from "assets/icons/icons";
import i18n from "internationalization/i18n";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "store/slices/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logoLight from "assets/images/logo-light.svg";
import MUIMenu from "components/mui-menu/MUIMenu";
import { Tooltip } from "@mui/material";

function LandingPage() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    auth: { userInfo },
    theme: { language },
  } = useSelector((store) => store);
  const [openTooltip, setOpenTooltip] = useState(false);

  const handleChangeLanguage = (lang) => {
    dispatch(changeLanguage(lang));
    i18n.changeLanguage(lang);
  };

  return (
    <div
      className={`h-[100dvh]  flex flex-col items-center justify-between text-white pb-4 pt-6 md:px-2 md:py-0 relative ${
        !pathname?.split("/")?.[1]
          ? "bg-landing-page bg-cover bg-center bg-no-repeat md:bg-landing-page-mobile md:bg-bottom"
          : "bg-gradient-to-r from-green_dark to-green_darker"
      }`}
    >
      <div className="w-[90%] md:w-full">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-10 text-xs py-2">
            <Link
              to="/"
              className="text-lg text-black rounded-sm flex items-center gap-2 cursor-pointer"
            >
              <img src={logoLight} alt="logo-light" className="w-[12rem] md:w-[10rem]" />
              {/* <span className="bg-blue font-bold text-white px-2 text-2xl rounded-lg md:text-xl">
                ACP
              </span>
              <span className="font-bold text-2xl text-white md:text-xl">Loads</span> */}
            </Link>
            {pathname?.split("/")?.[1] && (
              <div className="flex items-center gap-8 text-[18px] font-medium uppercase md:hidden">
                <Link
                  to="/about"
                  className={`flex items-center justify-center text-center gap-2 pb-1 hover:opacity-70 ${
                    pathname?.split("/")?.[1] === "about" ? "border-b" : ""
                  }`}
                >
                  <icons.about className="w-5 h-auto fill-white" /> <span>{t("about-us")}</span>
                </Link>
                <Link
                  to="/contact"
                  className={`flex items-center justify-center text-center gap-2 pb-1 hover:opacity-70 ${
                    pathname?.split("/")?.[1] === "contact" ? "border-b" : ""
                  }`}
                >
                  <icons.contactUs className="w-4 h-auto fill-white" />{" "}
                  <span>{t("contact-us")}</span>
                </Link>
                <Link
                  to="/how-it-works"
                  className={`flex items-center justify-center text-center gap-2 pb-1 hover:opacity-70 ${
                    pathname?.split("/")?.[1] === "how-it-works" ? "border-b" : ""
                  }`}
                >
                  <icons.howItWorks className="w-4 h-auto fill-white" />{" "}
                  <span>{t("how-it-works")}</span>
                </Link>
              </div>
            )}
          </div>

          {!pathname?.split("/")?.[1] && (
            <p className="pl-8 text-xl text-center font-medium uppercase text-[#FFFFFFB2] md:hidden absolute left-[calc(50%-141px)]">
              {t("lets-join-us-its-free")}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs md:gap-1">
            <button
              onClick={() => navigate("sign-in")}
              className="flex items-center px-4 py-2 gap-2 rounded-[12px] transition hover:bg-blue md:px-2 md:py-1"
            >
              <span className="font-[18px] uppercase">
                {userInfo?.id
                  ? `${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`
                  : t("login")}
              </span>{" "}
              <icons.login />
            </button>
            {!userInfo?.id && (
              <button
                onClick={() => navigate("sign-up")}
                className="flex items-center px-4 py-2 gap-2 rounded-[12px] transition hover:bg-blue md:px-2 md:py-1 md:hidden"
              >
                <span className="font-[18px] uppercase">{t("sign-up")}</span> <icons.signUp />
              </button>
            )}

            {/* <button className="p-2 bg-blue rounded-full">
              <icons.globus className="fill-white w-[20px] h-[20px]" />
            </button> */}
            <MUIMenu
              value={language}
              onChange={handleChangeLanguage}
              options={[
                { id: 1, label: "EN", value: "eng" },
                { id: 2, label: "ES", value: "esp" },
              ]}
              themeMode="dark"
              buttonLabel={() => (
                <div className="p-[5px] bg-blue rounded-full">
                  <icons.globus className="fill-white w-[17px] h-[17px]" />
                </div>
              )}
              customButton={true}
            />
          </div>
        </div>

        <div className="hidden md:block">
          {pathname?.split("/")?.[1] ? (
            <div className="flex items-center justify-center text-sm gap-4 py-2">
              <Link
                to="/about"
                className={`flex items-center justify-center text-center gap-2 pb-1 hover:opacity-70 ${
                  pathname?.split("/")?.[1] === "about" ? "border-b" : ""
                }`}
              >
                <icons.about className="w-5 h-auto fill-white" /> <span>ABOUT US</span>
              </Link>
              <Link
                to="/contact"
                className={`flex items-center justify-center text-center gap-2  pb-1 hover:opacity-70 ${
                  pathname?.split("/")?.[1] === "contact" ? "border-b" : ""
                }`}
              >
                <icons.contactUs className="w-4 h-auto fill-white" /> <span>CONTACT US</span>
              </Link>
              <Link
                to="/how-it-works"
                className={`flex items-center justify-center text-center gap-2 pb-1 hover:opacity-70 ${
                  pathname?.split("/")?.[1] === "how-it-works" ? "border-b" : ""
                }`}
              >
                <icons.howItWorks className="w-4 h-auto fill-white" /> <span>HOW IT WORKS</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray_lighter text-center uppercase mt-4">
                {t("lets-join-us-its-free")}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="h-full w-full overflow-y-auto ">
        <Outlet />
      </div>

      <p className="md:text-xs md:py-2 capitalize">{t("acp-loads-group-since-2022")}</p>
      {!pathname?.split("/")?.[1] && (
        <div className="absolute right-[5%] md:right-[2%] bottom-4 flex items-center lg:flex-col gap-2">
          <Tooltip
            title={<span className="uppercase">{t("copied-mail")}</span>}
            open={openTooltip}
            disableHoverListener
            onClick={() => {
              navigator.clipboard.writeText("info@acploads.com");
              setOpenTooltip(true);
              setTimeout(() => {
                setOpenTooltip(false);
              }, 2000);
            }}
          >
            <div className="border border-blue rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
              <icons.outlook className="fill-blue w-4 h-4" />
            </div>
          </Tooltip>
          <Link
            to="https://t.me/anycappro_com"
            rel="noreferrer"
            target="_blank"
            className="border border-blue rounded-full w-7 h-7 flex items-center justify-center"
          >
            <icons.telegram_no_border className="fill-blue w-4 h-4" />
          </Link>

          <Link
            to="https://www.instagram.com/acploads/"
            rel="noreferrer"
            target="_blank"
            className="border border-blue rounded-full w-7 h-7 flex items-center justify-center"
          >
            <icons.instagram className="fill-blue w-4 h-4" />
          </Link>
          <Link
            to="https://www.youtube.com/@acploads"
            rel="noreferrer"
            target="_blank"
            className="border border-blue rounded-full w-7 h-7 flex items-center justify-center"
          >
            <icons.youtube className="fill-blue w-4 h-4" />
          </Link>
          <Link
            to="https://www.linkedin.com/in/acp-loads-155277302/"
            rel="noreferrer"
            target="_blank"
            className="border border-blue rounded-full w-7 h-7 flex items-center justify-center"
          >
            <icons.linkedin className="fill-blue w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
