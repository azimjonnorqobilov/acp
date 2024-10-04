import { icons } from "assets/icons/icons";
import { useLocation } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrucksByCompany } from "store/slices/truckSlice";
import {
  SORT_DATA,
  REFACTOR_SUM,
  REFACTOR_DATE,
  TYPES_TO_STRING,
} from "assets/constants/constants";
import { getLoadsByCompany, getShipperLoadsByCompany } from "store/slices/loadSlice";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import LoadCard from "layers/load-card/LoadCard";
import { Tooltip } from "@mui/material";

const thead = [
  { label: "Age", key: "age", sort: true },
  { label: "PU Date", key: "pickup_date", sort: true },
  { label: "Type", key: "type", sort: true },
  { label: "FTL/LTL", key: "truck_status", sort: true },
  { label: "Origin", key: "origin", sort: true },
  { label: "Distance", key: "distance", sort: true },
  { label: "Destionation", key: "destionation", sort: true },
  { label: "Name", key: "name", sort: true },
  { label: "Contact", key: "contact", sort: true },
  { label: "Length", key: "length", sort: true },
  { label: "Weight", key: "weight", sort: true },
  { label: "Price", key: "price", sort: true },
];

function PostedLoads({ loadsOrTrucks = "" }) {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const {
    auth: { userInfo },
    loads: { loads },
    trucks: { trucks },
    user: {
      companyInformation: { companyInfo },
    },
  } = useSelector((store) => store);
  const [order, setOrder] = useState({ field: "", sort: false });
  const [activePost, setActivePost] = useState(null);

  const currentPath = pathname?.split("/");

  const { isLoading, items } = {
    isLoading: loadsOrTrucks === "loads" ? loads?.isLoadingByCompany : trucks?.isLoadingByCompany,
    items: loadsOrTrucks === "loads" ? loads?.loadsByCompany : trucks?.trucksByCompany,
  };

  const handleSort = (field) => {
    const newOrder = { field, sort: order?.field === field ? !order?.sort : true };
    setOrder(newOrder);
  };

  useEffect(() => {
    (currentPath?.[1] === "carrier" || currentPath?.[1] === "carrier-dispatcher") &&
      dispatch(getLoadsByCompany({ role: userInfo?.entity_type, company: companyInfo?.id }));

    ((currentPath?.[1] === "broker" && currentPath?.[2] !== "shippers-loads") ||
      currentPath?.[1] === "shipper") &&
      dispatch(getTrucksByCompany({ role: userInfo?.entity_type, company: companyInfo?.id }));

    currentPath?.[1] === "broker" &&
      currentPath?.[2] === "shippers-loads" &&
      dispatch(getShipperLoadsByCompany({ role: userInfo?.entity_type, company: companyInfo?.id }));
  }, [companyInfo?.id, userInfo?.entity_type, dispatch]);

  return (
    <div className="w-full h-full border border-gray_lighter rounded-xl overflow-hidden dark:border-green_5 dark:text-white dark:bg-[#1A313E]">
      {isLoading ? (
        <BounceDotsLoader className="h-full" />
      ) : items?.length ? (
        <Fragment>
          <div className="h-full overflow-y-auto table-scrollbar lg:hidden">
            <table className="w-full text-xs whitespace-nowrap ">
              <thead>
                <tr className="font-medium bg-[#F9FCFF] text-gray_dark sticky top-0 dark:bg-[#263A45] dark:text-[#899FAC]">
                  {thead?.map((item, idx) => (
                    <td
                      key={idx}
                      onClick={() => item?.sort && handleSort(item?.key)}
                      className={`px-2 py-1`}
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
                        <span>{item?.label}</span>{" "}
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
                {SORT_DATA(items, order?.field, order?.sort)?.map((post, idx) => (
                  <Fragment key={idx}>
                    <tr
                      onClick={() => setActivePost(activePost?.id !== post?.id ? post : null)}
                      className={`cursor-pointer ${
                        activePost?.id === post?.id
                          ? "bg-[#DDE4ED] dark:bg-[#304D5E]"
                          : "bg-white dark:bg-[#1A313E]"
                      }`}
                    >
                      <td className="px-2 py-[0.3rem] pl-4 border-t border-gray_lighter dark:border-[#2C495A]">
                        {post?.time_frame || "-"}
                      </td>
                      <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                        {post?.pickup_date ? REFACTOR_DATE(post?.pickup_date) : "-"}
                      </td>
                      <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                        {post?.type?.id ? (
                          post?.type?.ext
                        ) : (
                          <Tooltip
                            arrow
                            classes={{ tooltip: "tooltip-style", arrow: "tooltip-arrow-style" }}
                            title={
                              post?.type?.length + post?.type_category?.length > 2 && (
                                <div className="flex flex-col">
                                  {SORT_DATA(post?.type_category, "name")?.length ? (
                                    <div
                                      className={`${
                                        post?.type?.length
                                          ? "border-b border-gray_lighter pb-1"
                                          : ""
                                      }`}
                                    >
                                      <p className="text-black font-bold">Groups</p>
                                      <div
                                        style={{
                                          gridTemplateColumns: `repeat(${
                                            post?.type?.length > 4 ||
                                            post?.type_category?.length > 4
                                              ? 4
                                              : post?.type?.length && post?.type_category?.length
                                              ? post?.type?.length > post?.type_category?.length
                                                ? post?.type?.length
                                                : post?.type_category?.length
                                              : post?.type?.length || post?.type_category?.length
                                          }, 1fr)`,
                                        }}
                                        className={`grid text-center items-center justify-center gap-1 whitespace-nowrap py-1`}
                                      >
                                        {post?.type_category?.map((c) => (
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
                                  {SORT_DATA(post?.type, "ext")?.length ? (
                                    <div className={`${post?.type_category?.length ? "pt-1" : ""}`}>
                                      <p className="text-black font-bold">Types</p>
                                      <div
                                        style={{
                                          gridTemplateColumns: `repeat(${
                                            post?.type?.length > 4 ||
                                            post?.type_category?.length > 4
                                              ? 4
                                              : post?.type?.length && post?.type_category?.length
                                              ? post?.type?.length > post?.type_category?.length
                                                ? post?.type?.length
                                                : post?.type_category?.length
                                              : post?.type?.length || post?.type_category?.length
                                          }, 1fr)`,
                                        }}
                                        className={`grid text-center items-center justify-center gap-1 whitespace-nowrap py-1`}
                                      >
                                        {post?.type?.map((t) => (
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
                                types: SORT_DATA(post?.type, "ext"),
                                categories: SORT_DATA(post?.type_category, "name"),
                                joinCount: 2,
                              })}
                            </span>
                          </Tooltip>
                        )}
                      </td>
                      <td
                        className={`px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A] ${
                          post?.truck_status?.toLowerCase() === "both" ? "capitalize" : "uppercase"
                        }`}
                      >
                        {post?.truck_status
                          ? post?.truck_status?.toLowerCase() === "both"
                            ? post?.truck_status?.toLowerCase()
                            : post?.truck_status?.toUpperCase()
                          : "-"}
                      </td>
                      <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                        {post?.origin || "-"}
                      </td>
                      <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                        {REFACTOR_SUM(Math.ceil(post?.distance)) || "-"}
                      </td>
                      <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                        {post?.destination || "-"}
                      </td>
                      <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                        {post?.name || "-"}
                      </td>
                      <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A] text-blue">
                        {post?.contact || "-"}
                      </td>
                      <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                        {post?.length ? `${REFACTOR_SUM(post?.length)} ft` : "-"}
                      </td>
                      <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                        {post?.weight ? `${REFACTOR_SUM(post?.weight)} lbs` : "-"}
                      </td>
                      <td className="px-2 py-[0.3rem] border-t border-gray_lighter dark:border-[#2C495A]">
                        {post?.price ? `$${REFACTOR_SUM(post?.price)}` : "-"}
                      </td>
                    </tr>
                    {activePost?.id === post?.id && (
                      <tr className="bg-[#F0F5FA] dark:bg-[#243B48]">
                        <td colSpan={12}>
                          <div className="p-4 flex items-start justify-between gap-4">
                            <div className="grid grid-cols-[5rem_minmax(0,_5rem)] gap-y-2">
                              <span className="text-gray">REF#: </span>
                              <span className="font-bold">{post?.ref_number || "-"}</span>
                              <span className="text-gray">DLV Date: </span>
                              <span className="font-bold ">
                                {post?.dlv_date ? REFACTOR_DATE(post?.dlv_date) : "-"}
                              </span>
                              <span className="text-gray">Commodity: </span>
                              <span className="font-bold">{post?.commodity || "-"}</span>
                            </div>

                            <div className="grid grid-cols-[5rem_minmax(0,_10rem)] gap-y-1 whitespace-pre-wrap">
                              <span className="text-gray ">Description:</span>
                              <span className="font-bold">{post?.comment || "-"}</span>
                            </div>

                            <div className="grid grid-cols-[3rem_minmax(0,_5rem)] gap-y-2">
                              <span className="text-gray">RPM: </span>
                              <span className="font-bold">
                                {post?.price && post?.distance
                                  ? `$${(post?.price / post?.distance)?.toFixed(2)}`
                                  : "-"}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="h-full overflow-y-auto table-scrollbar hidden lg:block">
            {items?.map((item) => (
              <LoadCard
                key={item?.id}
                load={item}
                active={item?.id === activePost?.id ? true : false}
                companyReview={false}
                onChooseLoad={() => setActivePost(item?.id === activePost?.id ? null : item)}
              />
            ))}
          </div>
        </Fragment>
      ) : (
        <div className="w-full h-full font-bicubik flex items-center justify-center text-2xl text-center text-gray uppercase">
          Results not found
        </div>
      )}
    </div>
  );
}

export default PostedLoads;
