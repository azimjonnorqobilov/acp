import { useSelector } from "react-redux";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";

function SuccessfullySubmitted({ onClose }) {
  const { t } = useTranslation();
  const {
    user: {
      verificationCompany: { response },
    },
  } = useSelector((store) => store);

  return (
    <div className="w-[60%] lg:w-[90%] mt-16 mx-auto flex flex-col gap-4 items-center text-center">
      <div className="w-[4rem] h-[4rem] border border-blue rounded-full flex justify-center items-center">
        <icons.check className="fill-blue stroke-blue w-[5rem]" />
      </div>
      <p className="font-bicubik">{t("successfully-submitted")}</p>
      <p className="text-sm text-gray">
        {t("successfully-submitted-description") + " "} (
        {response?.email?.replace(
          response?.email?.substr(1, response?.email?.indexOf("@") - 2),
          "****"
        )}
        ).
      </p>
      {/* <button onClick={onClose} className="bg-blue px-10 py-2 rounded-lg gap-2 text-sm text-white">
        OK
      </button> */}
    </div>
  );
}

export default SuccessfullySubmitted;
