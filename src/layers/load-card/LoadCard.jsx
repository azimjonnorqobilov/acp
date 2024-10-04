import { useState } from "react";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import {
  SORT_DATA,
  REFACTOR_SUM,
  REFACTOR_DATE,
  TYPES_TO_STRING,
} from "assets/constants/constants";
import CompanyReview from "layers/company-review/CompanyReview";
import { toastify } from "components/toastify/toastify";
import MUIModal from "components/mui-modal/MUIModal";
import { Tooltip } from "@mui/material";

const LoadCard = ({
  load,
  active = null,
  activeLoad,
  onChooseLoad = () => {},
  companyReview = true,
}) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <>
      <MUIModal open={openModal}>
        <CompanyReview item={activeLoad} onClose={handleCloseModal} />
      </MUIModal>
      <div
        className={`relative border-[#D1DAE6] dark:border-[#223F50] ${
          companyReview ? "border-b-4  mb-2" : "border-b-2"
        }`}
      >
        <div
          // onClick={onChooseLoad}
          className={`w-full p-2 flex flex-col relative ${
            active ? "bg-[#DDE4ED] dark:bg-[#304D5E]" : ""
          }`}
        >
          <div className="flex items-center">
            <div className="flex-1 border border-[#D1DAE6] bg-[#F6F9FE] dark:border-[#2C495A] dark:bg-[#203845] p-2 rounded-xl flex items-center">
              <div className="w-full text-xs flex items-center justify-between gap-2 pl-2">
                <div className="flex flex-col flex-1 text-center">
                  {load?.origin ? (
                    <>
                      <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                        {load?.origin}
                      </span>
                      <span className="text-[#546172] dark:text-[#899FAC]">
                        {t("dh-o")}: {load?.dh_o ? load?.dh_o : load?.dh_o === 0 ? 0 : "-"}
                      </span>
                    </>
                  ) : (
                    <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                      {t("anywhere")}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center flex-[0.6]">
                  <div className="bg-[#3F96D0] w-2 h-2 rounded-full" />
                  <div className="flex-auto min-w-2 h-[2px] bg-[#D1DAE6] dark:bg-[#2C495A]" />
                  <span className="flex-1 px-1 text-center dark:text-[#899FAC]">
                    {REFACTOR_SUM(Math.ceil(load?.distance))}
                  </span>
                  <div className="flex-auto min-w-2 h-[2px] bg-[#D1DAE6] dark:bg-[#2C495A]" />
                  <div className="bg-[#3F96D0] w-2 h-2 rounded-full" />
                </div>
                <div className="flex flex-col flex-1 text-center">
                  {load?.destination ? (
                    <>
                      <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                        {load?.destination}
                      </span>
                      <span className="text-[#546172] dark:text-[#899FAC]">
                        {t("dh-d")}: {load?.dh_d ? load?.dh_d : load?.dh_d === 0 ? 0 : "-"}
                      </span>
                    </>
                  ) : (
                    <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                      {t("anywhere")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center px-2">
              <p className="font-bold text-blue text-lg text-center">
                {load?.price ? `$${REFACTOR_SUM(load?.price)}` : "-"}
              </p>
              <div className="flex items-center">
                <span className="text-xs pr-1 dark:text-white">{t("status")}:</span>
                {!load?.status ? <icons.checked className="fill-blue w-4" /> : "-"}
              </div>
            </div>
          </div>

          <div className="text-xs grid grid-cols-[1fr_1fr_1fr_1fr] gap-2 items-end justify-center text-center pt-2 px-1">
            <div className="flex flex-col">
              <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                {t("age")}: {load?.time_frame || "-"}
              </span>
              <span
                className={`text-[#546172] dark:text-[#ffffff] border px-2 py-[0.15rem] rounded-xl ${
                  load?.type?.length + load?.type_category?.length > 2 ? "cursor-pointer" : ""
                } ${
                  active
                    ? "border-[#F6F9FE] dark:border-[#567384]"
                    : "border-[#D1DAE6] dark:border-[#2C495A]"
                }`}
              >
                {load?.type?.id ? (
                  load?.type?.ext
                ) : (
                  <Tooltip
                    arrow
                    classes={{ tooltip: "tooltip-style", arrow: "tooltip-arrow-style" }}
                    title={
                      load?.type?.length + load?.type_category?.length > 2 && (
                        <div className="flex flex-col">
                          {load?.type_category?.length ? (
                            <div
                              className={`${
                                load?.type?.length
                                  ? "border-b border-gray_lighter dark:border-green_8 pb-1"
                                  : ""
                              }`}
                            >
                              <p className="text-black font-bold dark:text-white">{t("groups")}</p>
                              <div
                                style={{
                                  gridTemplateColumns: `repeat(${
                                    load?.type?.length > 4 || load?.type_category?.length > 4
                                      ? 4
                                      : load?.type?.length && load?.type_category?.length
                                      ? load?.type?.length > load?.type_category?.length
                                        ? load?.type?.length
                                        : load?.type_category?.length
                                      : load?.type?.length || load?.type_category?.length
                                  }, 1fr)`,
                                }}
                                className={`grid text-center items-center justify-center gap-1 whitespace-nowrap py-1`}
                              >
                                {SORT_DATA(load?.type_category, "name")?.map((c) => (
                                  <span
                                    key={c?.id}
                                    className="bg-blue_light dark:bg-green_8 border border-gray_lighter dark:border-green_8 text-black dark:text-white py-1 px-2 rounded text-[8px]"
                                  >
                                    {c?.ext}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {load?.type?.length ? (
                            <div className={`${load?.type_category?.length ? "pt-1" : ""}`}>
                              <p className="text-black font-bold dark:text-white">{t("types")}</p>
                              <div
                                style={{
                                  gridTemplateColumns: `repeat(${
                                    load?.type?.length > 4 || load?.type_category?.length > 4
                                      ? 4
                                      : load?.type?.length && load?.type_category?.length
                                      ? load?.type?.length > load?.type_category?.length
                                        ? load?.type?.length
                                        : load?.type_category?.length
                                      : load?.type?.length || load?.type_category?.length
                                  }, 1fr)`,
                                }}
                                className={`grid text-center items-center justify-center gap-1 whitespace-nowrap py-1`}
                              >
                                {SORT_DATA(load?.type, "ext")?.map((t) => (
                                  <span
                                    key={t?.id}
                                    className="bg-blue_light dark:bg-green_8 border border-gray_lighter dark:border-green_8 text-black dark:text-white py-1 px-2 rounded text-[8px]"
                                  >
                                    {t?.ext}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      )
                    }
                    placement="top-start"
                  >
                    <span>
                      {TYPES_TO_STRING({
                        types: load?.type,
                        categories: load?.type_category,
                        joinCount: 2,
                      })}
                    </span>
                  </Tooltip>
                )}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                {load?.length ? `${REFACTOR_SUM(load?.length)} ft` : "-"}
              </span>
              <span
                className={`text-[#546172] dark:text-[#ffffff] border px-2 py-[0.15rem] rounded-xl ${
                  active
                    ? "border-[#F6F9FE] dark:border-[#567384]"
                    : "border-[#D1DAE6] dark:border-[#2C495A]"
                } ${load?.truck_status?.toLowerCase() === "both" ? "capitalize" : "uppercase"}`}
              >
                {load?.truck_status
                  ? load?.truck_status?.toLowerCase() === "both"
                    ? load?.truck_status?.toLowerCase()
                    : load?.truck_status?.toUpperCase()
                  : "-"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                {load?.weight ? `${REFACTOR_SUM(load?.weight)} lbs` : "-"}
              </span>
              <span
                className={`text-[#546172] dark:text-[#ffffff] border px-2 py-[0.15rem] rounded-xl flex items-center justify-center gap-1 ${
                  active
                    ? "border-[#F6F9FE] dark:border-[#567384]"
                    : "border-[#D1DAE6] dark:border-[#2C495A]"
                }`}
              >
                {load?.pickup_date ? (
                  <>
                    <icons.calendar className="fill-gray_dark dark:fill-white" />
                    {REFACTOR_DATE(load?.pickup_date)}
                  </>
                ) : (
                  "-"
                )}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-blue font-semibold">{load?.company?.name || "-"}</span>
              {load?.contact_type === "phone" && (
                <a
                  href={`tel:${load?.contact}`}
                  className={`flex items-center justify-center capitalize gap-1 text-[#ffffff] border border-blue px-2 py-[0.15rem] rounded-xl whitespace-nowrap bg-blue`}
                >
                  {load?.contact_type === "phone" && <icons.phone className="fill-white w-3" />}
                  {load?.contact_type ? t(load?.contact_type) : "-"}
                </a>
              )}
              {load?.contact_type === "telegram" && (
                <a
                  href={`https://t.me/${load?.contact?.replace("@", "")}`}
                  className={`flex items-center justify-center capitalize gap-1 text-[#ffffff] border border-blue px-2 py-[0.15rem] rounded-xl whitespace-nowrap bg-blue`}
                >
                  {load?.contact_type === "telegram" && <icons.telegram className="fill-white" />}
                  {load?.contact_type ? t(load?.contact_type) : "-"}
                </a>
              )}

              {load?.contact_type === "email" && (
                <span
                  onClick={(e) => {
                    navigator.clipboard.writeText(load?.contact);
                    toastify.success("Mail copied!");
                  }}
                  className={`flex items-center justify-center capitalize gap-1 text-[#ffffff] border border-blue px-2 py-[0.15rem] rounded-xl whitespace-nowrap bg-blue cursor-pointer`}
                >
                  {load?.contact_type === "email" && <icons.mail className="fill-white" />}
                  {load?.contact_type ? t(load?.contact_type) : "-"}
                </span>
              )}
            </div>
          </div>
        </div>

        {active && (
          <div className="text-xs p-4 bg-[#F0F5FA] dark:bg-[#243B48] flex flex-col gap-y-2">
            <div className="flex items-start">
              <div className="grid grid-cols-[5rem_1fr] gap-y-2 pr-10">
                <span className="text-[#546172] dark:text-[#899FAC]">{t("ref")}: </span>
                <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                  {load?.ref_number || "-"}
                </span>
                <span className="text-[#546172] dark:text-[#899FAC]">{t("dlv-date")}: </span>
                <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                  {load?.dlv_date ? REFACTOR_DATE(load?.dlv_date) : "-"}
                </span>
                <span className="text-[#546172] dark:text-[#899FAC]">{t("commodity")}: </span>
                <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                  {load?.commodity || "-"}
                </span>
                <span className="text-[#546172] dark:text-[#899FAC]">{t("rpm")}: </span>
                <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                  {load?.price && load?.distance
                    ? `$${(load?.price / load?.distance)?.toFixed(2)}`
                    : "-"}
                </span>
              </div>

              <div className="grid grid-cols-[6.5rem_1fr] items-center gap-y-2">
                <span className="text-[#546172] dark:text-[#899FAC]">{t("name")}: </span>
                <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                  {load?.name || "-"}
                </span>
                <span className="text-[#546172] dark:text-[#899FAC]">{t("mc")}: </span>
                <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                  {load?.company?.mc || "-"}
                </span>
                <span className="text-[#546172] dark:text-[#899FAC]">{t("credit-score")}: </span>
                <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                  {load?.credit_score || "-"}
                </span>
              </div>
            </div>

            <div className="flex gap-3 whitespace-pre-wrap">
              <span className="text-[#546172] dark:text-[#899FAC]">{t("description")}: </span>
              <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                {load?.comment || "-"}
              </span>
            </div>

            {companyReview && (
              <button
                onClick={handleOpenModal}
                className="whitespace-nowrap bg-white border border-blue rounded-lg px-2 py-2 font-bold text-blue uppercase text-xs dark:bg-[#1A313E]"
              >
                {t("company-review")}
              </button>
            )}
          </div>
        )}

        {companyReview &&
          (active ? (
            <button
              onClick={onChooseLoad}
              className="absolute bottom-[-0.2rem] left-[calc(50%-12.5px)]"
            >
              <icons.arrowUp />
            </button>
          ) : (
            <button
              onClick={onChooseLoad}
              className="absolute bottom-[-0.6rem] left-[calc(50%-12.5px)]"
            >
              <icons.arrowDown />
            </button>
          ))}
      </div>
    </>
  );
};

export default LoadCard;
