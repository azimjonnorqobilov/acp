import { useMutation } from "react-query";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { Fragment, useEffect, useState } from "react";
import {
  SORT_DATA,
  REFACTOR_SUM,
  REFACTOR_DATE,
  TYPES_TO_STRING,
  CHECK_PICKUP_DATE,
} from "assets/constants/constants";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import MUIModal from "components/mui-modal/MUIModal";
import NewPost from "layers/new-post/NewPost";
import Delete from "layers/delete/Delete";
import { Tooltip } from "@mui/material";

const thead = [
  { label: "repost", key: "repost", sort: false },
  { label: "period", key: "time_frame", sort: true },
  { label: "age", key: "age", sort: true },
  { label: "type", key: "type", sort: true },
  { label: "pu-date", key: "pickup_date", sort: true },
  { label: "dh-o", key: "dh_o", sort: true },
  { label: "origin", key: "origin", sort: true },
  { label: "distance", key: "distance", sort: true },
  { label: "destination", key: "destination", sort: true },
  { label: "dh-d", key: "dh_d", sort: true },
  { label: "FTL/LTL", key: "truck_status", sort: true },
  { label: "length", key: "length", sort: true },
  { label: "weight", key: "weight", sort: true },
  { label: "price", key: "price", sort: true },
  { label: "actions", key: "actions", sort: false },
];

function PostitemsOrTrucksTableClassic({
  items,
  onDelete = () => {},
  onRefresh = () => {},
  onUpload = () => {},
  isLoading,
  isDeleting,
  tableLabel = "Results",
  activeItem,
  onChooseItem = () => {},
  refreshStatus,
}) {
  const { t } = useTranslation();
  const [order, setOrder] = useState({ field: "", sort: false });
  const [openModal, setOpenModal] = useState({ open: false, action: "", item: {} });
  const [openLoads, setOpenLoads] = useState([]);
  const [uploadItemId, setUploadItemId] = useState(null);

  const handleOpenModal = (action, item) => setOpenModal({ open: true, action, item });
  const handleCloseModal = () => setOpenModal({ ...openModal, open: false });

  const handleSort = (field) => {
    const newOrder = { field, sort: order?.field === field ? !order?.sort : true };
    setOrder(newOrder);
  };

  const handleChooseItem = (item) => {
    !openLoads?.includes(item?.id)
      ? setOpenLoads([...openLoads, item?.id])
      : setOpenLoads(openLoads?.filter((l) => l !== item?.id));
    onChooseItem(item);
  };

  const { mutate: handleUpload, isLoading: isUploading } = useMutation(
    "upload-item-classic",
    (item) => {
      setUploadItemId(item?.id);
      return onUpload({ ...item, pickup_date: CHECK_PICKUP_DATE(item?.pickup_date) });
    },
    { onSuccess: () => setUploadItemId(null) }
  );

  useEffect(() => {
    handleCloseModal();
  }, [refreshStatus]);

  return (
    <>
      <MUIModal open={openModal?.open}>
        {openModal?.action === "edit" && (
          <NewPost action="edit" load={openModal?.item} onClose={handleCloseModal} />
        )}

        {openModal?.action === "delete" && (
          <Delete
            onDelete={() => onDelete(openModal?.item?.id)}
            onCancel={handleCloseModal}
            isDeleting={isDeleting}
          />
        )}
      </MUIModal>
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
                      className={`px-2 py-1  ${
                        idx === 0 || idx === thead?.length - 1
                          ? "flex justify-center text-center"
                          : ""
                      }`}
                    >
                      <div
                        className={`flex items-center ${
                          idx === 0 || idx === thead?.length - 1 ? "justify-center text-center" : ""
                        } ${
                          item?.sort
                            ? "cursor-pointer hover:text-blue [&>*:nth-child(2)]:hover:fill-blue"
                            : ""
                        }`}
                      >
                        <span>{t(item?.label)}</span>
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
                {SORT_DATA(items, order?.field, order?.sort)?.map((item, idx) => (
                  <Fragment key={idx}>
                    <tr
                      key={idx}
                      className={`cursor-pointer ${
                        activeItem?.id === item?.id
                          ? "bg-[#E6EDF7] dark:bg-[#2C495A]"
                          : openLoads?.includes(item?.id)
                          ? "bg-[#c3cddd] dark:bg-[#2C495A]"
                          : "bg-white dark:bg-[#1A313E]"
                      }`}
                    >
                      <td className="px-2 py-[0.1rem] border-t border-gray_lighter dark:border-[#2C495A]">
                        <Tooltip
                          arrow
                          title={
                            <span className="text-black dark:text-white">
                              {5 - item?.time_frame?.split(":")?.[1] > 0
                                ? `${t("repost-after")} ${5 - item?.time_frame?.split(":")?.[1]}m`
                                : t("ready-repost")}
                            </span>
                          }
                          classes={{ tooltip: "tooltip-style", arrow: "tooltip-arrow-style" }}
                          placement="top"
                        >
                          <button
                            // disabled={item?.time_frame?.split(":")?.[0] < 5}
                            onClick={() =>
                              parseInt(item?.time_frame?.split(":")?.[1], 10) >= 5 &&
                              handleUpload(item)
                            }
                            className={`w-5 h-5 mx-auto relative bg-white border border-gray_lighter flex items-center justify-center rounded-full dark:bg-[#1A313E] dark:border-[#2C495A] ${
                              parseInt(item?.time_frame?.split(":")?.[1], 10) < 5
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer hover:scale-[1.1] transition"
                            }`}
                          >
                            <icons.reload
                              className={`fill-blue w-2 ${
                                item?.id === uploadItemId && isUploading ? "rotation-animation" : ""
                              } `}
                            />
                          </button>
                        </Tooltip>
                      </td>
                      <td
                        onClick={() =>
                          handleChooseItem({
                            ...item,
                            open: activeItem?.id === item?.id && activeItem?.open ? false : true,
                          })
                        }
                        className={`px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A] ${
                          item?.period?.toLocaleLowerCase() === "expired" ? "text-red" : ""
                        }`}
                      >
                        {item?.time_frame || "-"}
                      </td>
                      <td
                        onClick={() =>
                          handleChooseItem({
                            ...item,
                            open: activeItem?.id === item?.id && activeItem?.open ? false : true,
                          })
                        }
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {item?.age ? `${item?.age}h` : "-"}
                      </td>
                      <td
                        onClick={() =>
                          handleChooseItem({
                            ...item,
                            open: activeItem?.id === item?.id && activeItem?.open ? false : true,
                          })
                        }
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {item?.type?.id ? (
                          item?.type?.ext
                        ) : (
                          <Tooltip
                            arrow
                            classes={{ tooltip: "tooltip-style", arrow: "tooltip-arrow-style" }}
                            title={
                              item?.type?.length + item?.type_category?.length > 2 && (
                                <div className="flex flex-col">
                                  {SORT_DATA(item?.type_category, "name")?.length ? (
                                    <div
                                      className={`${
                                        item?.type?.length
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
                                            item?.type?.length > 4 ||
                                            item?.type_category?.length > 4
                                              ? 4
                                              : item?.type?.length && item?.type_category?.length
                                              ? item?.type?.length > item?.type_category?.length
                                                ? item?.type?.length
                                                : item?.type_category?.length
                                              : item?.type?.length || item?.type_category?.length
                                          }, 1fr)`,
                                        }}
                                        className={`grid text-center items-center justify-center gap-1 whitespace-nowrap py-1`}
                                      >
                                        {item?.type_category?.map((c) => (
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
                                  {SORT_DATA(item?.type, "ext")?.length ? (
                                    <div className={`${item?.type_category?.length ? "pt-1" : ""}`}>
                                      <p className="text-black font-bold dark:text-white">
                                        {t("types")}
                                      </p>
                                      <div
                                        style={{
                                          gridTemplateColumns: `repeat(${
                                            item?.type?.length > 4 ||
                                            item?.type_category?.length > 4
                                              ? 4
                                              : item?.type?.length && item?.type_category?.length
                                              ? item?.type?.length > item?.type_category?.length
                                                ? item?.type?.length
                                                : item?.type_category?.length
                                              : item?.type?.length || item?.type_category?.length
                                          }, 1fr)`,
                                        }}
                                        className={`grid text-center items-center justify-center gap-1 whitespace-nowrap py-1`}
                                      >
                                        {item?.type?.map((t) => (
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
                                types: SORT_DATA(item?.type, "ext"),
                                categories: SORT_DATA(item?.type_category, "name"),
                                joinCount: 2,
                              })}
                            </span>
                          </Tooltip>
                        )}
                      </td>
                      <td
                        onClick={() =>
                          handleChooseItem({
                            ...item,
                            open: activeItem?.id === item?.id && activeItem?.open ? false : true,
                          })
                        }
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {item?.pickup_date ? REFACTOR_DATE(item?.pickup_date) : "-"}
                      </td>
                      <td
                        onClick={() =>
                          handleChooseItem({
                            ...item,
                            open: activeItem?.id === item?.id && activeItem?.open ? false : true,
                          })
                        }
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {item?.dh_o ? item?.dh_o : item?.dh_o === 0 ? 0 : "-"}
                      </td>
                      <td
                        onClick={() =>
                          handleChooseItem({
                            ...item,
                            open: activeItem?.id === item?.id && activeItem?.open ? false : true,
                          })
                        }
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {item?.origin || t("anywhere")}
                      </td>
                      <td
                        onClick={() =>
                          handleChooseItem({
                            ...item,
                            open: activeItem?.id === item?.id && activeItem?.open ? false : true,
                          })
                        }
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {REFACTOR_SUM(Math.ceil(item?.distance)) || "-"}
                      </td>
                      <td
                        onClick={() =>
                          handleChooseItem({
                            ...item,
                            open: activeItem?.id === item?.id && activeItem?.open ? false : true,
                          })
                        }
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {item?.destination || t("anywhere")}
                      </td>
                      <td
                        onClick={() =>
                          handleChooseItem({
                            ...item,
                            open: activeItem?.id === item?.id && activeItem?.open ? false : true,
                          })
                        }
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {item?.dh_d ? item?.dh_d : item?.dh_d === 0 ? 0 : "-"}
                      </td>
                      <td
                        onClick={() =>
                          handleChooseItem({
                            ...item,
                            open: activeItem?.id === item?.id && activeItem?.open ? false : true,
                          })
                        }
                        className={`px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A] ${
                          item?.truck_status?.toLowerCase() === "both" ? "capitalize" : "uppercase"
                        }`}
                      >
                        {item?.truck_status
                          ? item?.truck_status?.toLowerCase() === "both"
                            ? item?.truck_status?.toLowerCase()
                            : item?.truck_status?.toUpperCase()
                          : "-"}
                      </td>
                      <td
                        onClick={() =>
                          handleChooseItem({
                            ...item,
                            open: activeItem?.id === item?.id && activeItem?.open ? false : true,
                          })
                        }
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {item?.length ? `${REFACTOR_SUM(item?.length)} ft` : "-"}
                      </td>
                      <td
                        onClick={() =>
                          handleChooseItem({
                            ...item,
                            open: activeItem?.id === item?.id && activeItem?.open ? false : true,
                          })
                        }
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {item?.weight ? `${REFACTOR_SUM(item?.weight)} lbs` : "-"}
                      </td>
                      <td
                        onClick={() =>
                          handleChooseItem({
                            ...item,
                            open: activeItem?.id === item?.id && activeItem?.open ? false : true,
                          })
                        }
                        className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]"
                      >
                        {item?.price ? `$${REFACTOR_SUM(item?.price?.toFixed(2))}` : "-"}
                      </td>
                      <td className="px-2 border-t border-gray_lighter dark:border-[#2C495A]">
                        <div className="flex justify-center items-center">
                          <button
                            onClick={() => onRefresh(item)}
                            className="border-r border-[#F0F2F5] dark:border-[#2C495A] pr-2 transition active:scale-[1.1]"
                          >
                            <icons.refresh className="fill-gray" />
                          </button>
                          <button
                            onClick={() => handleOpenModal("edit", item)}
                            className="border-r border-[#F0F2F5] dark:border-[#2C495A] px-2 transition active:scale-[1.1]"
                          >
                            <icons.pencil className="fill-blue w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenModal("delete", item)}
                            className="pl-2 transition active:scale-[1.1]"
                          >
                            <icons.trash className="fill-red" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* {activeItem?.id === item?.id && activeItem?.open && ( */}
                    {openLoads?.includes(item?.id) && (
                      <tr className="bg-[#F0F5FA] dark:bg-[#243B48]">
                        <td colSpan={15}>
                          <div className="px-8 py-4 flex justify-between items-start gap-4">
                            <div className="grid grid-cols-[5rem_minmax(0,_10rem)] gap-y-2">
                              <span className="text-gray">{t("ref")}: </span>
                              <span className="font-semibold">{item?.ref_number || "-"}</span>
                              <span className="text-gray">{t("dlv-date")}: </span>
                              <span className="font-semibold">
                                {item?.dlv_date ? REFACTOR_DATE(item?.dlv_date) : "-"}
                              </span>
                              <span className="text-gray">{t("commodity")}: </span>
                              <span className="font-semibold">{item?.commodity || "-"}</span>
                            </div>

                            <div className="grid grid-cols-[5rem_minmax(0,_10rem)] gap-y-2 whitespace-pre-wrap">
                              <span className="text-gray">{t("rpm")}: </span>
                              <span className="font-semibold">
                                {item?.price && item?.distance
                                  ? `$${(item?.price / item?.distance)?.toFixed(2)}`
                                  : "-"}
                              </span>
                              <span className="text-gray">{t("description")}:</span>
                              <span className="font-semibold">{item?.comment || "-"}</span>
                            </div>

                            <div className="grid grid-cols-[7rem_minmax(0,_10rem)] gap-y-2">
                              <span className="text-gray">{t("company")}: </span>
                              <span className="font-semibold">{item?.company?.name || "-"}</span>
                              <span className="text-gray">{t("name")}: </span>
                              <span className="font-semibold">{item?.name || "-"}</span>
                              <span className="text-gray">{t("contact")}: </span>
                              <span className="font-semibold">{item?.contact || "-"}</span>
                            </div>

                            <div className="grid grid-cols-[6rem_minmax(0,_10rem)] gap-y-2">
                              <span className="text-gray">{t("mc")}: </span>
                              <span className="font-semibold">{item?.company?.mc || "-"}</span>
                              <span className="text-gray">{t("credit-score")}: </span>
                              <span className="font-semibold ">{item?.credit_score || "-"}</span>
                              <span className="text-gray">{t("status")}: </span>
                              <span className="font-semibold">
                                {item?.status ? <icons.checked className="fill-blue w-4" /> : "-"}
                              </span>
                            </div>

                            {/* <div className="grid grid-cols-[3rem_minmax(0,_10rem)] gap-y-2">
                              <span className="text-gray">RPM: </span>
                              <span className="font-semibold">
                                {item?.price && item?.distance
                                  ? `$${(item?.price / item?.distance)?.toFixed(2)}`
                                  : "-"}
                              </span>
                            </div> */}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full h-full font-bicubik flex items-center justify-center text-2xl text-center text-gray uppercase">
            {t("no-posts")}
          </div>
        )}
      </div>
    </>
  );
}

export default PostitemsOrTrucksTableClassic;
