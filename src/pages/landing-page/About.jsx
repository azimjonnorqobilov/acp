import { icons } from "assets/icons/icons";
import { useNavigate } from "react-router-dom";
import globe from "assets/images/globe.svg";
import { useTranslation } from "react-i18next";

function About() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  document.title = t("about-us");

  return (
    <div className="flex flex-col items-center gap-4 h-full pt-6 md:py-2 md:h-auto">
      <div className="flex justify-center items-center gap-8 lg:gap-4 lg:px-4 md:!px-0 md:flex-col ">
        <div className="w-[30rem] h-max border border-white_10 p-6 rounded-2xl flex flex-col gap-4 items-start lg:w-1/2  md:!w-full">
          <p className="text-5xl xl:text-3xl md:text-2xl font-bicubik">{t("about-us")}</p>
          <p className="text-xl xl:text-base">
            {/* <span>{t("acp-loads")} </span> */}
            <span className="text-white_70">{t("about-us-description")}</span>
          </p>
          <div className="bg-blue w-full h-[11rem] rounded-lg"></div>
          <p className="text-white_70 text-xl xl:text-base">{t("about-us-description-2")}</p>
          <button
            onClick={() => navigate("/sign-up")}
            className="flex items-center gap-2 uppercase text-white bg-blue px-4 py-2 rounded-lg text-lg xl:text-base md:w-full md:justify-center"
          >
            <span>{t("sign-up-is-free")}</span>
            <icons.signUp />
          </button>
        </div>

        <div className="w-[30rem] flex flex-col items-center gap-4 text-xl lg:w-1/2  md:!w-full">
          <p className="font-bold text-center uppercase">
            {t("the-advantages-of-our-platformare")}:
          </p>
          <div className="flex flex-wrap justify-center gap-2 uppercase">
            <div className="border-[0.1rem] border-white_10 rounded-3xl flex items-center px-3 py-1">
              <icons.doubleCheck /> <span>{t("quick")}</span>
            </div>
            <div className="border-[0.1rem] border-white_10 rounded-3xl flex items-center px-3 py-1">
              <icons.doubleCheck /> <span>{t("easy")}</span>
            </div>
            <div className="border-[0.1rem] border-white_10 rounded-3xl flex items-center px-3 py-1">
              <icons.doubleCheck /> <span>{t("secure")}</span>
            </div>
            <div className="border-[0.1rem] border-white_10 rounded-3xl flex items-center px-3 py-1">
              <icons.doubleCheck /> <span>{t("comfortable")}</span>
            </div>
            <div className="border-[0.1rem] border-white_10 rounded-3xl flex items-center px-3 py-1">
              <icons.doubleCheck /> <span>{t("understandable")}</span>
            </div>
          </div>
          <img src={globe} alt="Earth globe" className="w-[65%] md:w-[90%]" />
        </div>
      </div>

      <div className="flex flex-col items-center text-center gap-2 mt-6">
        <p className="text-3xl xl:text-2xl md:text-xl font-bicubik">
          {t("any-feedback-or-suggestions")}
        </p>
        <p className="text-white_70 text-lg xl:text-base">{t("about-us-feedback")}</p>
        <button
          onClick={() => navigate("/contact")}
          className="px-4 py-2 bg-blue text-white rounded-lg text-lg xl:text-base uppercase"
        >
          {t("contact-us")}
        </button>
      </div>
    </div>
  );
}

export default About;
