import { useSelector } from "react-redux";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CompanyInformation from "./company-information/CompanyInformation";
import UserInformation from "./user-information/UserInformation";
import Settings from "./settings/Settings";

function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    auth: { userInfo },
  } = useSelector((store) => store);

  document.title = t("profile");

  return (
    <div className="w-full flex flex-col gap-2 h-full">
      <div className="items-center hidden lg:flex">
        <button
          onClick={() => navigate(-1)}
          className="bg-white dark:bg-[#2C495A] w-10 p-2 min-h-[2.5rem] rounded-lg flex justify-center items-center"
        >
          <icons.arrowLeft className="fill-black dark:fill-white" />
        </button>
        <p className="w-[calc(100%-5rem)] text-center dark:text-white font-bicubik">
          {t("profile")}
        </p>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto gap-4">
        <UserInformation />
        {(userInfo?.entity_type === "carrier-dispatcher" ||
          userInfo?.entity_type === "shipper") && <CompanyInformation />}
        <Settings />
      </div>
    </div>
  );
}

export default Profile;
