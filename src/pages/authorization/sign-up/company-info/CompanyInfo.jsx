import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AUTHORITY_TYPES } from "assets/constants/constants";
import { changeNewUserInfo } from "store/slices/registerSlice";
import TermsOfService from "./terms-of-service/TermsOfService";
import MUIModal from "components/mui-modal/MUIModal";
import Checkbox from "components/checkbox/Checkbox";
import Select from "components/select/Select";
import Input from "components/input/Input";

function CompanyInfo() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    newUserInfo,
    companyInfo: { info, authorityType, authorityNumber },
  } = useSelector((store) => store.register);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleChangeCompanyInfo = (name, value) => dispatch(changeNewUserInfo({ [name]: value }));

  return (
    <>
      <MUIModal open={openModal}>
        <TermsOfService onClose={handleCloseModal} />
      </MUIModal>
      <div className="flex flex-col max-h-full">
        <p className="text-center font-bicubik text-xl md:text-base uppercase">
          {t("company-info")}
        </p>
        <div className="flex flex-col gap-4 mt-1 pt-1 pb-2 px-1 h-[calc(100%-24px)] md:grid-cols-1 md:gap-2 md:overflow-y-auto">
          <div className="flex flex-col gap-2">
            {authorityType ? (
              <Input
                id="select-authority-input"
                type="number"
                label={t("select-authority")}
                value={authorityNumber || ""}
                disabled
                inputMode="numeric"
                placeholder={authorityType}
                selectValue={authorityType}
                selectOptions={
                  AUTHORITY_TYPES?.[newUserInfo?.entity_type] || AUTHORITY_TYPES?.shipper
                }
              />
            ) : (
              <Select
                value={authorityType}
                label={t("select-authority")}
                options={AUTHORITY_TYPES?.[newUserInfo?.entity_type] || AUTHORITY_TYPES?.shipper}
                disabled
                themeMode="light"
              />
            )}
            <Input
              value={info?.legal_name || ""}
              label={t("company-name")}
              onChange={(e) => handleChangeCompanyInfo("company_name", e.target.value)}
              disabled={authorityType && info?.legal_name ? true : false}
              themeMode="light"
              placeholder={t("company-name")}
            />
            <Input
              value={info?.physical_address || ""}
              label={`${t("company-addres")} (${t("optional")})`}
              onChange={(e) => handleChangeCompanyInfo("company_address", e.target.value)}
              disabled={authorityType && info?.legal_name ? true : false}
              themeMode="light"
              placeholder={`${t("company-addres")} ${
                newUserInfo?.entity_type === "shipper" ? "" : `(${t("optional")})`
              } `}
            />
            <Input
              value={info?.phone}
              label={`${t("company-phone")} (${t("optional")})`}
              onChange={(e) => handleChangeCompanyInfo("company_phone", e.target.value)}
              disabled={authorityType && info?.legal_name ? true : false}
              themeMode="light"
              placeholder={`${t("company-phone")} (${t("optional")})`}
            />
          </div>

          <div className="flex items-center justify-center bg-gray_light rounded-lg gap-2 text-center py-2 text-sm">
            <Checkbox
              checked={newUserInfo?.company_info_accepted ? true : false}
              label={t("i-accep-the")}
              onChange={(value) => handleChangeCompanyInfo("company_info_accepted", value)}
            />

            <span onClick={handleOpenModal} className="text-blue cursor-pointer">
              {t("terms-of-service")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyInfo;
