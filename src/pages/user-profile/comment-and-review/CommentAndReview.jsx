import { icons } from "assets/icons/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PERMISSION_CHECK } from "assets/constants/constants";
import { getMyCompanyInformation, searchCompanyInformation } from "store/slices/userSlice";
import RaitingOverview from "layers/raiting-overview/RaitingOverview";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import MUIModal from "components/mui-modal/MUIModal";
import Comment from "layers/comment/Comment";
import Input from "components/input/Input";

function CommentAndReview() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    auth: {
      userInfo: { entity_type },
    },
    user: {
      companyInformation: { companyInfo, isLoading },
      commentAndReview: { comments },
    },
    theme: {
      device: { deviceType },
    },
  } = useSelector((store) => store);

  document.title = t("comment-and-review");

  const [openModal, setOpenModal] = useState({ open: false, action: null });
  const [searchCompany, setSearchCompany] = useState("");

  const handleOpenModa = (action) => setOpenModal({ open: true, action });
  const handleCloseModa = () => setOpenModal({ ...openModal, open: false });

  const handleGetCompany = () => dispatch(searchCompanyInformation(searchCompany));

  const handleGetMyCompany = () => {
    dispatch(getMyCompanyInformation());
    setSearchCompany("");
  };

  useEffect(() => {
    PERMISSION_CHECK(["carrier", "broker", "shipper"], entity_type, "some") && handleGetMyCompany();
  }, []);

  return (
    <>
      <MUIModal open={openModal?.open} onClose={handleCloseModa}>
        {openModal?.action === "comment" && (
          <div className="w-[96%] h-[98%] rounded-xl bg-white dark:bg-[#1F323C] overflow-hidden relative">
            <button onClick={handleCloseModa} className="w-max h-max absolute top-4 right-4">
              <icons.close className="w-3 stroke-black dark:stroke-white" />
            </button>
            <p className="font-bicubik p-3 dark:text-white">Comments</p>
            <div className="w-full h-[calc(100%-48px)] ">
              <Comment />
            </div>
          </div>
        )}
      </MUIModal>
      <div
        className={`w-full flex flex-col rounded-2xl h-full bg-white dark:bg-green_4 dark:text-white lg:p-0 lg:!bg-transparent relative ${
          PERMISSION_CHECK(["carrier-dispatcher"], entity_type, "some") ? "p-6 pb-2" : "p-6"
        }`}
      >
        <div className="flex lg:items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-white dark:bg-[#2C495A] w-10 p-2 min-h-[2.5rem] rounded-lg justify-center items-center hidden lg:flex"
          >
            <icons.arrowLeft className="fill-black dark:fill-white" />
          </button>
          <p className="w-[calc(100%-5rem)] lg:text-center dark:text-white font-bicubik">
            {t("comment-and-review")}
          </p>
        </div>

        <div
          className={`flex pt-2 gap-4 lg:py-2 ${
            PERMISSION_CHECK(["carrier-dispatcher"], entity_type, "some")
              ? "h-[calc(100%-24px-20px)]"
              : "h-[calc(100%-24px)]"
          }`}
        >
          <div className="w-[20rem] xl:w-[16rem] lg:!w-full h-full overflow-y-auto scrollbar-hidden flex flex-col justify-between">
            <div className="px-1">
              <Input
                // disabled={companyInfo?.status ? false : true}
                value={searchCompany || ""}
                label={t("search-company")}
                onChange={(e) => setSearchCompany(e.target.value)}
                placeholder="MC, USDOT"
                actionButtonLabel={t("check")}
                actionButtonClick={handleGetCompany}
                actionButtonDisabled={searchCompany ? false : true}
              />
              {PERMISSION_CHECK(["carrier", "broker", "shipper"], entity_type, "some") &&
                ((!companyInfo?.my_company && companyInfo?.id) ||
                  (searchCompany && !companyInfo?.id)) && (
                  <p
                    onClick={handleGetMyCompany}
                    className="flex items-center gap-2 text-xs text-blue p-1 cursor-pointer"
                  >
                    <icons.arrowLeft className="fill-blue w-3" />
                    <span>{t("your-company-information")}</span>
                  </p>
                )}
            </div>

            {((PERMISSION_CHECK(["carrier-dispatcher"], entity_type, "some") && companyInfo?.id) ||
              PERMISSION_CHECK(["broker", "carrier", "shipper"], entity_type, "some")) &&
              (companyInfo?.my_company || (companyInfo?.id && !companyInfo?.my_company)) && (
                <div className="flex flex-col gap-2">
                  <div className="text-gray_dark flex flex-col dark:text-white">
                    <div className="flex flex-col px-4 py-2">
                      <p className="font-bicubik">{companyInfo?.name || "-"}</p>
                      <p className="text-gray text-xs">
                        <span>{t("entity-type")}:</span>{" "}
                        <span className="capitalize">{companyInfo?.entity_type}</span>
                      </p>
                      <div className="flex items-center gap-8 text-gray text-sm pt-2">
                        <p>
                          <span>{t("mc")}: </span> <span>{companyInfo?.mc || "-"}</span>
                        </p>
                        <p>
                          <span>{t("usdot")}: </span> <span>{companyInfo?.usdot || "-"}</span>
                        </p>
                      </div>
                      <p className="text-gray text-sm">
                        <span>{t("contact")}: </span>
                        <span>{companyInfo?.contact || "-"}</span>
                      </p>
                    </div>

                    <RaitingOverview />
                    <div className="flex justify-between items-center bg-[#FAFBFC] dark:bg-[#385566] border border-[#D1DAE6] dark:border-[#385566] rounded-lg py-1 px-4 mt-2 lg:hidden">
                      <div className="flex items-center gap-2">
                        <icons.comment className="w-4 fill-blue" />
                        <span className="text-sm">{t("total-comments")}</span>
                      </div>
                      <span className="text-blue text-sm font-bold">{comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {deviceType === "desktop" &&
            ((PERMISSION_CHECK(["carrier-dispatcher"], entity_type, "some") && companyInfo?.id) ||
              PERMISSION_CHECK(["broker", "carrier", "shipper"], entity_type, "some")) &&
            (companyInfo?.my_company || (searchCompany && companyInfo?.id) ? (
              <div className="w-[calc(100%-20rem)] xl:w-[calc(100%-16rem)] h-full overflow-hidden lg:hidden">
                <Comment />
              </div>
            ) : (
              <div className="w-[calc(100%-20rem)] xl:w-[calc(100%-16rem)] h-full flex items-center justify-center">
                {isLoading ? (
                  <BounceDotsLoader />
                ) : (
                  <div className="w-full h-full font-bicubik flex items-center justify-center text-2xl text-center text-gray uppercase">
                    {t("result-not-found")}
                  </div>
                )}
              </div>
            ))}
        </div>

        {PERMISSION_CHECK(["carrier-dispatcher"], entity_type, "some") && (
          <p className="text-black dark:text-white text-xs pt-1 text-end lg:pb-1 lg:pt-0 lg:text-center">
            <span>
              {t("need-verification-of-your-account-for-writing-comments-and-rating-please")}:{" "}
            </span>
            <Link to="/company-verification" target="_blank" className="text-blue cursor-pointer">
              {t("verify")}
            </Link>
          </p>
        )}

        <button
          disabled={!companyInfo?.id}
          onClick={() => companyInfo?.id && handleOpenModa("comment")}
          className={`bg-blue rounded-lg py-2 hidden text-white lg:block ${
            !companyInfo?.id ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {t("comments")}
        </button>
      </div>
    </>
  );
}

export default CommentAndReview;
