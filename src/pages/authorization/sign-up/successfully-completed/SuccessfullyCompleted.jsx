import { useSelector } from "react-redux";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function SuccessfullyCompleted() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createdUserInfo } = useSelector((store) => store.register);

  const email = createdUserInfo?.user?.email;

  return (
    <div className="w-[90%] mx-auto flex flex-col gap-4 items-center justify-center text-center h-full overflow-y-auto py-2">
      <div className="w-[8rem] xl:w-[6rem] h-[8rem] xl:h-[6rem] border border-blue rounded-full flex justify-center items-center">
        <icons.message className="fill-none stroke-blue w-[5rem] xl:w-[3rem]" />
      </div>
      <p className="font-bicubik text-2xl xl:text-xl">{t("successfully-completed")}</p>
      <p className="text-xl xl:text-base text-gray">
        {t("sent-to-the-email")} (
        {email?.replace(email?.substr(1, email?.indexOf("@") - 2), "****")}).{" "}
        {t("please-active-your-account")}
      </p>
      <button
        onClick={() => navigate("/sign-in")}
        className="bg-blue px-8 py-2 rounded-lg flex items-center gap-2 text-lg xl:text-base text-white"
      >
        <icons.login className="fill-white w-4" /> <span>{t("login")}</span>
      </button>
    </div>
  );
}

export default SuccessfullyCompleted;
