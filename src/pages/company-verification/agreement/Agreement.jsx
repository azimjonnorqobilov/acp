import Checkbox from "components/checkbox/Checkbox";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { changeVerifyCompanyInfo } from "store/slices/userSlice";

function Agreement() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    user: {
      verificationCompany: { companyInfo },
    },
  } = useSelector((store) => store);

  return (
    <div className="w-full h-full flex flex-col items-center gap-4 pb-4 px-2">
      <p className="font-bicubik text-center">{t("aggrement")}</p>
      <div className="flex-1 bg-gray_light p-4 lg:p-2 text-sm rounded-xl overflow-hidden dark:bg-green_9">
        <div className="flex flex-col gap-2 p-2 max-h-full overflow-y-auto table-scrollbar">
          <span>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book. It has
            survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </span>
          <span>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book. It has
            survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </span>
        </div>
      </div>

      <Checkbox
        label={t("i-agree")}
        checked={companyInfo?.agrement}
        onChange={() =>
          dispatch(changeVerifyCompanyInfo({ name: "agrement", value: !companyInfo?.agrement }))
        }
      />
    </div>
  );
}

export default Agreement;
