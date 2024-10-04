import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";

function ThemeSwitch({ checked = false, onChange = () => {} }) {
  const { t } = useTranslation();

  return (
    <div
      onClick={() => onChange(!checked)}
      className={`w-[4.3rem] rounded-full p-[0.15rem] flex items-center relative transition cursor-pointer ${
        checked ? "bg-blue" : "bg-white"
      }`}
    >
      {!checked && (
        <div className="text-[0.45rem] flex flex-col items-center uppercase text-black absolute left-3">
          <span className="font-bicubik">{t("light")}</span>
          <span className="font-bicubik">{t("mode")}</span>
        </div>
      )}
      <div
        className={`w-6 h-6 flex justify-center items-center rounded-full bg-white transition  ${
          !checked ? "translate-x-[2.5rem] shadow-[0_0_2px_0_rgba(139,168,177,0.75)]" : ""
        }`}
      >
        {checked ? <icons.moon /> : <icons.sun className="fill-blue w-4" />}
      </div>
      {checked && (
        <div className="text-[0.45rem] flex flex-col items-center uppercase text-white absolute right-3">
          <span className="font-bicubik">{t("dark")}</span>
          <span className="font-bicubik">{t("mode")}</span>
        </div>
      )}
    </div>
  );
}

export default ThemeSwitch;
