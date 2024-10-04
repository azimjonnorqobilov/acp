import { useState } from "react";
import { useMutation } from "react-query";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { sendCompanyRates } from "store/slices/userSlice";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import RatingStars from "components/rating-stars/RatingStars";

function Rating({ onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    user: {
      companyInformation: { companyInfo },
    },
  } = useSelector((store) => store);
  const [rates, setRates] = useState(companyInfo?.my_rate);

  const { mutate: handleSendRates, isLoading } = useMutation("send-message", () =>
    dispatch(sendCompanyRates({ ...rates, company: companyInfo?.id }))
  );

  const handleChangeRates = (name, value) => setRates({ ...rates, [name]: value });

  return (
    <div className="w-max lg:max-w-[96%] flex flex-col p-6 rounded-2xl bg-white dark:bg-green_4 relative dark:text-white">
      <button onClick={onClose} className="w-max h-max absolute top-4 right-4">
        <icons.close className="w-3 stroke-black dark:stroke-white" />
      </button>

      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center rounded-xl">
          <BounceDotsLoader />
        </div>
      )}

      <div className="flex flex-col items-center gap-6">
        <p className="font-bicubik text-center">{t("rating")}</p>

        <div className="grid grid-cols-[11rem_1fr] gap-4 whitespace-nowrap">
          <span className="text-gray_dark dark:text-gray_lighter">Level of Communication: </span>
          <RatingStars rating={rates?.loc} onChange={(value) => handleChangeRates("loc", value)} />
          <span className="text-gray_dark dark:text-gray_lighter">Level of Service: </span>
          <RatingStars rating={rates?.los} onChange={(value) => handleChangeRates("los", value)} />
          <span className="text-gray_dark dark:text-gray_lighter">Reliable Information: </span>
          <RatingStars rating={rates?.ri} onChange={(value) => handleChangeRates("ri", value)} />
          <span className="text-gray_dark dark:text-gray_lighter">Level of Freight Care: </span>
          <RatingStars
            rating={rates?.lofc}
            onChange={(value) => handleChangeRates("lofc", value)}
          />
          <span className="text-gray_dark dark:text-gray_lighter">Speed of Payment: </span>
          <RatingStars rating={rates?.sop} onChange={(value) => handleChangeRates("sop", value)} />
        </div>
        <button
          onClick={handleSendRates}
          className="bg-blue text-white text-sm px-8 py-2 rounded-xl uppercase w-max"
        >
          {t("submit")}
        </button>
      </div>
    </div>
  );
}

export default Rating;
