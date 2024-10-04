import { useState } from "react";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ACPUsersListUnderYourMC from "./acp-users-list-under-your-mc/ACPUsersListUnderYourMC";
import ButtonsGroup from "components/buttons-group/ButtonsGroup";
import CompanyInfo from "./company-info/CompanyInfo";

function CompanyInformation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState("information");

  document.title = t("company-information");

  return (
    <>
      <div className="w-full flex flex-col p-6 pb-2 rounded-2xl h-full bg-white dark:bg-green_4 dark:text-white lg:hidden">
        <CompanyInfo device="desktop" />

        <ACPUsersListUnderYourMC />
      </div>

      <div className="hidden w-full lg:flex flex-col gap-2 h-full">
        <div className="items-center hidden lg:flex">
          <button
            onClick={() => navigate(-1)}
            className="bg-white dark:bg-[#2C495A] w-10 p-2 min-h-[2.5rem] rounded-lg flex justify-center items-center"
          >
            <icons.arrowLeft className="fill-black dark:fill-white" />
          </button>
          <p className="w-[calc(100%-5rem)] text-center dark:text-white font-bicubik">
            {t("company-information")}
          </p>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto gap-2">
          <ButtonsGroup
            active={tab}
            buttons={[
              { id: 1, label: t("information"), value: "information" },
              { id: 2, label: t("list-of-users"), value: "users" },
            ]}
            onClick={(e) => setTab(e)}
            classNameGroup="w-full rounded-xl"
            classNameButton="py-2 px-1 rounded-lg text-xs"
          />
          <div className="flex-1 overflow-y-auto">
            {tab === "information" && <CompanyInfo device="mobile" />}
            {tab === "users" && <ACPUsersListUnderYourMC />}
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyInformation;
