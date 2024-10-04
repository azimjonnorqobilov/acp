import { icons } from "assets/icons/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PERMISSION_CHECK } from "assets/constants/constants";
import { getCompanyInformation } from "store/slices/userSlice";
import RaitingOverview from "layers/raiting-overview/RaitingOverview";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import ButtonsGroup from "components/buttons-group/ButtonsGroup";
import PostedLoads from "./posted-loads/PostedLoads";
import Comment from "layers/comment/Comment";

function CompanyReview({ item, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const {
    auth: {
      userInfo: { entity_type },
    },
    user: {
      companyInformation: { companyInfo, isLoading },
    },
    theme: {
      device: { deviceType },
    },
  } = useSelector((store) => store);
  const [tab, setTab] = useState(deviceType === "desktop" ? "comment" : "rating");

  const currentPath = pathname?.split("/");

  const loadsOrTrucks =
    currentPath?.[1] === "carrier" ||
    currentPath?.[1] === "carrier-dispatcher" ||
    (currentPath?.[1] === "broker" && currentPath?.[2] === "shippers-loads")
      ? "loads"
      : "trucks";

  useEffect(() => {
    dispatch(getCompanyInformation(item?.company?.id));
  }, [dispatch, item?.company?.id]);

  useEffect(() => {
    deviceType === "desktop" && tab === "rating" && setTab("comment");
    deviceType === "mobile" && setTab("rating");
  }, [deviceType]);

  return (
    <div className="w-[70vw] h-[85vh] xl:w-[80vw] xl:h-[90vh] lg:!w-[96%] lg:!h-[98%] overflow-hidden flex flex-col rounded-2xl bg-white dark:bg-green_4 relative dark:text-white">
      <button onClick={onClose} className="w-max h-max absolute top-4 right-4">
        <icons.close className="w-3 stroke-black dark:stroke-white" />
      </button>
      <p className="font-bicubik px-6 pt-6 lg:px-4 lg:pt-4">{t("company-reviw")}</p>
      <div
        className={`w-full h-[calc(100%-48px)] pt-4 px-6 lg:hidden ${
          PERMISSION_CHECK(["carrier-dispatcher"], entity_type, "some") ? "pb-2" : "pb-6"
        }`}
      >
        <div
          className={`flex ${
            PERMISSION_CHECK(["carrier-dispatcher"], entity_type, "some")
              ? "h-[calc(100%-20px)]"
              : "h-full"
          }`}
        >
          <div className="w-[20rem] h-full overflow-y-auto flex flex-col justify-between scrollbar-hidden">
            <div className="grid grid-cols-[7rem_1fr] gap-1 border border-gray_lighter rounded-xl bg-gray_light px-4 py-2 text-sm dark:border-[#385566] dark:bg-[#385566] relative">
              {isLoading && (
                <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center rounded-xl">
                  <BounceDotsLoader />
                </div>
              )}
              <span className="text-gray">{t("user-name")}:</span>
              <span>{item?.company?.user_full_name || "-"}</span>
              <span className="text-gray">{t("user-contact")}:</span>
              <span>{item?.company?.user_phone_number || "-"}</span>

              {currentPath?.[2] !== "shippers-loads" && (
                <>
                  <span className="text-gray">{t("user-status")}:</span>
                  <span>
                    {companyInfo?.status ? (
                      <icons.checked className="fill-blue w-4" />
                    ) : (
                      <span className="text-red">{t("unverified")}</span>
                    )}
                  </span>
                </>
              )}
            </div>

            <div>
              <div className="flex flex-col py-2 px-6">
                <p className="font-bicubik">{item?.company?.name || "-"}</p>
                <p className="text-gray text-xs pb-2">
                  <span>{t("entity-type")}:</span> <span>{companyInfo?.entity_type}</span>
                </p>
                {currentPath?.[2] !== "shippers-loads" && (
                  <div className="flex gap-8 items-center text-gray text-sm">
                    <p>
                      <span>{t("mc")}: </span> <span>{companyInfo?.mc || "-"}</span>
                    </p>
                    <p>
                      <span>{t("usdot")}: </span> <span>{companyInfo?.usdot || "-"}</span>
                    </p>
                  </div>
                )}
                <p className="text-gray text-sm">
                  <span>{t("contact")}: </span>
                  <span>{companyInfo?.contact || "-"}</span>
                </p>
              </div>

              <RaitingOverview />
            </div>
          </div>

          <div className="w-[calc(100%-20rem)] h-full flex flex-col pl-4">
            <div className="flex items-center justify-between gap-4 ">
              <ButtonsGroup
                active={tab}
                buttons={[
                  { id: 1, label: t("comments"), value: "comment" },
                  { id: 2, label: `${t("posted")} ${t(loadsOrTrucks)}`, value: "posted-loads" },
                ]}
                onClick={(e) => setTab(e)}
                className="w-max"
                classNameButton="py-1 px-4 rounded-lg"
              />
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bicubik text-base font-[500]">{t("company-status")}:</span>
                {companyInfo?.status ? (
                  <icons.checked className="fill-blue w-5" />
                ) : (
                  <span className="w-5 text-center">-</span>
                )}
              </div>
            </div>

            <div className="w-full h-[calc(100%-37px)] pt-2">
              {tab === "comment" && <Comment />}
              {tab === "posted-loads" && <PostedLoads loadsOrTrucks={loadsOrTrucks} />}
            </div>
          </div>
        </div>

        {PERMISSION_CHECK(["carrier-dispatcher"], entity_type, "some") && (
          <p className="text-black dark:text-white text-xs pt-1 text-end flex justify-end gap-1">
            <span>{entity_type && `${t("need-verification-of-your-account")}: `}</span>
            <Link to="/company-verification" target="_blank" className="text-blue cursor-pointer">
              {t("verify")}
            </Link>
          </p>
        )}
      </div>

      <div className="w-full h-[calc(100%-40px)] flex-col hidden pt-2 lg:flex">
        <div
          className={` ${
            PERMISSION_CHECK(["carrier-dispatcher"], entity_type, "some")
              ? "h-[calc(100%-32px)]"
              : "h-full"
          }`}
        >
          <ButtonsGroup
            active={tab}
            buttons={[
              { id: 1, label: t("rating"), value: "rating" },
              { id: 2, label: t("comments"), value: "comment" },
              { id: 3, label: t("posts"), value: "posted-loads" },
            ]}
            onClick={(e) => setTab(e)}
            className="px-4"
            classNameGroup="w-full rounded-xl"
            classNameButton="py-2 px-1 rounded-lg text-xs"
          />
          <div className="flex flex-col w-full h-[calc(100%-41px)] py-2">
            {tab === "rating" && (
              <div className="w-full h-full px-4 mb-4 lg:m-0 rounded-xl overflow-y-auto">
                <div className="h-full flex flex-col justify-between rounded-xl">
                  <div className="grid grid-cols-[7rem_1fr] gap-1 border border-gray_lighter rounded-xl bg-gray_light px-4 py-2 text-sm dark:border-[#385566] dark:bg-[#385566] relative">
                    {isLoading && (
                      <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center rounded-xl">
                        <BounceDotsLoader />
                      </div>
                    )}
                    <span className="text-gray">{t("user-name")}:</span>
                    <span>{item?.company?.user_full_name || "-"}</span>
                    <span className="text-gray">{t("user-contact")}:</span>
                    <span>{item?.company?.user_phone_number || "-"}</span>
                    {currentPath?.[2] !== "shippers-loads" && (
                      <>
                        <span className="text-gray">{t("user-status")}:</span>
                        <span>
                          {companyInfo?.status ? (
                            <icons.checked className="fill-blue w-4" />
                          ) : (
                            <span className="text-red">{t("unverified")}</span>
                          )}
                        </span>
                      </>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-col py-2 px-6">
                      <p className="font-bicubik">{companyInfo?.name || "-"}</p>
                      <p className="text-gray text-xs pb-2">
                        <span>{t("entity-type")}:</span> <span>{companyInfo?.entity_type}</span>
                      </p>
                      {currentPath?.[2] !== "shippers-loads" && (
                        <div className="flex gap-8 items-center text-gray text-sm">
                          <p>
                            <span>{t("mc")}: </span> <span>{companyInfo?.mc || "-"}</span>
                          </p>
                          <p>
                            <span>{t("usdot")}: </span> <span>{companyInfo?.usdot || "-"}</span>
                          </p>
                        </div>
                      )}
                      <p className="text-gray text-sm">
                        <span>{t("contact")}: </span>
                        <span>{companyInfo?.contact || "-"}</span>
                      </p>
                    </div>

                    <RaitingOverview />
                  </div>
                </div>
              </div>
            )}

            {tab === "comment" && <Comment component="company-review" />}

            {tab === "posted-loads" && (
              <div className="px-4 h-full">
                <PostedLoads loadsOrTrucks={loadsOrTrucks} />
              </div>
            )}
          </div>
        </div>

        {PERMISSION_CHECK(["carrier-dispatcher"], entity_type, "some") && (
          <p className="w-full text-black dark:text-white text-xs px-4 py-2 text-center">
            <span>{`${t("need-verification-of-your-account")}: `}</span>
            <Link to="/company-verification" target="_blank" className="text-blue cursor-pointer">
              {t("verify")}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default CompanyReview;
