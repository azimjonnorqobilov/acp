import { useEffect, useState } from "react";
import i18n from "internationalization/i18n";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme, changeLanguage } from "store/slices/themeSlice";
import ButtonsGroup from "components/buttons-group/ButtonsGroup";
import EditPassword from "./edit-password/EditPassword";
import MUIModal from "components/mui-modal/MUIModal";

function Settings() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    auth: { editPassword },
    theme: { language, themeType },
  } = useSelector((store) => store);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleChangeTheme = (name, value) => dispatch(changeTheme({ name, value }));

  const handleChangeLanguage = (lang) => {
    dispatch(changeLanguage(lang));
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    editPassword?.status === 201 && handleCloseModal();
  }, [editPassword]);

  return (
    <>
      <MUIModal open={openModal}>
        <EditPassword onClose={handleCloseModal} />
      </MUIModal>
      <div className="w-full flex flex-col items-start gap-2 bg-white p-6 rounded-2xl dark:bg-green_4 dark:text-white">
        <p className="uppercase font-bicubik">{t("settings")}</p>

        <div className="grid grid-cols-[10rem_1fr] lg:grid-cols-[7rem_1fr] items-center gap-2 relative text-xs">
          <span>{t("change-language")}: </span>
          <ButtonsGroup
            active={language}
            buttons={[
              { label: "Eng", value: "eng" },
              { label: "Esp", value: "esp" },
            ]}
            onClick={(value) => handleChangeLanguage(value)}
            classNameButton="min-w-[5rem] lg:min-w-[5.5rem] py-1 px-2 rounded text-xs"
          />
          <span className="lg:hidden">{t("change-theme")}:</span>
          <ButtonsGroup
            active={themeType}
            buttons={[
              { label: "Acp", value: "acp" },
              { label: "Classic", value: "classic" },
            ]}
            className="lg:hidden"
            onClick={(value) => handleChangeTheme("themeType", value)}
            classNameButton="min-w-[5rem] lg:min-w-[5.5rem] py-1 px-2 rounded text-xs"
          />
          <span>{t("change-password")}:</span>
          <button
            onClick={handleOpenModal}
            className="px-4 py-[0.3rem] bg-blue rounded-lg text-xs text-white uppercase"
          >
            {t("edit")}
          </button>
        </div>
      </div>
    </>
  );
}

export default Settings;
