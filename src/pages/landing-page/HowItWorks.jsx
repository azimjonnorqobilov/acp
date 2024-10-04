import { icons } from "assets/icons/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function HowItWorks() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  document.title = t("how-it-works");

  return (
    <div className="flex flex-col items-center gap-4 h-full pt-6 md:py-2 md:h-auto">
      <div className="grid grid-cols-[30rem_30rem] justify-center items-center gap-4 px-4 lg:w-full lg:grid-cols-2 lg:gap-4 md:p-0 md:!grid-cols-1">
        <div className="w-full h-full flex flex-col gap-4 items-start">
          <p className="text-5xl xl:text-3xl md:text-2xl font-bicubik">{t("how-it-works")}</p>
          <p className="text-white_70 text-xl xl:text-base">{t("how-it-works-description")}</p>
          <p className="uppercase font-semibold text-xl xl:text-lg">{t("lets-join-us-its-free")}</p>

          <button
            onClick={() => navigate("/sign-up")}
            className="flex items-center gap-2 bg-blue rounded-lg px-8 py-2 text-lg xl:text-base md:w-full md:justify-center"
          >
            <span className="uppercase">{t("sign-up")} </span> <icons.signUp />
          </button>
        </div>

        <div className="w-full h-[22rem] xl:h-[17rem] bg-blue rounded-3xl"> </div>

        <div className="w-full h-full flex flex-col gap-2 p-4 border border-white_10 bg-white_10 rounded-3xl text-lg">
          <p className="md:text-lg font-bicubik">{t("how-it-works-post.post-1-title")}</p>

          <p className="md:text-base text-white_70">{t("how-it-works-post.post-1-description")}</p>
        </div>

        <div className="w-full h-full flex flex-col gap-2 p-4 border border-white_10 bg-white_10 rounded-3xl text-lg">
          <p className="md:text-lg font-bicubik">{t("how-it-works-post.post-2-title")}</p>

          <p className="md:text-base text-white_70">{t("how-it-works-post.post-2-description")}</p>
        </div>
      </div>

      <div className="flex flex-col items-center text-center gap-2 mt-6">
        <p className="text-3xl xl:text-2xl md:text-xl font-bicubik">{t("curious-about-us")}</p>
        <p className="text-white_70 text-lg xl:text-base">{t("get-the-essentials-here")}</p>
        <button
          onClick={() => navigate("/about")}
          className="px-4 py-2 bg-blue text-white rounded-lg text-lg xl:text-base uppercase"
        >
          {t("about-us")}
        </button>
      </div>
    </div>
  );
}

export default HowItWorks;
