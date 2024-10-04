import { icons } from "assets/icons/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SORT_DATA,
  REFACTOR_SUM,
  REFACTOR_DATE,
  TYPES_TO_STRING,
} from "assets/constants/constants";
import NotificationSettings from "components/notification-settings/NotificationSettings";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import MUIModal from "components/mui-modal/MUIModal";
import NewSearch from "layers/new-search/NewSearch";
import Delete from "layers/delete/Delete";
import { Tooltip } from "@mui/material";

const thead = [
  { label: "set-alert", key: "set-alert", sort: false },
  { label: "age", key: "age", sort: true },
  { label: "type", key: "type", sort: true },
  { label: "pu-date", key: "pickup_date", sort: true },
  { label: "dh-o", key: "dh_o", sort: true },
  { label: "origin", key: "origin", sort: true },
  { label: "distance", key: "distance", sort: true },
  { label: "destination", key: "destionation", sort: true },
  { label: "dh-d", key: "dh_d", sort: true },
  { label: "FTL/LTL", key: "truck_status", sort: true },
  { label: "length", key: "length", sort: true },
  { label: "weight", key: "weight", sort: true },
  { label: "actions", key: "actions", sort: false },
];

function SearchLoadsOrTrucksTableClassic({
  items,
  onDelete = () => {},
  onRefresh = () => {},
  isLoading,
  isDeleting,
  activeItem,
  tableLabel = "Results",
  refreshStatus,
  onChooseItem = () => {},
  onChangeNotification = () => {},
}) {
  const { t } = useTranslation();
  const [order, setOrder] = useState({ field: "", sort: false });
  const [openModal, setOpenModal] = useState({ open: false, action: "", item: {} });

  const handleOpenModal = (action, item) => setOpenModal({ open: true, action, item });
  const handleCloseModal = () => setOpenModal({ ...openModal, open: false });

  const handleSort = (field) => {
    const newOrder = { field, sort: order?.field === field ? !order?.sort : true };
    setOrder(newOrder);
  };

  useEffect(() => {
    handleCloseModal();
  }, [refreshStatus]);

  return (
    <>
      <MUIModal open={openModal?.open}>
        {openModal?.action === "edit" && (
          <NewSearch action="edit" load={openModal?.item} onClose={handleCloseModal} />
        )}

        {openModal?.action === "delete" && (
          <Delete
            onDelete={() => onDelete(openModal?.item?.id)}
            onCancel={handleCloseModal}
            isDeleting={isDeleting}
          />
        )}
      </MUIModal>
      <div className="w-full h-full flex flex-col dark:text-white">
        <div className="w-full h-full flex flex-col dark:text-white dark:bg-[#1A313E]">
          {isLoading ? (
            <BounceDotsLoader className="h-full" />
          ) : items?.length ? (
            <div className="h-full overflow-y-auto table-scrollbar">
              <table className="w-full text-xs whitespace-nowrap">
                <thead>
                  <tr className="font-medium z-10 bg-[#F9FCFF] text-gray_dark sticky top-0 dark:bg-[#263A45] dark:text-[#899FAC]">
                    {thead?.map((item, idx) => (
                      <td
                        key={idx}
                        onClick={() => item?.sort && handleSort(item?.key)}
                        className={`px-2 py-1`}
                      >
                        <div
                          className={`flex items-center ${
                            idx === 0 || idx === thead?.length - 1
                              ? "justify-center text-center"
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
                                  order?.field === item?.key ? "visible" : "invisible"
                                } ${order?.sort ? "-rotate-90" : "rotate-90"}`}
                              />
                            </>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SORT_DATA(items, order?.field, order?.sort)?.map((truck, idx) => (
                    <tr
                      key={idx}
                      className={`cursor-pointer ${
                        activeItem?.id === truck?.id
                          ? "bg-[#E6EDF7] dark:bg-[#2C495A]"
                          : "bg-white dark:bg-[#1A313E]"
                      }`}
                    >
                      <td className="px-2 py-[0.1rem] border-t border-gray_lighter dark:border-[#2C495A]">
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center"
                        >
                          <NotificationSettings
                            count={truck?.results_count}
                            sound={truck?.notification_status}
                            onChange={(notification_status) =>
                              onChangeNotification(truck?.id, notification_status)
                            }
                          />
                        </div>
                      </td>
                      <td
                        onClick={() => activeItem?.id !== truck?.id && onChooseItem(truck)}
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {truck?.age ? `${truck?.age}h` : "-"}
                      </td>
                      <td
                        onClick={() => activeItem?.id !== truck?.id && onChooseItem(truck)}
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {truck?.type?.id ? (
                          truck?.type?.ext
                        ) : (
                          <Tooltip
                            arrow
                            classes={{ tooltip: "tooltip-style", arrow: "tooltip-arrow-style" }}
                            title={
                              truck?.type?.length + truck?.type_category?.length > 2 && (
                                <div className="flex flex-col">
                                  {SORT_DATA(truck?.type_category, "name")?.length ? (
                                    <div
                                      className={`${
                                        truck?.type?.length
                                          ? "border-b border-gray_lighter pb-1 dark:border-green_8"
                                          : ""
                                      }`}
                                    >
                                      <p className="text-black font-bold dark:text-white">
                                        {t("groups")}
                                      </p>
                                      <div
                                        style={{
                                          gridTemplateColumns: `repeat(${
                                            truck?.type?.length > 4 ||
                                            truck?.type_category?.length > 4
                                              ? 4
                                              : truck?.type?.length && truck?.type_category?.length
                                              ? truck?.type?.length > truck?.type_category?.length
                                                ? truck?.type?.length
                                                : truck?.type_category?.length
                                              : truck?.type?.length || truck?.type_category?.length
                                          }, 1fr)`,
                                        }}
                                        className={`grid text-center items-center justify-center gap-1 whitespace-nowrap py-1`}
                                      >
                                        {truck?.type_category?.map((c) => (
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
                                  {SORT_DATA(truck?.type, "ext")?.length ? (
                                    <div
                                      className={`${truck?.type_category?.length ? "pt-1" : ""}`}
                                    >
                                      <p className="text-black font-bold dark:text-white">
                                        {t("types")}
                                      </p>
                                      <div
                                        style={{
                                          gridTemplateColumns: `repeat(${
                                            truck?.type?.length > 4 ||
                                            truck?.type_category?.length > 4
                                              ? 4
                                              : truck?.type?.length && truck?.type_category?.length
                                              ? truck?.type?.length > truck?.type_category?.length
                                                ? truck?.type?.length
                                                : truck?.type_category?.length
                                              : truck?.type?.length || truck?.type_category?.length
                                          }, 1fr)`,
                                        }}
                                        className={`grid text-center items-center justify-center gap-1 whitespace-nowrap py-1`}
                                      >
                                        {truck?.type?.map((t) => (
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
                                types: SORT_DATA(truck?.type, "ext"),
                                categories: SORT_DATA(truck?.type_category, "name"),
                                joinCount: 2,
                              })}
                            </span>
                          </Tooltip>
                        )}
                      </td>
                      <td
                        onClick={() => activeItem?.id !== truck?.id && onChooseItem(truck)}
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {truck?.pickup_date ? REFACTOR_DATE(truck?.pickup_date) : "-"}
                      </td>
                      <td
                        onClick={() => activeItem?.id !== truck?.id && onChooseItem(truck)}
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {truck?.dh_o ? truck?.dh_o : truck?.dh_o === 0 ? 0 : "-"}
                      </td>
                      <td
                        onClick={() => activeItem?.id !== truck?.id && onChooseItem(truck)}
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {truck?.origin || t("anywhere")}
                      </td>
                      <td
                        onClick={() => activeItem?.id !== truck?.id && onChooseItem(truck)}
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {REFACTOR_SUM(Math.ceil(truck?.distance)) || "-"}
                      </td>
                      <td
                        onClick={() => activeItem?.id !== truck?.id && onChooseItem(truck)}
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {truck?.destination || t("anywhere")}
                      </td>
                      <td
                        onClick={() => activeItem?.id !== truck?.id && onChooseItem(truck)}
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {truck?.dh_d ? truck?.dh_d : truck?.dh_d === 0 ? 0 : "-"}
                      </td>
                      <td
                        onClick={() => activeItem?.id !== truck?.id && onChooseItem(truck)}
                        className={`px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A] ${
                          truck?.truck_status?.toLowerCase() === "both" ? "capitalize" : "uppercase"
                        }`}
                      >
                        {truck?.truck_status
                          ? truck?.truck_status?.toLowerCase() === "both"
                            ? truck?.truck_status?.toLowerCase()
                            : truck?.truck_status?.toUpperCase()
                          : "-"}
                      </td>
                      <td
                        onClick={() => activeItem?.id !== truck?.id && onChooseItem(truck)}
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {truck?.length ? `${REFACTOR_SUM(truck?.length)} ft` : "-"}
                      </td>
                      <td
                        onClick={() => activeItem?.id !== truck?.id && onChooseItem(truck)}
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {truck?.weight ? `${REFACTOR_SUM(truck?.weight)} lbs` : "-"}
                      </td>
                      <td className="px-2 py-[0.1rem] border-t border-gray_lighter dark:border-[#2C495A]">
                        <div className="flex justify-center items-center">
                          <button
                            onClick={(e) => {
                              onRefresh(truck);
                              e.stopPropagation();
                            }}
                            className="border-r border-[#F0F2F5] dark:border-[#2C495A] pr-2 transition active:scale-[1.1]"
                          >
                            <icons.refresh className="fill-gray" />
                          </button>
                          <button
                            onClick={(e) => {
                              handleOpenModal("edit", truck);
                              e.stopPropagation();
                            }}
                            className="border-r border-[#F0F2F5] dark:border-[#2C495A] px-2 transition active:scale-[1.1]"
                          >
                            <icons.pencil className="fill-blue w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              handleOpenModal("delete", truck);
                              e.stopPropagation();
                            }}
                            className="pl-2 transition active:scale-[1.1]"
                          >
                            <icons.trash className="fill-red" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="w-full h-full font-bicubik flex items-center justify-center text-2xl text-center text-gray uppercase">
              {t("no-searches")}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchLoadsOrTrucksTableClassic;
