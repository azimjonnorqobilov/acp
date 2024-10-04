import { useState } from "react";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, confirmationPassword } from "store/slices/authSlice";
import DotsLoader from "components/loader/DotsLoader";
import Input from "components/input/Input";

function ResetPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    auth: {
      resetPassword: { user, isLoading, confirmationStatus, isLoadingConfirmation },
    },
  } = useSelector((store) => store);

  const [email, setEmail] = useState("");
  const [verification, setVerification] = useState({});
  const [errors, setErrors] = useState({ verification_code: "", password: "", password1: "" });

  document.title = t("reset-password");

  const handleSendEmail = () => dispatch(resetPassword(email));

  const handleChangeVerification = (name, value) => {
    setVerification({ ...verification, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = () => {
    !verification?.verification_code
      ? setErrors({ ...errors, verification_code: t("enter-the-verification-code") })
      : !verification?.password
      ? setErrors({ ...errors, password: t("enter-the-password") })
      : !verification?.password1
      ? setErrors({ ...errors, password1: t("enter-the-confirmation-password") })
      : dispatch(confirmationPassword({ ...verification, user_id: user?.user_id }));
  };

  return confirmationStatus === 201 ? (
    <div className="w-[25rem] h-[30rem] bg-white rounded-3xl p-14 flex flex-col items-center justify-center text-center gap-4 md:w-full md:px-4 md:py-6 md:border md:border-[#D1DAE6]">
      <div className="border border-blue w-[8rem] xl:w-[6rem] h-[8rem] xl:h-[6rem] flex justify-center items-center rounded-full">
        <icons.doubleCheck className="fill-blue w-[5rem] xl:w-[3rem]" />
      </div>
      <p className="text-2xl uppercase font-bicubik">{t("your-password-has-been-reset")}</p>
      <button
        onClick={() => navigate("/sign-in")}
        className="bg-blue flex items-center justify-center gap-2 text-white px-8 py-2 rounded-lg w-full uppercase"
      >
        <icons.login /> <span className="text-lg">{t("login")}</span>
      </button>
    </div>
  ) : (
    <div className="w-[25rem] bg-white rounded-3xl p-8 flex flex-col gap-4 md:w-full md:px-4 md:py-6 md:border md:border-[#D1DAE6]">
      <p className="font-bicubik text-center text-2xl">{t("reset-password")}</p>
      <div className="flex flex-col gap-1 text-sm">
        <Input
          id="email"
          label={t("email")}
          loader={isLoading}
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("email")}
          actionButtonLabel={!isLoading && user?.user_id ? t("resent") : t("next")}
          actionButtonClick={handleSendEmail}
          classNameInput={`text-base ${
            isLoading ? "pr-[3rem]" : !isLoading && user?.user_id ? "pr-[5.7rem]" : "pr-[4.5rem]"
          }`}
        />
        {!isLoading && user?.user_id && (
          <p className="text-green text-xs">{t("the-verification-code-has-been-sent")}</p>
        )}
      </div>
      {!isLoading && user?.user_id && (
        <>
          <div className="flex flex-col gap-4 border border-gray_lighter p-4 rounded-lg">
            <Input
              id="verification-code"
              label={t("verification-code")}
              value={verification?.verification_code || ""}
              onChange={(e) => handleChangeVerification("verification_code", e.target.value)}
              themeMode="light"
              placeholder={t("verification-code")}
              errorMessage={errors?.verification_code || ""}
              classNameInput="text-base"
            />
            <Input
              id="password"
              type="password"
              label={t("new-password")}
              value={verification?.password || ""}
              onChange={(e) => handleChangeVerification("password", e.target.value)}
              themeMode="light"
              placeholder="* * * * * * * * * * *"
              errorMessage={errors?.password || ""}
              classNameInput="text-base"
            />
            <Input
              id="confirm-password"
              type="password"
              label={t("confirm-password")}
              value={verification?.password1 || ""}
              onChange={(e) => handleChangeVerification("password1", e.target.value)}
              themeMode="light"
              placeholder="* * * * * * * * * * *"
              errorMessage={errors?.password1 || ""}
              classNameInput="text-base"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue text-white px-8 py-2 rounded-lg uppercase"
          >
            {isLoadingConfirmation ? <DotsLoader /> : t("submit")}
          </button>
        </>
      )}
    </div>
  );
}

export default ResetPassword;
