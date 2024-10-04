import { useQuery } from "react-query";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getTrucks, getTruck, getSearchTruck } from "store/slices/truckSlice";
import {
  getLoad,
  getLoads,
  getSearchLoad,
  getShipperLoad,
  getShipperLoads,
  getSearchShipperLoad,
} from "store/slices/loadSlice";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import AntSwitch from "components/mui-switch/AntSwitch";
import LoadCard from "layers/load-card/LoadCard";
import Select from "components/select/Select";
import { BarLoader } from "react-spinners";

function AvailableLoadsOrTrucks() {
  const { t } = useTranslation();
  const observer = useRef();
  const param = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const {
    auth: { userInfo },
    loads: { loads, searchLoads },
    trucks: { trucks, searchTrucks },
    theme: {
      device: { deviceType },
    },
  } = useSelector((store) => store);
  const [activeLoad, setActiveLoad] = useState(null);
  const [refetchingConfig, setRefetchingConfig] = useState({
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
  });

  console.log(refetchingConfig);

  const currentPath = pathname?.split("/");

  const prevPath = pathname?.split("/");

  const { items, activeItem, pagination } = {
    ...((currentPath?.[1] === "broker" || currentPath?.[1] === "shipper") &&
      currentPath?.[2] === "available-trucks" && {
        items: trucks?.trucks,
        isLoading: trucks?.isLoading,
        activeItem: loads?.activeLoad,
        pagination: trucks?.trucksPagination,
      }),

    ...(["broker", "find-trucks", "available-trucks"]?.every((e) => pathname?.includes(e)) && {
      items: trucks?.trucks,
      isLoading: trucks?.isLoading,
      activeItem: searchTrucks?.activeSearchTruck,
      pagination: trucks?.trucksPagination,
    }),

    ...(["carrier", "carrier-dispatcher"]?.some((e) => pathname?.includes(e)) &&
      ["available-loads"]?.every((e) => pathname?.includes(e)) && {
        items: loads?.loads,
        isLoading: loads?.isLoading,
        activeItem: searchLoads?.activeSearchLoad,
        pagination: loads?.loadsPagination,
      }),

    ...(["carrier", "post-trucks"]?.every((e) => pathname?.includes(e)) && {
      items: loads?.loads,
      isLoading: loads?.isLoading,
      activeItem: trucks?.activeTruck,
      pagination: loads?.loadsPagination,
    }),

    ...(["broker", "shippers-loads", "available-loads"]?.every((e) => pathname?.includes(e)) && {
      items: loads?.loads,
      isLoading: loads?.isLoading,
      activeItem: searchLoads?.activeSearchLoad,
      pagination: loads?.loadsPagination,
    }),
  };

  const handleGetLoadsOrTrucks = (page, availableLoad) => {
    if (
      ["carrier", "carrier-dispatcher"]?.some((e) => pathname?.includes(e)) &&
      currentPath?.[2] === "available-loads"
    ) {
      return dispatch(
        getLoads({
          role: userInfo?.entity_type,
          by_search: param?.id,
          pagination: { page, page_size: 100 },
          availableLoad,
        })
      );
    }

    if (currentPath?.[1] === "carrier" && currentPath?.[2] === "post-trucks") {
      return dispatch(
        getLoads({
          role: userInfo?.entity_type,
          by_truck: param?.id,
          pagination: { page, page_size: 100 },
          availableLoad,
        })
      );
    }

    if (currentPath?.[1] === "broker" && currentPath?.[2] === "available-trucks") {
      return dispatch(
        getTrucks({
          role: userInfo?.entity_type,
          by_load: param?.id,
          pagination: { page, page_size: 100 },
          availableLoad,
        })
      );
    }

    if (
      (currentPath?.[1] === "shipper" && currentPath?.[2] === "available-trucks") ||
      ["broker", "find-trucks", "available-trucks"]?.every((e) => pathname?.includes(e))
    ) {
      return dispatch(
        getTrucks({
          role: userInfo?.entity_type,
          by_shipper_load: param?.id,
          pagination: { page, page_size: 100 },
          availableLoad,
        })
      );
    }

    if (["broker", "shippers-loads", "available-loads"]?.every((e) => pathname?.includes(e))) {
      return dispatch(
        getShipperLoads({
          role: userInfo?.entity_type,
          by_search: param?.id,
          pagination: { page, page_size: 100 },
          availableLoad,
        })
      );
    }
  };

  const handleGetCurrentLoadOrTruck = () => {
    if (param?.id && ["carrier", "post-trucks"]?.every((e) => pathname?.includes(e)))
      return dispatch(getTruck({ role: userInfo?.entity_type, truckId: param?.id }));

    if (
      param?.id &&
      (currentPath?.[1] === "carrier" || currentPath?.[1] === "carrier-dispatcher") &&
      currentPath?.[2] === "available-loads"
    )
      return dispatch(getSearchLoad({ role: userInfo?.entity_type, loadId: param?.id }));

    if (param?.id && currentPath?.[1] === "broker" && currentPath?.[2] === "available-trucks")
      return dispatch(getLoad({ role: userInfo?.entity_type, loadId: param?.id }));

    if (param?.id && ["broker", "find-trucks"]?.every((e) => pathname?.includes(e)))
      return dispatch(getSearchTruck({ role: userInfo?.entity_type, truckId: param?.id }));

    if (param?.id && currentPath?.[1] === "shipper" && currentPath?.[2] === "available-trucks")
      return dispatch(getShipperLoad({ role: userInfo?.entity_type, loadId: param?.id }));

    if (
      param?.id &&
      ["broker", "shippers-loads", "available-loads"]?.every((e) => pathname?.includes(e))
    )
      return dispatch(
        getSearchShipperLoad({ role: userInfo?.entity_type, searchLoadId: param?.id })
      );
  };

  useQuery(
    ["get-current-load-or-truck", param?.id, userInfo?.entity_type, refetchingConfig],
    handleGetCurrentLoadOrTruck,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading, isRefetching, refetch } = useQuery(
    ["get-avaliable-loads-or-trucks", param?.id, userInfo?.entity_type],
    () => handleGetLoadsOrTrucks(1),
    {
      ...refetchingConfig,
    }
  );

  prevPath?.pop();

  useEffect(() => {
    deviceType === "desktop" && navigate(prevPath?.join("/"));
  }, [navigate, deviceType, prevPath]);

  const lastItemRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination?.next) {
          handleGetLoadsOrTrucks(pagination?.page + 1, true);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, pagination?.next]
  );

  return (
    <div className="w-full h-full px-2 pb-2 flex flex-col">
      <div className="w-full flex gap-2">
        <button
          onClick={() => navigate(-1)}
          className="bg-white dark:bg-[#2C495A] w-10 p-2 min-h-[2.5rem] rounded-lg flex justify-center items-center"
        >
          <icons.arrowLeft className="fill-black dark:fill-white" />
        </button>
        {param?.id ? (
          <div className="p-2 flex flex-1 items-center justify-between bg-white dark:bg-[#2C495A] dark:text-white rounded-lg text-center text-sm">
            <span className="flex-1">{activeItem?.origin || t("anywhere")}</span>
            <div className="flex-[0.5] flex items-center px-2">
              <div className="bg-[#3F96D0] w-2 h-2 rounded-full" />
              <div className="w-[calc(100%-1rem)] h-[2px] bg-[#D1DAE6] dark:bg-[#4A6778]" />
              <div className="bg-[#3F96D0] w-2 h-2 rounded-full" />
            </div>
            <span className="flex-1">{activeItem?.destination || t("anywhere")}</span>
          </div>
        ) : (
          <div className="p-2 flex flex-1 items-center justify-center bg-white dark:bg-[#2C495A] dark:text-white rounded-lg text-center text-sm uppercase font-bold">
            {t("total-results")}
          </div>
        )}
        <button
          onClick={refetch}
          className="bg-white dark:bg-[#2C495A] w-10 p-2 min-h-[2.5rem] rounded-lg flex justify-center items-center"
        >
          <icons.refresh className="dark:fill-white" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs py-1 font-bold dark:text-white">
          {t("available")}{" "}
          {currentPath?.[1] === "carrier" ||
          (currentPath?.[1] === "broker" && currentPath?.[2] === "shippers-loads")
            ? t("loads")
            : t("trucks")}
          {pagination?.count ? `: ${pagination?.count}` : ""}
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
      <div className="flex-1 border border-[#BECDE1] rounded-xl overflow-hidden bg-white dark:bg-[#1A313E] dark:border-green_5">
        {isLoading || isRefetching ? (
          <BounceDotsLoader className="h-full" />
        ) : items?.length ? (
          <div className="h-full overflow-y-scroll table-scrollbar flex flex-col">
            {items?.map((item) => (
              <LoadCard
                key={item?.id}
                load={item}
                active={activeLoad?.id === item?.id ? true : false}
                activeLoad={activeLoad}
                onChooseLoad={() => setActiveLoad(activeLoad?.id === item?.id ? null : item)}
              />
            ))}
            {pagination?.next && (
              <div ref={lastItemRef}>
                <BarLoader width="100%" height={10} color="#87C0E7" />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full font-bicubik flex items-center justify-center text-2xl text-center text-gray uppercase">
            {t("result-not-found")}
          </div>
        )}
      </div>
    </div>
  );
}

export default AvailableLoadsOrTrucks;
