import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { PERMISSION_CHECK } from "assets/constants/constants";
import MUIModal from "components/mui-modal/MUIModal";
import Help from "pages/user-profile/help/Help";

function CompanyInformation({ company }) {
  const { t } = useTranslation();
  const {
    auth: { userInfo },
  } = useSelector((store) => store);
  const [openModal, setOpenModal] = useState({ open: false, action: "", user: null });

  const handleOpenModal = (action, user) => setOpenModal({ open: true, action, user });
  const handleCloseModal = () => setOpenModal({ ...openModal, open: false });

  return (
    <>
      <MUIModal open={openModal?.open}>
        {openModal?.action === "help" && (
          <Help topic="company_information_change" onClose={handleCloseModal} />
        )}
      </MUIModal>
      <div className="w-full flex flex-col gap-2 bg-white p-6 rounded-2xl dark:bg-green_4 dark:text-white lg:hidden">
        <div className="flex items-center justify-between">
          <p className="uppercase font-bicubik">{t("company-information")}</p>
          <p className="text-xs">
            <span>{t("change")}: </span>{" "}
            <span onClick={() => handleOpenModal("help")} className="text-blue cursor-pointer">
              {t("contact-us")}
            </span>
          </p>
        </div>
        <div className="flex items-end justify-between gap-2">
          <div className="flex items-start gap-[4rem] text-xs">
            <div className="grid grid-cols-[8rem_minmax(0,_1fr)] gap-y-2">
              <span className="text-gray">{t("company-name")}: </span>
              <span className="font-bold">{userInfo?.company_name || "-"}</span>
              <span className="text-gray">{t("company-address")}: </span>
              <span className="font-bold">{userInfo?.company_address || "-"}</span>
            </div>
            <div className="grid grid-cols-[4rem_minmax(0,_1fr)] gap-y-2">
              <span className="text-gray">{t("phone")}: </span>
              <span className="font-bold">{userInfo?.company_phone || "-"}</span>
              <span className="text-gray">{t("email")}: </span>
              <span className="font-bold">{userInfo?.company_email || "-"}</span>
            </div>
          </div>
          {PERMISSION_CHECK(["carrier-dispatcher"], userInfo?.entity_type, "some") && (
            <Link
              to="/company-verification"
              target="_blank"
              className="bg-blue px-4 py-2 rounded-lg text-white text-xs flex items-center gap-2"
            >
              <icons.checked className="fill-white w-4" />
              <span className="uppercase">{t("upgrade-with-mc")}</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default CompanyInformation;
