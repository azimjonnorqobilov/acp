import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { Fragment, useEffect, useState } from "react";
import { getEmployees } from "store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import VerificationOfUser from "./create-user/verification-of-user/VerificationOfUser";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import MUIModal from "components/mui-modal/MUIModal";
import CreateUser from "./create-user/CreateUser";
import Help from "pages/user-profile/help/Help";

function ACPUsersListUnderYourMC() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    auth: { userInfo },
    user: {
      companyInformation: { employees, isLoading, companyInfo, createdEmployes },
    },
  } = useSelector((store) => store);
  const [openModal, setOpenModal] = useState({ open: false, action: "", user: null });

  const handleOpenModal = (action, user) => setOpenModal({ open: true, action, user });
  const handleCloseModal = () => setOpenModal({ ...openModal, open: false });

  useEffect(() => {
    dispatch(getEmployees());
  }, [createdEmployes, dispatch]);

  return (
    <>
      <MUIModal open={openModal?.open}>
        {openModal?.action === "create" && <CreateUser onClose={handleCloseModal} />}
        {openModal?.action === "verification" && (
          <div className="bg-white dark:bg-green_2 px-8 py-4 rounded-xl relative">
            <VerificationOfUser user={openModal?.user} onClose={handleCloseModal} />
          </div>
        )}
        {openModal?.action === "help" && (
          <Help topic="suspicious_users_found_under_your_mc" onClose={handleCloseModal} />
        )}
      </MUIModal>
      <div className="h-[calc(100%-193px)] pt-2 flex flex-col lg:h-full lg:p-0">
        <div className="flex items-center justify-between">
          <p className="font-bicubik uppercase py-1 lg:hidden">
            {t("acp-users-list-under-your-mc")}
          </p>
          {userInfo?.status && companyInfo?.status && (
            <button
              onClick={() => handleOpenModal("create")}
              className="bg-blue px-4 py-2 rounded-lg flex items-center gap-2 text-white text-xs uppercase lg:w-1/2  md:!w-full lg:justify-center"
            >
              <icons.plus className="stroke-white md:stroke-blue w-3" />
              <span>{t("add-new-user")}</span>
            </button>
          )}
        </div>

        <div className="h-[calc(100%-32px-16px)] border border-gray_lighter rounded-xl overflow-hidden my-2 lg:bg-white lg:dark:bg-[#243B48]  lg:my-2 dark:border-green_5 lg:h-auto lg:flex-1 ">
          {isLoading ? (
            <BounceDotsLoader className="h-full" />
          ) : employees?.length ? (
            <Fragment>
              <div className="w-full h-full overflow-y-auto table-scrollbar hidden lg:block">
                <table className="w-full whitespace-nowrap text-xs ">
                  <thead>
                    <tr className="bg-gray_1 text-gray_dark sticky top-0 dark:bg-green_10 dark:text-gray_lighter">
                      <td className="px-2 py-1 pl-4">{t("first-name")}</td>
                      <td className="px-2 py-1 ">{t("last-name")}</td>
                      <td className="px-2 py-1 ">{t("status")}</td>
                      {userInfo?.status && companyInfo?.status && (
                        <td className="px-2 py-1 text-center">{t("verification")}</td>
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-black dark:text-white">
                    {employees?.map((user) => (
                      <Fragment key={user?.id}>
                        <tr className="border-t border-gray_2 dark:border-green_5">
                          <td className="px-2 py-[0.3rem] pl-4">{user?.first_name || "-"}</td>
                          <td className="px-2 py-[0.3rem]">{user?.last_name || "-"}</td>
                          <td className="px-2 py-1">
                            {user?.status ? (
                              <icons.checked className="fill-blue w-4" />
                            ) : (
                              <span className="text-red">{t("unverified")}</span>
                            )}
                          </td>
                          {userInfo?.status && companyInfo?.status && (
                            <td className="px-2 py-1 flex items-center justify-center">
                              {user?.status ? (
                                "-"
                              ) : (
                                <button
                                  onClick={() => handleOpenModal("verification", user)}
                                  className="bg-blue px-4 py-1 rounded-md text-white text-xs"
                                >
                                  {t("verify")}
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                        <tr>
                          <td
                            colSpan={userInfo?.status && companyInfo?.status ? 4 : 3}
                            className="border-b border-[#CDD6E2] dark:border-[#3B5E71] px-4 pb-2 pt-1"
                          >
                            <div className="flex border border-[#CDD6E2] dark:border-[#3B5E71] rounded-xl p-3">
                              <p className="pr-6">{t("contacts")}:</p>
                              <div className="grid grid-cols-[6rem_1fr] gap-y-2 text-[#546172] dark:text-white">
                                <span className="flex items-center gap-2">
                                  <icons.phone className="fill-blue w-3" /> {t("phone")}:
                                </span>
                                <span>{user?.phone || "-"}</span>
                                <span className="flex items-center gap-2">
                                  <icons.mail /> {t("email")}:
                                </span>
                                <span>{user?.email || "-"}</span>
                                <span className="flex items-center gap-2">
                                  <icons.telegram /> {t("telegram")}:
                                </span>
                                <span>{user?.telegram || "-"}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-full h-full overflow-y-auto table-scrollbar lg:hidden">
                <table className="w-full whitespace-nowrap text-xs">
                  <thead>
                    <tr className="bg-gray_1 text-gray_dark sticky top-0 dark:bg-green_10 dark:text-gray_lighter">
                      <td className="px-2 py-1 pl-4">{t("first-name")}</td>
                      <td className="px-2 py-1 ">{t("last-name")}</td>
                      <td className="px-2 py-1 ">{t("phone")}</td>
                      <td className="px-2 py-1 ">{t("email")}</td>
                      <td className="px-2 py-1 ">{t("telegram")}</td>
                      <td className="px-2 py-1 ">{t("status")}</td>
                      {userInfo?.status && companyInfo?.status && (
                        <td className="px-2 py-1 text-center">{t("verification")}</td>
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-black dark:text-white">
                    {employees?.map((user) => (
                      <tr key={user?.id} className="border-t border-gray_2 dark:border-green_5">
                        <td className="px-2 py-[0.3rem] pl-4">{user?.first_name || "-"}</td>
                        <td className="px-2 py-[0.3rem]">{user?.last_name || "-"}</td>
                        <td className="px-2 py-[0.3rem]">{user?.phone || "-"}</td>
                        <td className="px-2 py-[0.3rem]">{user?.email || "-"}</td>
                        <td className="px-2 py-[0.3rem]">{user?.telegram || "-"}</td>
                        <td className="px-2 py-1">
                          {user?.status ? (
                            <icons.checked className="fill-blue w-4" />
                          ) : (
                            <span className="text-red">{t("unverified")}</span>
                          )}
                        </td>
                        {userInfo?.status && companyInfo?.status && (
                          <td className="px-2 py-1 flex items-center justify-center">
                            {user?.status ? (
                              "-"
                            ) : (
                              <button
                                onClick={() => handleOpenModal("verification", user)}
                                className="bg-blue px-4 py-1 rounded-md text-white text-xs"
                              >
                                {t("verify")}
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Fragment>
          ) : (
            <div className="w-full h-full font-bicubik flex items-center justify-center text-2xl text-center text-gray uppercase">
              {t("employees-not-found")}
            </div>
          )}
        </div>

        <p className="flex items-center justify-end gap-2 text-xs lg:inline lg:text-center dark:text-[#95A5BA]">
          <span>{t("if-you-have-any-doubts-about-any-accounts-not-related-to-your-company")}:</span>
          <span
            onClick={() => handleOpenModal("help")}
            className="text-blue cursor-pointer lg:pl-2"
          >
            {t("contact-us")}
          </span>
        </p>
      </div>
    </>
  );
}

export default ACPUsersListUnderYourMC;
