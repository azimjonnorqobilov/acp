import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PERMISSION_CHECK } from "assets/constants/constants";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import RatingStars from "components/rating-stars/RatingStars";
import MUIModal from "components/mui-modal/MUIModal";
import Process from "components/process/Process";
import Rating from "./rating/Rating";

const rating = {
  broker: [
    { label: "Communication Level:", key: "loc" },
    { label: "Service Level:", key: "los" },
    { label: "Load Description:", key: "ri" },
    { label: "Speed of Payment:", key: "sop" },
    { label: "Honesty and Trustworthiness:", key: "lofc" },
  ],
  carrier: [
    { label: "Communication Level:", key: "loc" },
    { label: "Service Level:", key: "los" },
    { label: "Reliable Information:", key: "ri" },
    { label: "Freight Care Level:", key: "lofc" },
    { label: "Punctuality Level:", key: "sop" },
  ],
  shipper: [
    { label: "Communication Level:", key: "loc" },
    { label: "Service Level:", key: "los" },
    { label: "Reliable Information:", key: "ri" },
    { label: "Freight Care Level:", key: "lofc" },
    { label: "Punctuality Level:", key: "sop" },
  ],
};

function RaitingOverview() {
  const { t } = useTranslation();
  const {
    auth: {
      userInfo: { entity_type },
    },
    user: {
      companyInformation: { companyInfo, isLoading, ratesStatus },
    },
  } = useSelector((store) => store);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    handleCloseModal();
  }, [ratesStatus]);

  return (
    <>
      <MUIModal open={openModal}>
        <Rating onClose={handleCloseModal} />
      </MUIModal>
      <div className="border border-gray_lighter rounded-xl bg-gray_light px-4 py-2 text-sm dark:border-[#385566] dark:bg-[#385566] relative">
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center rounded-xl">
            <BounceDotsLoader />
          </div>
        )}
        <div className="flex flex-col items-center gap-1">
          <p className="font-bicubik text-center uppercase text-base font-semibold">
            {t("rating-overview")}
          </p>
          <p className="text-3xl font-bicubik text-black text-center dark:text-white">
            {companyInfo?.total_rating?.toFixed(1) || 0}
          </p>
          <RatingStars rating={companyInfo?.total_rating} variable={false} />
          <span className="text-gray text-xs">
            {companyInfo?.rates_count} {t("reviews")}
          </span>
        </div>
        <div className="flex flex-col gap-1 mt-4">
          {rating?.[companyInfo?.entity_type?.toLowerCase()?.replaceAll("_", "-")]?.map((item) => (
            <Process
              key={item?.key}
              label={item?.label}
              degree={Math.ceil(companyInfo?.[item?.key] / 0.05)}
            />
          ))}

          {PERMISSION_CHECK(["carrier", "broker"], entity_type, "some") &&
            !companyInfo?.my_company &&
            companyInfo?.id && (
              <p
                onClick={handleOpenModal}
                className="text-center text-blue cursor-pointer mt-2 font-[600]"
              >
                {t("write-a-review")}
              </p>
            )}
        </div>
      </div>
    </>
  );
}

export default RaitingOverview;
