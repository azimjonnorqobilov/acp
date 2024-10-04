import { useDispatch } from "react-redux";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { nextStep } from "store/slices/registerSlice";

const FiledCard = ({ onClick, icon, title, description }) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between rounded-2xl p-5 md:px-5 md:py-4 shadow-[0_6px_12px_0_rgba(237,243,250,1)] cursor-pointer"
  >
    <div className="w-[calc(100%-0.5rem)] flex items-center gap-2">
      <div className="w-[4rem] h-[4rem] md:!h-[3.75rem] bg-blue_10 flex items-center justify-center rounded-full">
        {icon}
      </div>
      <div className="w-[calc(100%-5rem)] md:w-[calc(100%-3.75rem)] flex flex-col items gap-1">
        <span className="text-sm font-[500] font-bicubik uppercase">{title}</span>
        <span className="text-gray text-xs">{description}</span>
      </div>
    </div>
    <div>
      <icons.arrow className="fill-gray w-2 rotate-180" />
    </div>
  </div>
);

function ChooseYourField() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleChooseField = (entity_type) => dispatch(nextStep({ entity_type }));

  return (
    <div className="flex flex-col h-full">
      <p className="text-xl md:!text-base font-bicubik text-center text-[#000000]">
        {t("choose-your-field")}:
      </p>
      <div className="h-[calc(100%-24px)] flex flex-col gap-4 overflow-y-auto py-2 px-1">
        <FiledCard
          onClick={() => handleChooseField("carrier")}
          icon={<icons.carrier className="fill-blue_dark w-9 md:!w-8" />}
          title={t("field-cards.carrier.title")}
          description={t("field-cards.carrier.description")}
        />
        <FiledCard
          onClick={() => handleChooseField("broker")}
          icon={<icons.broker className="fill-none stroke-blue_dark w-9 md:w-8" />}
          title={t("field-cards.broker.title")}
          description={t("field-cards.broker.description")}
        />
        <FiledCard
          onClick={() => handleChooseField("shipper")}
          icon={<icons.shipper className="fill-none stroke-blue_dark w-9 md:w-8" />}
          title={t("field-cards.shipper.title")}
          description={t("field-cards.shipper.description")}
        />
      </div>
    </div>
  );
}

export default ChooseYourField;
