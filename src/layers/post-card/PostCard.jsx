import { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-query";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SORT_DATA,
  REFACTOR_SUM,
  REFACTOR_DATE,
  TYPES_TO_STRING,
  CHECK_PICKUP_DATE,
} from "assets/constants/constants";
import { Tooltip } from "@mui/material";

const PostCard = ({
  load,
  active = false,
  onEdit = () => {},
  onDelete = () => {},
  onChooseLoad = () => {},
  onUpload = () => {},
  onRefreshLoads = () => {},
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    theme: {
      device: { deviceType },
    },
  } = useSelector((store) => store);
  const [open, setOpen] = useState(false);
  const [chooseTime, setChooseTime] = useState(true);

  const currentPath = pathname?.split("/");

  const handleNavigateItems = () => {
    (currentPath?.[1] === "broker" || currentPath?.[1] === "shipper") &&
      navigate(`${pathname}/available-trucks/${load?.id}`);
    currentPath?.[1] === "carrier" && navigate(`${pathname}/available-loads/${load?.id}`);
  };

  const handleChooseItem = () => {
    deviceType === "mobile" ? handleNavigateItems() : onChooseLoad();
  };

  const { mutate: handleUpload, isLoading: isUploading } = useMutation("upload-item-card", (item) =>
    onUpload({ ...item, pickup_date: CHECK_PICKUP_DATE(item?.pickup_date) })
  );

  return (
    <div className="relative border-b-4 border-[#D1DAE6] dark:border-[#223F50] mb-2">
      <div className={`w-full p-2 flex relative ${active ? "bg-[#DDE4ED] dark:bg-[#304D5E]" : ""}`}>
        <div onClick={(e) => chooseTime && handleChooseItem()} className="flex-1 cursor-pointer">
          <div className="border border-[#D1DAE6] bg-[#F6F9FE] dark:border-[#2C495A] dark:bg-[#203845] p-2 rounded-xl flex items-center">
            <Tooltip
              arrow
              title={
                <span className="text-black dark:text-white">
                  {5 - load?.time_frame?.split(":")?.[1] > 0
                    ? `${t("repost-after")} ${5 - load?.time_frame?.split(":")?.[1]}m`
                    : t("ready-repost")}
                </span>
              }
              classes={{ tooltip: "tooltip-style", arrow: "tooltip-arrow-style" }}
              placement="top"
            >
              <button
                // disabled={load?.time_frame?.split(":")?.[0] < 5}
                onClick={() =>
                  parseInt(load?.time_frame?.split(":")?.[1], 10) >= 5 && handleUpload(load)
                }
                onMouseEnter={() => setChooseTime(false)}
                onMouseLeave={() => setChooseTime(true)}
                className={`w-10 h-10 relative bg-[#F2F5F9] border border-[#D1DAE6] flex items-center justify-center rounded-full dark:bg-[#365364] dark:border-[#4A6778] ${
                  parseInt(load?.time_frame?.split(":")?.[1], 10) < 5
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:scale-[1.1] transition"
                }`}
              >
                <icons.reload
                  className={`fill-blue w-6 h-6 ${isUploading ? "rotation-animation" : ""}`}
                />
              </button>
            </Tooltip>
            <div className="flex-1 text-xs flex items-center justify-between gap-2 pl-2">
              <div className="flex flex-col flex-1 text-center">
                {load?.origin ? (
                  <>
                    <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                      {load?.origin}
                    </span>
                    <span className="text-[#546172] dark:text-[#899FAC]">
                      {t("dh-o")}:{" "}
                      {load?.dh_o
                        ? REFACTOR_SUM(Math.ceil(load?.dh_o))
                        : load?.dh_o === 0
                        ? 0
                        : "-"}
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
                      {t("dh-d")}:{" "}
                      {load?.dh_d
                        ? REFACTOR_SUM(Math.ceil(load?.dh_d))
                        : load?.dh_d === 0
                        ? 0
                        : "-"}
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

          <div className="text-xs grid grid-cols-[1fr_1fr_1fr_max-content] gap-3 items-center justify-center text-center pt-2 px-1">
            <div className="flex flex-col">
              <span className="text-blue font-semibold">
                {load?.price ? `$${REFACTOR_SUM(load?.price?.toFixed(2))}` : "-"}
              </span>
              <span
                className={`text-[#546172] dark:text-[#ffffff] border px-2 py-[0.15rem] rounded-xl flex items-center justify-center gap-1 ${
                  active
                    ? "border-[#F6F9FE] dark:border-[#567384]"
                    : "border-[#D1DAE6] dark:border-[#2C495A]"
                }`}
              >
                <icons.timer className="fill-gray dark:fill-white" />
                <span>{load?.time_frame}</span>
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                {t("age")}: {load?.age ? `${load?.age}h` : "-"}
              </span>
              <span
                className={`text-[#546172] dark:text-[#ffffff] border px-2 py-[0.15rem] rounded-xl ${
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
                                  ? "border-b border-gray_lighter pb-1 dark:border-green_8"
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
                className={` text-[#546172] dark:text-[#ffffff] border px-2 py-[0.15rem] rounded-xl ${
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
                className={` text-[#546172] dark:text-[#ffffff] border px-4 py-[0.15rem] rounded-xl flex items-center justify-center gap-1 ${
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
          </div>
        </div>

        <div className="flex flex-col justify-between gap-1 pl-2">
          <button
            onClick={onRefreshLoads}
            className={`bg-[#F2F5F9] w-7 h-7 flex items-center justify-center rounded-lg border border-[#D1DAE6] lg:hidden ${
              active
                ? "dark:border-[#567384] dark:bg-[#3B6177]"
                : "dark:border-[#3B6177] dark:bg-[#2C495A]"
            }`}
          >
            <icons.refresh className="fill-gray dark:fill-white" />
          </button>
          <button
            onClick={onEdit}
            className={`bg-[#F2F5F9] w-7 h-7 flex items-center justify-center rounded-lg border border-[#D1DAE6] ${
              active
                ? "dark:border-[#567384] dark:bg-[#3B6177]"
                : "dark:border-[#3B6177] dark:bg-[#2C495A]"
            }`}
          >
            <icons.pencil className="fill-blue w-4" />
          </button>
          <button
            onClick={onDelete}
            className={`bg-[#F2F5F9] w-7 h-7 flex items-center justify-center rounded-lg border border-[#D1DAE6] ${
              active
                ? "dark:border-[#567384] dark:bg-[#3B6177]"
                : "dark:border-[#3B6177] dark:bg-[#2C495A]"
            }`}
          >
            <icons.trash className="fill-red" />
          </button>
        </div>
      </div>

      {open && (
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
              {/* <span className="text-[#546172] dark:text-[#899FAC]">Price: </span>
              <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                {load?.price ? `$${REFACTOR_SUM(load?.price)}` : "-"}
              </span> */}
              <span className="text-[#546172] dark:text-[#899FAC]">{t("rpm")}: </span>
              <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                {load?.price && load?.distance
                  ? `$${(load?.price / load?.distance)?.toFixed(2)}`
                  : "-"}
              </span>
              <span className="text-[#546172] dark:text-[#899FAC]">{t("credit-score")}: </span>
              <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                {load?.credit_score || "-"}
              </span>
            </div>

            <div className="grid grid-cols-[6.5rem_1fr] items-center gap-y-2">
              <span className="text-[#546172] dark:text-[#899FAC]">{t("company")}: </span>
              <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                {load?.company?.name || "-"}
              </span>
              <span className="text-[#546172] dark:text-[#899FAC]">{t("name")}: </span>
              <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                {load?.name || "-"}
              </span>
              <span className="text-[#546172] dark:text-[#899FAC]">{t("contact")}: </span>
              <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                {load?.contact || "-"}
              </span>
              <span className="text-[#546172] dark:text-[#899FAC]">{t("mc")}: </span>
              <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                {load?.company?.mc || "-"}
              </span>
              <span className="text-[#546172] dark:text-[#899FAC]">{t("status")}: </span>
              <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                {load?.status ? (
                  <div className="flex">
                    <icons.checked className="fill-blue w-4" />
                  </div>
                ) : (
                  "-"
                )}
              </span>
            </div>
          </div>

          <div className="flex gap-3 whitespace-pre-wrap">
            <span className="text-[#546172] dark:text-[#899FAC]">{t("description")}: </span>
            <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
              {load?.comment || "-"}
            </span>
          </div>
        </div>
      )}

      {open ? (
        <button
          onClick={() => {
            setOpen(false);
            onChooseLoad({ open: false });
          }}
          className="absolute bottom-[-0.2rem] left-[calc(50%-12.5px)]"
        >
          <icons.arrowUp />
        </button>
      ) : (
        <button
          onClick={() => {
            setOpen(true);
            onChooseLoad({ open: true });
          }}
          className="absolute bottom-[-0.60rem] left-[calc(50%-12.5px)]"
        >
          <icons.arrowDown />
        </button>
      )}
    </div>
  );
};

export default PostCard;
