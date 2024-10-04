import { Link } from "react-router-dom";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { prevStep, nextStep, registerNewUser } from "store/slices/registerSlice";
import SuccessfullyCompleted from "./successfully-completed/SuccessfullyCompleted";
import ChooseYourField from "./choose-your-field/ChooseYourField";
import PersonalInfo from "./personal-info/PersonalInfo";
import CompanyInfo from "./company-info/CompanyInfo";
import Loader from "components/loader/Loader";
import Authority from "./authority/Authority";
import Step from "components/step/Step";

function SignUp() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { step, newUserInfo, personalInfo, companyInfo, isLoading } = useSelector(
    (store) => store.register
  );

  document.title = t("sign-up");

  const handleBack = () => dispatch(prevStep());

  const handleNext = () => {
    step < 3 ? dispatch(nextStep()) : dispatch(registerNewUser(newUserInfo));
  };

  const renderSteps = (step) => {
    switch (step) {
      case 1:
        return <PersonalInfo />;

      case 2:
        return <Authority />;

      case 3:
        return <CompanyInfo />;

      case 4:
        return <SuccessfullyCompleted />;

      default:
        return <ChooseYourField />;
    }
  };

  const handleCheckNextButtonDisabled = () =>
    (step === 1 && personalInfo?.successed) ||
    (step === 2 && companyInfo?.successed) ||
    (step === 3 &&
      ((companyInfo?.authorityType &&
        companyInfo?.info?.entity_type &&
        newUserInfo?.company_info_accepted) ||
        (!companyInfo?.authorityType &&
          newUserInfo?.company_name &&
          newUserInfo?.company_info_accepted)))
      ? false
      : true;

  return (
    <div className="w-[33rem] md:!w-full h-[45rem] max-h-[90dvh] md:!h-full bg-white rounded-3xl flex flex-col justify-between relative overflow-y-auto md:border md:border-[#D1DAE6]">
      {isLoading && (
        <div className="absolute w-full h-full flex items-center justify-center  backdrop-blur-sm z-20">
          <Loader className="w-[5rem] h-[5rem]" />
        </div>
      )}
      <div
        className={`flex flex-col pt-8 px-8 md:pt-6 md:px-3 ${
          step ? "h-[calc(100%-64px)]" : "h-[calc(100%-68px)]"
        }`}
      >
        <div className="text-center flex flex-col items-center pb-10 md:pb-5">
          <p className="font-bicubik text-center uppercase text-3xl md:text-xl">{t("sign-up")}</p>
          <p className="text-xl md:text-base text-[#546172] py-3 md:py-2">
            {t("to-register-you-need-to-go-through-these-steps")}
          </p>

          <Step count={4} step={step} />
        </div>

        <div className="h-[calc(100%-160px)] md:h-[calc(100%-112px)]">{renderSteps(step)}</div>
      </div>

      {step > 0 && step < 4 && (
        <div className="flex justify-between items-center pb-8 px-8 md:py-3 md:px-4 md:shadow-[0_0_5px_1px_#00000010]">
          <button onClick={handleBack} className="flex items-center gap-2 text-sm">
            <div
              className={`w-8 h-8 rounded-full flex justify-center items-center ${
                step === 0 ? "bg-gray_light" : "bg-blue"
              }`}
            >
              <icons.arrow className={`w-[0.4rem]  ${step > 0 ? "fill-white" : "fill-black"}`} />
            </div>
            <span className="md:text-sm">{t("back")}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={handleCheckNextButtonDisabled()}
            className={`flex items-center gap-2 ${
              handleCheckNextButtonDisabled() ? "opacity-50" : ""
            }`}
          >
            <span className="md:text-sm">{step === 3 ? t("submit") : t("next")}</span>
            <div
              className={`w-8 h-8 rounded-full flex justify-center items-center ${
                step < 4 ? "bg-blue" : "bg-gray_light"
              }`}
            >
              <icons.arrow
                className={`w-[0.4rem] rotate-180  ${step < 4 ? "fill-white" : "fill-black"}`}
              />
            </div>
          </button>
        </div>
      )}
      {!step && (
        <div className="flex justify-center items-center gap-4 pb-8 px-8 md:py-3 md:px-4 md:shadow-[0_0_5px_1px_#00000010] md:flex-col md:gap-0">
          <span>{t("have-you-registered-already")}</span>
          <Link to="/sign-in" className="text-blue flex items-center gap-2 uppercase">
            <span>{t("login")}</span> <icons.login className="fill-blue" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default SignUp;
