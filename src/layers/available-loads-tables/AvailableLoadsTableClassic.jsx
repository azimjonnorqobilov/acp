import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { Fragment, useCallback, useRef, useState } from "react";
import { REFACTOR_SUM, REFACTOR_DATE, TYPES_TO_STRING } from "assets/constants/constants";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import CompanyReview from "layers/company-review/CompanyReview";
import AntSwitch from "components/mui-switch/AntSwitch";
import MUIModal from "components/mui-modal/MUIModal";
import Select from "components/select/Select";
import { BarLoader } from "react-spinners";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";

const thead = [
  { label: "age", key: "time_frame", sort: true },
  { label: "pu-date", key: "pickup_date", sort: true },
  { label: "type", key: "type", sort: true },
  { label: "FTL/LTL", key: "truck_status", sort: true },
  { label: "dh-o", key: "dh_o", sort: true },
  { label: "origin", key: "origin", sort: true },
  { label: "distance", key: "distance", sort: true },
  { label: "destination", key: "destination", sort: true },
  { label: "dh-d", key: "dh_d", sort: true },
  { label: "company", key: "company_name", sort: true },
  { label: "contact", key: "contact", sort: true },
  { label: "length", key: "length", sort: true },
  { label: "weight", key: "weight", sort: true },
  { label: "price", key: "price", sort: true },
  { label: "status", key: "status", sort: true },
];

function AvailableLoadsTableClassic({
  type = "loads",
  items = [],
  sort,
  onSort,
  isLoading,
  itemsCount,
  tableLabel = "Results",
  hasNextPage,
  loadingNextPage,
  refetchingConfig,
  setRefetchingConfig,
}) {
  const observer = useRef();
  const { t } = useTranslation();
  const [activeItems, setActiveItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleChooseItems = (item) => {
    setActiveItem(item);
    !activeItems?.includes(item?.id)
      ? setActiveItems([...activeItems, item?.id])
      : setActiveItems(activeItems?.filter((p) => p !== item?.id));
  };

  const lastItemRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          loadingNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage]
  );

  return (
    <>
      <MUIModal open={openModal}>
        <CompanyReview item={activeItem} onClose={handleCloseModal} />
      </MUIModal>
      <div className="w-full h-full flex flex-col dark:text-white">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold">
            {itemsCount
              ? `${t("available")} ${t(tableLabel)}: ${itemsCount}`
              : `${t("available")} ${t(tableLabel)}`}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs border-r border-gray_lighter dark:border-[#2C495A] pr-2">
              <span>Auto Refresh</span>
            </div>
            <AntSwitch
              checked={!!refetchingConfig?.refetchInterval}
              onChange={() =>
                setRefetchingConfig({
                  ...refetchingConfig,
                  refetchInterval: refetchingConfig?.refetchInterval ? false : 15 * 1000,
                })
              }
            />
            <Select
              value={refetchingConfig?.refetchInterval}
              disabled={!refetchingConfig?.refetchInterval}
              onChange={(e) =>
                setRefetchingConfig({
                  ...refetchingConfig,
                  refetchInterval: parseInt(e.target.value, 10),
                })
              }
              options={[
                { label: "15s", value: 15 * 1000 },
                { label: "30s", value: 30 * 1000 },
                { label: "45s", value: 45 * 1000 },
                { label: "60s", value: 60 * 1000 },
              ]}
              className="!text-xs"
              classNameSelect="bg-arrow-down-black dark:bg-arrow-down-white bg-left bg-[center_left_0.75rem] px-2 py-0"
            />
          </div>
        </div>
        <div className="h-[calc(100%-21px)] mt-1 rounded-xl overflow-hidden border border-gray_lighter bg-white  dark:border-green_5 dark:bg-[#1A313E]">
          {isLoading ? (
            <BounceDotsLoader className="h-full" />
          ) : items?.length ? (
            <div className="h-full overflow-y-auto table-scrollbar">
              <table className="w-full text-xs whitespace-nowrap">
                <thead>
                  <tr className="font-medium bg-[#F9FCFF] text-gray_dark sticky top-0 dark:bg-[#263A45] dark:text-[#899FAC]">
                    {thead?.map((item, idx) => (
                      <td
                        key={idx}
                        onClick={() => item?.sort && onSort(item?.key)}
                        className={`px-2 py-1`}
                      >
                        <div
                          className={`flex items-center ${
                            idx === 0 || idx === thead?.length - 1
                              ? "text-center justify-center"
                              : ""
                          } ${
                            item?.sort
                              ? "cursor-pointer hover:text-blue [&>*:nth-child(2)]:hover:fill-blue"
                              : ""
                          }`}
                        >
                          <span>{t(item?.label)}</span>{" "}
                          {item?.sort && (
                            <>
                              {" "}
                              <icons.arrowLeft
                                className={`fill-black dark:fill-[#899FAC] w-3  ${
                                  sort?.field === item?.key ? "visible" : "invisible"
                                } ${sort?.sort ? "-rotate-90" : "rotate-90"}`}
                              />
                            </>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items?.map((load, idx) => (
                    <Fragment key={idx}>
                      <tr
                        onClick={() => handleChooseItems(load)}
                        className={`cursor-pointer ${load?.unread ? "font-bold" : ""} ${
                          activeItem?.id === load?.id
                            ? "bg-[#E6EDF7] dark:bg-[#304D5E]"
                            : activeItems?.includes(load?.id)
                            ? "bg-[#c3cddd] dark:bg-[#2C495A]"
                            : "bg-white dark:bg-[#1A313E]"
                        }`}
                      >
                        <td className="px-2 py-[0.3rem] border-t border-gray_lighter text-center dark:border-[#2C495A]">
                          {load?.time_frame || "-"}
                        </td>
                        <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                          {load?.pickup_date ? REFACTOR_DATE(load?.pickup_date) : "-"}
                        </td>
                        <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
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
                                        <p className="text-black font-bold dark:text-white">
                                          {t("groups")}
                                        </p>
                                        <div
                                          style={{
                                            gridTemplateColumns: `repeat(${
                                              load?.type?.length > 4 ||
                                              load?.type_category?.length > 4
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
                                    {load?.type?.length ? (
                                      <div
                                        className={`${load?.type_category?.length ? "pt-1" : ""}`}
                                      >
                                        <p className="text-black font-bold dark:text-white">
                                          {t("types")}
                                        </p>
                                        <div
                                          style={{
                                            gridTemplateColumns: `repeat(${
                                              load?.type?.length > 4 ||
                                              load?.type_category?.length > 4
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
                                  types: load?.type,
                                  categories: load?.type_category,
                                  joinCount: 2,
                                })}
                              </span>
                            </Tooltip>
                          )}
                        </td>
                        <td
                          className={`px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A] ${
                            load?.truck_status?.toLowerCase() === "both"
                              ? "capitalize"
                              : "uppercase"
                          }`}
                        >
                          {load?.truck_status
                            ? load?.truck_status?.toLowerCase() === "both"
                              ? load?.truck_status?.toLowerCase()
                              : load?.truck_status?.toUpperCase()
                            : "-"}
                        </td>
                        <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                          {load?.dh_o
                            ? REFACTOR_SUM(Math.ceil(load?.dh_o))
                            : load?.dh_o === 0
                            ? 0
                            : "-"}
                        </td>
                        <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                          {load?.origin || t("anywhere")}
                        </td>
                        <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                          {load?.distance ? REFACTOR_SUM(Math.ceil(load?.distance)) : "-"}
                        </td>
                        <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                          {load?.destination || t("anywhere")}
                        </td>
                        <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                          {load?.dh_d
                            ? REFACTOR_SUM(Math.ceil(load?.dh_d))
                            : load?.dh_d === 0
                            ? 0
                            : "-"}
                        </td>
                        <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                          {load?.company?.name ? (
                            load?.company?.name?.length <= 27 ? (
                              load?.company?.name
                            ) : (
                              <Tooltip
                                arrow
                                title={
                                  <span className="text-black dark:text-white">
                                    {load?.company?.name}
                                  </span>
                                }
                                classes={{ tooltip: "tooltip-style", arrow: "tooltip-arrow-style" }}
                                placement="top"
                              >
                                <span>{load?.company?.name?.substr(0, 27)}...</span>
                              </Tooltip>
                            )
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A] text-blue">
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
                              <Link
                                onClick={(e) => e.stopPropagation()}
                                to={`tel:${load?.contact}`}
                              >
                                {load?.contact}
                              </Link>
                            )
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                          {load?.length ? `${REFACTOR_SUM(load?.length)} ft` : "-"}
                        </td>
                        <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                          {load?.weight ? `${REFACTOR_SUM(load?.weight)} lbs` : "-"}
                        </td>
                        <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                          {load?.price ? `$${REFACTOR_SUM(load?.price?.toFixed(2))}` : "-"}
                        </td>
                        <td className="px-2 py-[0.3rem] text-center border-t border-gray_lighter dark:border-[#2C495A]">
                          {load?.status ? (
                            <div className="flex items-center justify-center">
                              <icons.checked className="fill-blue w-4" />
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                      {activeItems?.includes(load?.id) && (
                        <tr className="bg-[#F0F5FA] dark:bg-[#243B48]">
                          <td colSpan={15}>
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
                                  onClick={handleOpenModal}
                                  className="whitespace-nowrap bg-white border border-blue rounded-lg px-2 py-1 text-blue uppercase text-xs dark:bg-[#1A313E]"
                                >
                                  {t("company-review")}
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                  {hasNextPage && (
                    <tr ref={lastItemRef}>
                      <td colSpan={15} className="w-full h-2 py-1">
                        <div className="w-full h-full flex items-end">
                          <BarLoader width="100%" height={10} color="#87C0E7" />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="w-full h-full font-bicubik flex items-center justify-center text-2xl text-center text-gray uppercase">
              {t(tableLabel)} {t("not-found")}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AvailableLoadsTableClassic;
