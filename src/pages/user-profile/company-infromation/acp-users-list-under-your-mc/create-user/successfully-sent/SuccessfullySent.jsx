import { useSelector } from "react-redux";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";

function SuccessfullySent({ onClick }) {
  const { t } = useTranslation();
  const {
    user: {
      companyInformation: { createdEmployes },
    },
  } = useSelector((store) => store);

  return (
    <div className="w-[18rem] lg:w-full flex flex-col gap-4 items-center text-center">
      <div className="w-[5rem] h-[5rem] border border-blue rounded-full flex justify-center items-center">
        <icons.message className="fill-none stroke-blue w-10" />
      </div>
      <p className="font-bicubik">{t("successfully-sent")}</p>
      <p className="text-gray text-sm">
        {t("the-activation-link-has-been-sent-to-the-email")} (
        {createdEmployes?.email?.replace(
          createdEmployes?.email?.substr(1, createdEmployes?.email?.indexOf("@") - 2),
          "****"
        )}
        ). {t("please-activate-the-account-through-the-link-thank-you")}
      </p>
      <button
        onClick={onClick}
        className="bg-blue px-10 py-2 rounded-lg gap-2 text-sm text-white uppercase"
      >
        {t("ok")}
      </button>
    </div>
  );
}

export default SuccessfullySent;
