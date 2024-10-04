import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AUTHORITY_TYPES } from "assets/constants/constants";
import { getCompany, changeAuthorityType, changeAuthorityNumber } from "store/slices/registerSlice";
// import Select from "components/select/Select";
import MUIMenu from "components/mui-menu/MUIMenu";
import Loader from "components/loader/Loader";
import Input from "components/input/Input";

function Authority() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    newUserInfo: { entity_type },
    companyInfo: { info, isLoading, authorityType, authorityNumber },
  } = useSelector((store) => store.register);

  const handleChangeAuthorityType = (type) => dispatch(changeAuthorityType(type));

  const handleChangeAuthorityNumber = (e) => dispatch(changeAuthorityNumber(e.target.value));

  const handleCheck = () =>
    dispatch(getCompany({ authorityType, number: authorityNumber, entity_type }));

  return (
    <div className="flex flex-col h-full">
      <p className="text-center font-bicubik text-xl xl:text-lg md:!text-base uppercase">
        {t("authority-type")}
      </p>
      <div className="flex flex-col gap-1 mt-1 pt-1 pb-2 px-1 text-sm h-[calc(100%-24px)] overflow-y-auto">
        {authorityType ? (
          <Input
            id="select-authority-input"
            type="number"
            label={t("select-authority")}
            value={authorityNumber || ""}
            onChange={handleChangeAuthorityNumber}
            inputMode="numeric"
            placeholder={authorityType === "MC_MX" ? "MC" : authorityType}
            selectValue={authorityType}
            selectOptions={AUTHORITY_TYPES?.[entity_type] || AUTHORITY_TYPES?.shipper}
            onChangeSelect={(e) => handleChangeAuthorityType(e.target.value)}
            actionButtonLabel={t("check")}
            actionButtonClick={handleCheck}
            actionButtonDisabled={!authorityNumber}
          />
        ) : (
          <MUIMenu
            value={authorityType || ""}
            onChange={(e) => handleChangeAuthorityType(e)}
            label={t("select-authority")}
            options={AUTHORITY_TYPES?.[entity_type] || AUTHORITY_TYPES?.shipper}
            themeMode="light"
          />
        )}
        {info?.detail && !isLoading && (
          <p className="flex items-center gap-2 text-xs">
            <icons.errorInfo className="fill-red w-4" />
            <span className="text-red capitalize">{info?.detail}</span>
          </p>
        )}

        {isLoading ? (
          <div className="flex flex-col">
            <Loader className="w-[3rem] h-[3rem]" />
            <p className="flex flex-col items-center text-center">
              <span className="font-bicubik">{t("data-is-loading")},</span>
              <span className="font-bicubik">{t("please-wait")}</span>
            </p>
          </div>
        ) : (
          info?.usdot_number && (
            <div className="flex flex-col gap-5">
              <div className="text-lg border border-gray_lighter p-4 rounded-xl flex flex-col gap-4 mt-4">
                <div className="text-xs flex flex-col gap-1">
                  <p className="flex items-center gap-2 ">
                    <icons.company className="fill-blue w-3" />{" "}
                    <span className="text-gray">{t("company-name")}</span>
                  </p>
                  <p>{info?.legal_name}</p>
                </div>

                <div className="text-xs flex flex-col gap-1">
                  <p className="flex items-center gap-2 ">
                    <icons.location className="fill-blue w-3" />{" "}
                    <span className="text-gray">{t("company-addres")}</span>
                  </p>
                  <p>{info?.physical_address}</p>
                </div>

                <div className="text-xs flex flex-col gap-1">
                  <p className="flex items-center gap-2 ">
                    <icons.phone className="fill-blue w-3" />{" "}
                    <span className="text-gray">{t("company-phone")}</span>
                  </p>
                  <p>{info?.phone}</p>
                </div>
              </div>

              {/* <div className="flex items-center justify-center bg-gray_light rounded-lg gap-2 text-center py-2">
                <input type="checkbox" />
                <p>
                  <span>I Accep the </span>
                  <span className="text-blue cursor-pointer">Terms of Service</span>
                </p>
              </div> */}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Authority;
