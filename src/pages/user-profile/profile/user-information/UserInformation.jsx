import { useSelector } from "react-redux";
import { icons } from "assets/icons/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MUIModal from "components/mui-modal/MUIModal";
import EditContact from "./edit-contact/EditContact";
import Help from "pages/user-profile/help/Help";

function UserInformation() {
  const { t } = useTranslation();
  const {
    auth: { userInfo },
  } = useSelector((store) => store);
  const [openModal, setOpenModal] = useState({ open: false, action: null });

  const handleOpenModal = (action) => setOpenModal({ open: true, action });
  const handleCloseModal = () => setOpenModal({ ...openModal, open: false });

  useEffect(() => {
    handleCloseModal();
  }, [userInfo]);

  return (
    <>
      <MUIModal open={openModal?.open}>
        {openModal?.action === "edit-contact" && (
          <EditContact
            user={{ phone: userInfo?.phone, email: userInfo?.email, telegram: userInfo?.telegram }}
            onClose={handleCloseModal}
          />
        )}
        {openModal?.action === "help" && <Help topic="contact_us" onClose={handleCloseModal} />}
      </MUIModal>
      <div className="w-full flex flex-col gap-2 p-6 lg:p-4 rounded-2xl bg-white dark:bg-green_4 dark:text-white">
        <div className="flex items-center justify-between">
          <p className="uppercase font-bicubik">{t("user-information")}</p>
          <p className="text-xs lg:hidden">
            <span>{t("change")}: </span>{" "}
            <span onClick={() => handleOpenModal("help")} className="text-blue cursor-pointer">
              {t("contact-us")}
            </span>
          </p>
        </div>
        <div className="flex justify-between gap-2 lg:flex-col lg:items-start">
          <div className="flex items-start gap-[6rem] text-xs lg:flex-col lg:gap-y-2">
            <div className="grid grid-cols-[5rem_minmax(0,_1fr)] gap-y-2">
              <span className="text-gray">{t("first-name")}: </span>
              <span className="font-bold">{userInfo?.first_name || "-"}</span>
              <span className="text-gray">{t("last-name")}: </span>
              <span className="font-bold">{userInfo?.last_name || "-"}</span>
              <span className="text-gray">{t("email")}: </span>
              <span className="font-bold">{userInfo?.email || "-"}</span>
            </div>
            <div className="grid grid-cols-[5rem_minmax(0,_1fr)] gap-y-2">
              <span className="text-gray">{t("phone")}: </span>
              <span className="font-bold">{userInfo?.phone || "-"}</span>

              <span className="text-gray">{t("telegram")}: </span>
              <span className="font-bold">{userInfo?.telegram || "-"}</span>
            </div>
          </div>
          <div className="flex items-end lg:w-full lg:justify-between lg:items-center">
            <p className="text-xs hidden lg:block">
              <span>{t("change")}: </span>{" "}
              <span onClick={() => handleOpenModal("help")} className="text-blue cursor-pointer">
                {t("contact-us")}
              </span>
            </p>
            <button
              onClick={() => handleOpenModal("edit-contact")}
              className="bg-blue px-4 py-2 rounded-lg text-white text-xs flex items-center gap-2"
            >
              <icons.pencil className="fill-white w-3" />
              <span className="uppercase">{t("edit-contact")}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserInformation;
