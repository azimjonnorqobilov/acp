import { useState } from "react";
import { useMutation } from "react-query";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { verifyCompany } from "store/slices/userSlice";
import UploadCompanyDocuments from "./upload-company-documents/UploadCompanyDocuments";
import SuccessfullySubmitted from "./successfully-submitted/SuccessfullySubmitted";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import CompanyInfoForm from "./company-info-form/CompanyInfoForm";
import Agreement from "./agreement/Agreement";
import Step from "components/step/Step";

function CompanyVerification({ onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    user: {
      verificationCompany: { companyInfo },
    },
  } = useSelector((store) => store);
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState({});

  document.title = t("setup");

  const handleUploadFile = (name, value) => setFiles({ ...files, [name]: value });

  const handleBack = () => setStep(step > 0 ? step - 1 : 0);
  const handleNext = () => setStep(step < 2 ? step + 1 : 3);

  const { mutate: handleSubmit, isLoading } = useMutation(
    "verify-company",
    () => dispatch(verifyCompany({ info: companyInfo, files })),
    {
      onSuccess: () => handleNext(),
    }
  );

  const renderSteps = (step) => {
    switch (step) {
      case 1:
        return <Agreement />;

      case 2:
        return <UploadCompanyDocuments onUploadFile={handleUploadFile} />;

      case 3:
        return <SuccessfullySubmitted onClose={onClose} />;

      default:
        return <CompanyInfoForm />;
    }
  };

  const disabledNextButtton = () =>
    (step === 0 &&
      (companyInfo?.usdot || companyInfo?.mc) &&
      ["name", "phone", "email", "address1", "city", "state", "country", "zip_code"]?.every(
        (e) => companyInfo?.[e]
      )) ||
    (step === 1 && companyInfo?.agrement) ||
    (step === 2 && ["authority", "w9", "insurance"].every((e) => files?.[e]));

  return (
    <div className="w-[100vw] h-[100dvh] flex items-center justify-center bg-white bg-sign bg-cover bg-center bg-no-repeat dark:bg-green_7">
      <div className="bg-white dark:bg-green_7 border lg:border-none border-gray_lighter dark:border-green_8 w-[35rem] lg:w-full h-[40rem] lg:h-full overflow-y-auto rounded-xl lg:rounded-none flex flex-col items-center justify-between relative dark:text-white">
        <div className="w-full h-[calc(100%-80px)] lg:h-[calc(100%-64px)] flex flex-col items-center">
          <p className="font-bicubik text-center text-2xl uppercase pb-2 pt-6 lg:pt-4">
            {t("setup")}
          </p>
          <Step count={3} step={step} />

          <div className="w-full overflow-hidden flex-1 pt-6 px-4 lg:px-2">{renderSteps(step)}</div>
        </div>

        {step < 3 && (
          <div className="w-full flex justify-between items-center p-6 lg:p-4 lg:shadow-[0_7px_20px_1px_rgba(0,0,0,0.7)]">
            <button
              onClick={() => step > 0 && handleBack()}
              className={`flex items-center gap-2 text-sm ${
                step === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex justify-center items-center bg-blue`}>
                <icons.arrow className={`w-[0.4rem] fill-white`} />
              </div>
              <span>{t("back")}</span>
            </button>

            <button
              disabled={disabledNextButtton() ? false : true}
              onClick={() => (step < 2 ? handleNext() : handleSubmit())}
              className={`flex items-center gap-2 text-sm ${
                disabledNextButtton() ? "" : "opacity-50"
              }`}
            >
              <span>{step === 2 ? t("submit") : t("next")}</span>
              <div
                className={`w-8 h-8 rounded-full flex justify-center items-center ${
                  step < 3 ? "bg-blue" : "bg-gray_light dark:bg-[#365364]"
                }`}
              >
                <icons.arrow
                  className={`w-[0.4rem] rotate-180  ${
                    step < 3 ? "fill-white" : "fill-black dark:fill-white"
                  }`}
                />
              </div>
            </button>
          </div>
        )}

        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center rounded-xl">
            <BounceDotsLoader />
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyVerification;
