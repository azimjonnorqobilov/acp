import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { icons } from "assets/icons/icons";

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  document.title = t("acp-loads-smart-loadboard");

  return (
    <div className="flex flex-col items-center h-full">
      <button
        onClick={() => navigate("sign-up")}
        className="border border-white px-4 py-1 font-bold uppercase hidden md:block mt-5"
      >
        {t("sign-up")}
      </button>

      <p className="text-center text-[40px] leading-[50px] flex flex-col mt-8 md:text-2xl md:px-4 md:mt-5">
        <span className="font-bicubik">{t("precision-logistics")}:</span>
        <span className="font-bicubik">{t("connecting-your-world")}</span>
      </p>
      <div className="grid grid-cols-[8rem_8rem_8rem] md:grid-cols-[5rem_5rem_5rem] gap-6 justify-center items-center mt-4 relative">
        <div className="absolute w-[80%] bg-white_50 h-[1px] opacity-50 mt-[-1.8rem] md:mt-[-3rem] ml-6 z-2" />

        <Link to="/about" className="flex flex-col justify-center items-center cursor-pointer z-10">
          <div className="bg-[#10222F] md:bg-[#002231] flex justify-center items-center border-[0.1px] border-white_50 w-[5rem] h-[5rem] p-4 rounded-full transition hover:border-white md:w-[5rem] md:h-[5rem] md:p-5">
            <icons.about />
          </div>
          <span className="uppercase  lg:text-[10px] font-medium mt-2 text-center">
            {t("about-us")}
          </span>
        </Link>

        <Link
          to="/contact"
          className="flex flex-col justify-center items-center cursor-pointer z-10"
        >
          <div className="bg-[#10222F] md:bg-[#002231] flex justify-center items-center border-[0.1px] border-white_50 w-[5rem] h-[5rem] p-5 rounded-full transition hover:border-white md:w-[5rem] md:h-[5rem] md:p-5">
            <icons.contactUs />
          </div>
          <span className="uppercase lg:text-[10px] font-medium mt-2 text-center">
            {t("contact-us")}
          </span>
        </Link>

        <Link
          to="how-it-works"
          className="flex flex-col justify-center items-center cursor-pointer z-10"
        >
          <div className="bg-[#10222F] md:bg-[#002231] flex justify-center items-center border-[0.1px] border-white_50 w-[5rem] h-[5rem] p-5 rounded-full transition hover:border-white md:w-[5rem] md:h-[5rem] md:p-5">
            <icons.howItWorks />
          </div>
          <span className="uppercase  lg:text-[10px] font-medium mt-2 text-center">
            {t("how-it-works")}
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Home;
