import { Link } from "react-router-dom";
import { icons } from "assets/icons/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getMyCompanyInformation } from "store/slices/userSlice";
import MUIModal from "components/mui-modal/MUIModal";
import Help from "pages/user-profile/help/Help";

function CompanyInfo({ device }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    theme: {
      device: { deviceType },
    },
    user: {
      companyInformation: { companyInfo },
    },
  } = useSelector((store) => store);
  const [openModal, setOpenModal] = useState({ open: false, action: "", user: null });

  const handleOpenModal = (action, user) => setOpenModal({ open: true, action, user });
  const handleCloseModal = () => setOpenModal({ ...openModal, open: false });

  useEffect(() => {
    device === deviceType && dispatch(getMyCompanyInformation());
  }, [dispatch]);

  return (
    <>
      <MUIModal open={openModal?.open}>
        {openModal?.action === "help" && (
          <Help topic="company_information_change" onClose={handleCloseModal} />
        )}
      </MUIModal>
      <div className="flex flex-col gap-4 border-b border-gray_lighter pb-4 lg:max-h-full lg:overflow-y-auto lg:border-none lg:p-4 lg:rounded-2xl lg:bg-white dark:bg-green_4 dark:text-white dark:border-green_5">
        <div className="flex justify-between lg:hidden">
          <p className="font-bicubik">{t("company-information")}</p>
          <p className="flex gap-2 text-xs">
            <span>{t("change")}:</span>
            <span onClick={() => handleOpenModal("help")} className="text-blue cursor-pointer">
              {t("contact-us")}
            </span>
          </p>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="flex items-start gap-[7rem] text-xs lg:flex-col lg:gap-2">
            <div className="grid grid-cols-[6rem_minmax(0,_10rem)] lg:grid-cols-[8rem_minmax(0,_1fr)] gap-y-2">
              <span className="text-gray">{t("mc")}: </span>
              <span className="font-bold">{companyInfo?.mc || "-"}</span>
              <span className="text-gray">{t("usdot")}: </span>
              <span className="font-bold">{companyInfo?.usdot || "-"}</span>
              <span className="text-gray">{t("legal-name")}: </span>
              <span className="font-bold">{companyInfo?.name || "-"}</span>
              <span className="text-gray">{t("dba-name")}: </span>
              <span className="font-bold">{companyInfo?.dba_name || "-"}</span>
              <span className="text-gray">{t("phone")}: </span>
              <span className="font-bold">{companyInfo?.phone || "-"}</span>
              <span className="text-gray">{t("email")}: </span>
              <span className="font-bold">{companyInfo?.email || "-"}</span>
            </div>
            <div className="grid grid-cols-[8rem_minmax(0,_1fr)] gap-y-2">
              <span className="text-gray">{t("physical-address")}: </span>
              <span className="font-bold">{companyInfo?.address1 || "-"}</span>
              <span className="text-gray">{t("mailing-address")}: </span>
              <span className="font-bold">{companyInfo?.address2 || "-"}</span>
              <span className="text-gray">{t("entity-type")}: </span>
              <span className="font-bold capitalize">{companyInfo?.entity_type || "-"}</span>
              <span className="text-gray">{t("credit-score")}: </span>
              <span className="font-bold">{companyInfo?.credit_score || "-"}</span>
              <span className="text-gray">{t("status")}: </span>
              <span className="font-bold">
                {companyInfo?.status ? (
                  <icons.checked className="fill-blue w-4" />
                ) : companyInfo?.id ? (
                  <Link
                    to="/company-verification"
                    target="_blank"
                    className="text-blue cursor-pointer"
                  >
                    {t("verify-your-account")}
                  </Link>
                ) : (
                  "-"
                )}
              </span>
            </div>
          </div>
          <p className="flex gap-2 text-xs lg:hidden">
            <span>{t("source")}:</span>
            <a
              rel="noreferrer"
              href="https://safer.fmcsa.dot.gov/CompanySnapshot.aspx"
              target="_blank"
              className="text-blue"
            >
              {t("fmcsa")}
            </a>
          </p>
        </div>

        <div className="hidden justify-between items-center lg:flex">
          <p className="flex gap-2 text-xs">
            <span>{t("change")}:</span>
            <span onClick={() => handleOpenModal("help")} className="cursor-pointer text-blue">
              {t("contact-us")}
            </span>
          </p>
          <p className="flex gap-2 text-xs">
            <span>{t("source")}:</span>
            <a
              rel="noreferrer"
              href="https://safer.fmcsa.dot.gov/CompanySnapshot.aspx"
              target="_blank"
              className="text-blue"
            >
              {t("fmcsa")}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default CompanyInfo;
