import { icons } from "assets/icons/icons";
import { Tooltip } from "@mui/material";
import { REFACTOR_SUM } from "assets/constants/constants";
import { TYPES_TO_STRING } from "assets/constants/constants";
import { REFACTOR_DATE } from "assets/constants/constants";
import { SORT_DATA } from "assets/constants/constants";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fragment } from "react";

// grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_1fr_0.5fr_1fr_0.5fr_1.2fr_1fr_0.5fr_0.7fr_0.7fr_0.7fr]

function Item({ item: load, activeItem, activeItems, onChooseItem, onOpenModal }) {
  const { t } = useTranslation();

  return (
    <Fragment>
      <div
        onClick={() => onChooseItem(load)}
        className={`grid grid-cols-[4rem_5rem_4rem_6rem_4rem_12rem_5rem_12rem_4rem_15rem_7rem_4rem_6rem_6rem_6rem] justify-between cursor-pointer whitespace-nowrap  text-xs border-t border-gray_lighter dark:border-[#2C495A] ${
          load?.unread ? "font-bold" : ""
        } ${
          activeItem?.id === load?.id
            ? "bg-[#E6EDF7] dark:bg-[#304D5E]"
            : activeItems?.includes(load?.id)
            ? "bg-[#c3cddd] dark:bg-[#2C495A]"
            : "bg-white dark:bg-[#1A313E]"
        }`}
      >
        <div className="px-2 py-[0.3rem]  text-center">{load?.time_frame || "-"}</div>
        <div className="px-2 py-[0.3rem] ">
          {load?.pickup_date ? REFACTOR_DATE(load?.pickup_date) : "-"}
        </div>
        <div className="px-2 py-[0.3rem]">
          {load?.type?.id ? (
            load?.type?.ext
          ) : (
            <Tooltip
              arrow
              classes={{ tooltip: "tooltip-style", arrow: "tooltip-arrow-style" }}
              title={
                load?.type?.length + load?.type_category?.length > 2 && (
                  <div className="flex flex-col">
                    {SORT_DATA(load?.type_category, "name")?.length ? (
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
                          {load?.type_category?.map((c) => (
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
                    {SORT_DATA(load?.type, "ext")?.length ? (
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
                          {load?.type?.map((t) => (
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
                  types: SORT_DATA(load?.type, "ext"),
                  categories: SORT_DATA(load?.type_category, "name"),
                  joinCount: 2,
                })}
              </span>
            </Tooltip>
          )}
        </div>
        <div
          className={`px-2 py-[0.3rem]  ${
            load?.truck_status?.toLowerCase() === "both" ? "capitalize" : "uppercase"
          }`}
        >
          {load?.truck_status
            ? load?.truck_status?.toLowerCase() === "both"
              ? load?.truck_status?.toLowerCase()
              : load?.truck_status?.toUpperCase()
            : "-"}
        </div>
        <div className="px-2 py-[0.3rem] ">
          {load?.dh_o ? REFACTOR_SUM(Math.ceil(load?.dh_o)) : load?.dh_o === 0 ? 0 : "-"}
        </div>
        <div className="px-2 py-[0.3rem] ">{load?.origin || t("anywhere")}</div>
        <div className="px-2 py-[0.3rem] ">
          {load?.distance ? REFACTOR_SUM(Math.ceil(load?.distance)) : "-"}
        </div>
        <div className="px-2 py-[0.3rem] ">{load?.destination || t("anywhere")}</div>
        <div className="px-2 py-[0.3rem] ">
          {load?.dh_d ? REFACTOR_SUM(Math.ceil(load?.dh_d)) : load?.dh_d === 0 ? 0 : "-"}
        </div>
        <div className="px-2 py-[0.3rem] ">
          {load?.company?.name ? (
            load?.company?.name?.length <= 27 ? (
              load?.company?.name
            ) : (
              <Tooltip
                arrow
                title={load?.company?.name}
                classes={{
                  tooltip: "tooltip-style",
                  arrow: "tooltip-arrow-style",
                }}
                placement="top"
              >
                <span>{load?.company?.name?.substr(0, 27)}...</span>
              </Tooltip>
            )
          ) : (
            "-"
          )}
        </div>
        <div className="px-2 py-[0.3rem]  text-blue">
          {load?.contact ? (
            load?.contact_type === "email" ? (
              <Link
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                to={`mailto:faryozbektfk@gmail.com`}
              >
                {load?.contact}
              </Link>
            ) : (
              <Link onClick={(e) => e.stopPropagation()} to={`tel:${load?.contact}`}>
                {load?.contact}
              </Link>
            )
          ) : (
            "-"
          )}
        </div>
        <div className="px-2 py-[0.3rem] ">
          {load?.length ? `${REFACTOR_SUM(load?.length)} ft` : "-"}
        </div>
        <div className="px-2 py-[0.3rem] ">
          {load?.weight ? `${REFACTOR_SUM(load?.weight)} lbs` : "-"}
        </div>
        <div className="px-2 py-[0.3rem] ">
          {load?.price ? `$${REFACTOR_SUM(load?.price?.toFixed(2))}` : "-"}
        </div>
        <div className="px-2 py-[0.3rem] text-center ">
          {load?.status ? (
            <div className="flex items-center justify-center">
              <icons.checked className="fill-blue w-4" />
            </div>
          ) : (
            "-"
          )}
        </div>
      </div>

      {activeItems?.includes(load?.id) && (
        <div className="bg-[#F0F5FA] dark:bg-[#243B48] z-[100]">
          <div>
            <div className="px-8 py-4 pr-16 flex justify-between items-start gap-4">
              <div className="grid grid-cols-[5rem_minmax(0,_10rem)] gap-y-2">
                <span className="text-gray">{t("ref")}: </span>
                <span className="font-semibold">{load?.ref_number || "-"}</span>
                <span className="text-gray">{t("dlv-date")}: </span>
                <span className="font-semibold">
                  {load?.dlv_date ? REFACTOR_DATE(load?.dlv_date) : "-"}
                </span>
                <span className="text-gray">{t("commodity")}: </span>
                <span className="font-semibold">{load?.commodity || "-"}</span>
              </div>

              <div className="grid grid-cols-[5rem_minmax(0,_10rem)] gap-y-2">
                <span className="text-gray ">{t("description")}:</span>
                <span className="font-semibold">{load?.comment || "-"}</span>
              </div>

              <div className="grid grid-cols-[5rem_minmax(0,_10rem)] gap-y-2">
                <span className="text-gray">{t("name")}: </span>
                <span className="font-semibold">{load?.name || "-"}</span>
                <span className="text-gray">{t("mc")}: </span>
                <span className="font-semibold">{load?.company?.mc || "-"}</span>
                <span className="text-gray">{t("credit-score")}: </span>
                <span className="font-semibold ">{load?.credit_score || "-"}</span>
              </div>

              <div className="flex flex-col gap-4 items-center">
                <p className="flex items-center gap-2">
                  <span className="text-gray">{t("rpm")}: </span>
                  <span className="font-semibold">
                    {load?.price && load?.distance
                      ? `$${(load?.price / load?.distance)?.toFixed(2)}`
                      : "-"}
                  </span>
                </p>
                <button
                  onClick={onOpenModal}
                  className="whitespace-nowrap bg-white border border-blue rounded-lg px-2 py-1 text-blue uppercase text-xs dark:bg-[#1A313E]"
                >
                  {t("company-review")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Item;
