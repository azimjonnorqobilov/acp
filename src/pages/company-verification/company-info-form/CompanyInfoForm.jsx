import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { changeVerifyCompanyInfo, deleteVerifyCompanyInfoField } from "store/slices/userSlice";
import MUIMenu from "components/mui-menu/MUIMenu";
import Input from "components/input/Input";

function CompanyInfoForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    user: {
      verificationCompany: { companyInfo },
    },
  } = useSelector((store) => store);
  const [authorityType, setAuthorityType] = useState("mc");

  const handleChangeInfo = (name, value) => dispatch(changeVerifyCompanyInfo({ name, value }));

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <p className="font-bicubik text-center">{t("company-info")}</p>
      <div className="w-full flex-1 overflow-y-auto table-scrollbar grid grid-cols-2 px-2 lg:grid-cols-1 gap-4  lg:pb-4">
        <Input
          id="select-authority-input"
          type="number"
          label={`${t("select-authority")} *`}
          value={companyInfo?.[authorityType] || ""}
          onChange={(e) => handleChangeInfo(authorityType?.toLocaleLowerCase(), e.target.value)}
          inputMode="numeric"
          placeholder={t("number")}
          selectValue={authorityType || ""}
          selectOptions={[
            { id: 1, label: "MC", value: "mc" },
            { id: 2, label: "USDOT", value: "usdot" },
          ]}
          onChangeSelect={(e) => {
            setAuthorityType(e.target.value);
            dispatch(deleteVerifyCompanyInfoField(e.target.value === "mc" ? "usdot" : "mc"));
          }}
        />
        <Input
          id="company-name"
          label={`${t("company-name")} *`}
          value={companyInfo?.name}
          onChange={(e) => handleChangeInfo("name", e.target.value)}
          placeholder={t("company-name")}
          clearable
        />
        <Input
          id="company-phone"
          mask="(999) 999-9999"
          label={`${t("company-phone")} *`}
          value={companyInfo?.phone}
          onChange={(e) => handleChangeInfo("phone", e.target.value?.replaceAll("_", ""))}
          clearable
          placeholder={t("company-phone")}
        />
        <Input
          id="company-email"
          type="email"
          label={`${t("company-email")} *`}
          value={companyInfo?.email}
          onChange={(e) => handleChangeInfo("email", e.target.value)}
          clearable
          inputMode="email"
          placeholder={t("company-email")}
          classNameErrorMessage="bottom-[-8px] lg:bottom-[-14px]"
        />
        <Input
          id="address-1"
          label={`${t("company-address")} 1 *`}
          value={companyInfo?.address1}
          onChange={(e) => handleChangeInfo("address1", e.target.value)}
          clearable
          placeholder={`${t("address")} 1`}
        />
        <Input
          id="address-2"
          label={`${t("company-address")} 2 *`}
          value={companyInfo?.address2}
          onChange={(e) => handleChangeInfo("address2", e.target.value)}
          clearable
          placeholder={`${t("address")} 2`}
        />
        <Input
          id="city"
          label={`${t("city")} *`}
          value={companyInfo?.city}
          onChange={(e) => handleChangeInfo("city", e.target.value)}
          clearable
          placeholder={t("city")}
        />
        <Input
          id="state"
          label={`${t("state")} *`}
          value={companyInfo?.state}
          onChange={(e) => handleChangeInfo("state", e.target.value)}
          clearable
          placeholder={t("state")}
        />
        <MUIMenu
          id="country"
          label={`${t("country")} *`}
          value={companyInfo?.country}
          onChange={(value) => handleChangeInfo("country", value)}
          options={[{ id: 1, label: "USA", value: "USA" }]}
          clearable
          placeholder={t("country")}
        />
        <Input
          id="zip-code"
          type="number"
          label={`${t("zip-code")} *`}
          value={companyInfo?.zip_code}
          onChange={(e) => handleChangeInfo("zip_code", e.target.value)}
          clearable
          placeholder={t("zip-code")}
        />
      </div>
    </div>
  );
}

export default CompanyInfoForm;
