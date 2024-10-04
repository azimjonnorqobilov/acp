import { useState } from "react";
import { useSelector } from "react-redux";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SORT_DATA,
  REFACTOR_SUM,
  REFACTOR_DATE,
  TYPES_TO_STRING,
} from "assets/constants/constants";
import NotificationSettings from "components/notification-settings/NotificationSettings";
import { Tooltip } from "@mui/material";

const SearchCard = ({
  load,
  active = false,
  onEdit = () => {},
  onDelete = () => {},
  onChooseLoad = () => {},
  onRefreshLoads = () => {},
  onChangeNotification = () => {},
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    theme: {
      device: { deviceType },
    },
  } = useSelector((store) => store);

  const [chooseTime, setChooseTime] = useState(true);

  const currentPath = pathname?.split("/");

  const handleNavigateItems = () => {
    (currentPath?.[1] === "broker" || currentPath?.[1] === "shipper") &&
      !currentPath?.[2] &&
      navigate(`${pathname}/available-trucks/${load?.id}`);

    ["broker", "find-trucks"]?.every((e) => pathname?.includes(e)) &&
      navigate(`${pathname}/available-trucks/${load?.id}`);

    ["broker", "shippers-loads"]?.every((e) => pathname?.includes(e)) &&
      navigate(`${pathname}/available-loads/${load?.id}`);

    ["carrier", "carrier-dispatcher"]?.some((e) => pathname?.includes(e)) &&
      navigate(`${pathname}/available-loads/${load?.id}`);
  };

  const handleChooseLoad = () => {
    deviceType === "mobile" ? handleNavigateItems() : onChooseLoad();
  };

  return (
    <div
      className={`w-full p-2 flex relative border-b-4 border-[#D1DAE6] dark:border-[#223F50] ${
        active ? "bg-[#DDE4ED] dark:bg-[#304D5E]" : ""
      }`}
    >
      <div
        onClick={() => chooseTime && handleChooseLoad()}
        className="w-[calc(100%-28px)] cursor-pointer"
      >
        <div className="border border-[#D1DAE6] bg-[#F6F9FE] dark:border-[#2C495A] dark:bg-[#203845] p-2 rounded-xl flex items-center">
          <div
            className="w-[50px]"
            onMouseEnter={() => setChooseTime(false)}
            onMouseLeave={() => setChooseTime(true)}
          >
            <NotificationSettings
              count={load?.results_count}
              theme="acp"
              sound={load?.notification_status}
              onChange={(value) => onChangeNotification(value)}
            />
          </div>
          <div className="w-[calc(100%-50px)] text-xs flex items-center justify-between gap-2 pl-2">
            <div className="flex flex-col text-center">
              {load?.origin ? (
                <>
                  <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                    {load?.origin}
                  </span>
                  <span className="text-[#546172] dark:text-[#899FAC]">
                    {t("dh-o")}: {load?.dh_o ? REFACTOR_SUM(Math.ceil(load?.dh_o)) : "-"}
                  </span>
                </>
              ) : (
                <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">Anywhere</span>
              )}
            </div>
            <div className="flex items-center">
              <div className="bg-[#3F96D0] w-2 h-2 rounded-full" />
              <div className="w-2 h-[2px] bg-[#D1DAE6] dark:bg-[#2C495A]" />
              <span className="px-1 dark:text-[#899FAC]">
                {REFACTOR_SUM(Math.ceil(load?.distance))}
              </span>
              <div className="w-2 h-[2px] bg-[#D1DAE6] dark:bg-[#2C495A]" />
              <div className="bg-[#3F96D0] w-2 h-2 rounded-full" />
            </div>
            <div className="flex flex-col text-center">
              {load?.destination ? (
                <>
                  <span className="text-[#031E30] dark:text-[#ffffff] font-semibold">
                    {load?.destination}
                  </span>
                  <span className="text-[#546172] dark:text-[#899FAC]">
                    {t("dh-d")}: {load?.dh_d ? REFACTOR_SUM(Math.ceil(load?.dh_d)) : "-"}
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

        <div className="text-xs grid grid-cols-[1fr_1fr_minmax(0,_7rem)] gap-3 items-center justify-center text-center pt-2 px-1">
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
  );
};

export default SearchCard;
