import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { checkingEmail, changePersonalInfo } from "store/slices/registerSlice";
import Input from "components/input/Input";

function PersonalInfo() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    personalInfo: { info, checkedEmail },
  } = useSelector((store) => store.register);
  const [confirmPassword, setConfirmPassword] = useState(false);

  const handleChangePersonalInfo = (name, value) => dispatch(changePersonalInfo({ name, value }));

  // const handleCheckingPhone = (phone) => dispatch(checkingPhone(phone?.replaceAll(" ", "")));

  const handleCheckingEmail = (email) => dispatch(checkingEmail(email));

  return (
    <div className="flex flex-col max-h-full">
      <p className="text-center font-bicubik text-xl md:text-base uppercase">
        {t("personal-info")}
      </p>
      <div className="grid grid-cols-2 gap-4 mt-1 pt-1 pb-2 px-1 h-[calc(100%-24px)] md:grid-cols-1 md:gap-2 md:overflow-y-auto">
        <Input
          id="first-name"
          label={t("first-name")}
          value={info?.first_name || ""}
          onChange={(e) => handleChangePersonalInfo("first_name", e.target.value)}
          clearable
          themeMode="light"
          placeholder={t("first-name")}
        />
        <Input
          id="last-name"
          label={t("last-name")}
          value={info?.last_name || ""}
          onChange={(e) => handleChangePersonalInfo("last_name", e.target.value)}
          clearable
          themeMode="light"
          placeholder={t("last-name")}
        />
        <Input
          id="email"
          type="email"
          label={t("email")}
          value={info?.email || ""}
          onBlur={(e) => handleCheckingEmail(e.target.value)}
          onChange={(e) => handleChangePersonalInfo("email", e.target.value)}
          clearable
          inputMode="email"
          themeMode="light"
          placeholder={t("email")}
          errorMessage={(checkedEmail?.status !== 200 && checkedEmail?.message) || ""}
        />
        <Input
          id="cell-phone"
          mask="(999) 999-9999"
          label={`${t("cell-phone")} (${t("optional")})`}
          value={info?.phone || ""}
          // onBlur={(e) => handleCheckingPhone(e.target.value)}
          onChange={(e) =>
            handleChangePersonalInfo(
              "phone",
              e.target.value?.replaceAll(" ", "")?.replaceAll("_", "")
            )
          }
          clearable
          inputMode="tel"
          themeMode="light"
          placeholder={`${t("cell-phone")} (${t("optional")})`}
          // errorMessage={(checkedPhone?.status !== 200 && checkedPhone?.message) || ""}
        />
        <Input
          id="password"
          type="password"
          label={t("password")}
          value={info?.password || ""}
          onFocus={() => setConfirmPassword(false)}
          onBlur={(e) =>
            info?.confirm_password &&
            setConfirmPassword(
              e.target.value && info?.confirm_password !== e.target.value ? true : false
            )
          }
          onChange={(e) => handleChangePersonalInfo("password", e.target.value)}
          themeMode="light"
          placeholder="* * * * * * * * *"
          errorMessage={confirmPassword ? " " : ""}
        />
        <Input
          id="confirm-password"
          type="password"
          label={t("confirm-password")}
          value={info?.confirm_password || ""}
          onBlur={(e) =>
            info?.password &&
            setConfirmPassword(e.target.value && info?.password !== e.target.value ? true : false)
          }
          onChange={(e) => handleChangePersonalInfo("confirm_password", e.target.value)}
          themeMode="light"
          placeholder="* * * * * * * * *"
          errorMessage={confirmPassword ? "Incorrect Password" : ""}
        />
      </div>
    </div>
  );
}

export default PersonalInfo;
