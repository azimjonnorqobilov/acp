import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTrucks } from "store/slices/truckSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  chooseLoad,
  getShipperLoads,
  deleteShipperLoad,
  updateShipperLoad,
} from "store/slices/loadSlice";
import PostLoadsOrTrucksTableClassic from "layers/post-loads-tables/PostLoadsOrTrucksTableClassic";
import AvailableLoadsTableClassic from "layers/available-loads-tables/AvailableLoadsTableClassic";
import PostLoadsOrTrucksTableEsp from "layers/post-loads-tables/PostLoadsOrTrucksTableEsp";
import SplitContainer from "components/split-container/SplitContainer";

function PostShippersLoads() {
  const { t } = useTranslation(0);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {
    auth: { userInfo },
    loads: { loads },
    trucks: { trucks },
    theme: {
      themeType,
      device: { deviceType },
    },
  } = useSelector((store) => store);
  const [firstRequest, setFirstRequest] = useState(false);
  const [refetchingConfig, setRefetchingConfig] = useState({
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
  });
  const [sortAvailableLoads, setSortAvailableLoads] = useState({ field: null, sort: true });

  document.title = t("post-loads");

  const { isLoading: isLoadingShipperLoads, refetch: onRefetchGetShipperLoads } = useQuery(
    ["get-shipper-loads", userInfo?.entity_type],
    (props) => {
      setFirstRequest(true);
      return dispatch(
        getShipperLoads({
          role: userInfo?.entity_type,
          execute: firstRequest,
          pagination: { page: 1, page_size: 1000 },
        })
      );
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval: 10 * 1000,
      refetchIntervalInBackground: true,
    }
  );

  const { isLoading: isLoadingTrucks, isRefetching: isRefetchingTrucks } = useQuery(
    [
      "get-available-trucks",
      deviceType,
      sortAvailableLoads,
      loads?.activeLoad?.id,
      userInfo?.entity_type,
    ],
    () =>
      deviceType === "desktop" &&
      dispatch(
        getTrucks({
          role: userInfo?.entity_type,
          ordering: sortAvailableLoads?.field
            ? `${sortAvailableLoads?.sort ? "" : "-"}${sortAvailableLoads?.field}`
            : "",
          by_shipper_load: loads?.activeLoad?.id,
          pagination: { page: 1, page_size: 100 },
        })
      ),
    {
      ...refetchingConfig,
    }
  );

  const { mutate: handleGetTrucksOnScroll, isLoading: isLoadingGetTrucksOnScroll } = useMutation(
    "get-loads-on-scroll",
    () => {
      dispatch(
        getTrucks({
          role: userInfo?.entity_type,
          ordering: sortAvailableLoads?.field
            ? `${sortAvailableLoads?.sort ? "" : "-"}${sortAvailableLoads?.field}`
            : "",
          by_shipper_load: loads?.activeLoad?.id,
          pagination: { page: trucks?.trucksPagination?.page + 1, page_size: 100 },
          availableLoad: true,
        })
      );
    }
  );

  const { mutate: handleDeleteShipperLoad, isLoading: isDeleting } = useMutation(
    "delete-shipper-load",
    (shipperLoadId) =>
      dispatch(deleteShipperLoad({ role: userInfo?.entity_type, loadId: shipperLoadId }))
  );

  const handleChooseShipperLoad = (load) => dispatch(chooseLoad(load));

  const handleRefreshLoads = (shipperLoadId) =>
    shipperLoadId?.id === loads?.activeLoad?.id
      ? queryClient.invalidateQueries("get-available-trucks")
      : handleChooseShipperLoad({ ...shipperLoadId, open: false });

  const handleUploadItem = (load) =>
    dispatch(
      updateShipperLoad({
        role: userInfo?.entity_type,
        load: { id: load?.id, pickup_date: load?.pickup_date },
      })
    );

  const handleSortAvailableLoads = (field) => {
    setSortAvailableLoads({
      field: !sortAvailableLoads?.sort && sortAvailableLoads?.field === field ? "" : field,
      sort: sortAvailableLoads?.field === field && sortAvailableLoads?.sort ? false : true,
    });
  };

  useEffect(() => {
    onRefetchGetShipperLoads();
  }, [loads?.refresh]);

  return (
    <>
      <div className="w-full h-full p-2 hidden lg:block">
        <PostLoadsOrTrucksTableEsp
          items={loads?.loads}
          onDelete={(shipperLoadId) => handleDeleteShipperLoad(shipperLoadId)}
          isLoading={isLoadingShipperLoads}
          isDeleting={isDeleting}
          onUpload={handleUploadItem}
          onRefresh={(shipperLoadId) => handleRefreshLoads(shipperLoadId)}
          tableLabel="Loads"
          activeItem={loads?.activeLoad}
          onChooseItem={(shipperLoadId) => handleChooseShipperLoad(shipperLoadId)}
          refreshStatus={loads?.refresh}
        />
      </div>
      <div className="w-full h-full lg:hidden">
        {themeType === "classic" ? (
          <SplitContainer
            loadsCount={loads?.loads?.length}
            loads={
              <div className="bg-white h-full flex flex-col items-center justify-between border border-gray_lighter rounded-xl overflow-hidden dark:border-green_5 dark:bg-[#1A313E]">
                <div className="w-full h-[calc(100%-8px)]">
                  <PostLoadsOrTrucksTableClassic
                    items={loads?.loads}
                    onDelete={(shipperLoadId) => handleDeleteShipperLoad(shipperLoadId)}
                    isLoading={isLoadingShipperLoads}
                    isDeleting={isDeleting}
                    onUpload={handleUploadItem}
                    onRefresh={(shipperLoadId) => handleRefreshLoads(shipperLoadId)}
                    tableLabel="Loads"
                    activeItem={loads?.activeLoad}
                    onChooseItem={(shipperLoadId) => handleChooseShipperLoad(shipperLoadId)}
                    refreshStatus={loads?.refresh}
                  />
                </div>
                <div className="w-full h-2 bg-[#C7D3E4] flex items-center justify-center dark:bg-[#2C495A]" />
              </div>
            }
            availableLoads={
              <AvailableLoadsTableClassic
                sort={sortAvailableLoads}
                items={trucks?.trucks}
                isLoading={isLoadingTrucks || isRefetchingTrucks}
                itemsCount={trucks?.trucksPagination?.count}
                tableLabel="Trucks"
                hasNextPage={!!loads?.loadsPagination?.next}
                isLoadingGetLoadsOnScroll={isLoadingGetTrucksOnScroll}
                onSort={handleSortAvailableLoads}
                loadingNextPage={handleGetTrucksOnScroll}
                refetchingConfig={refetchingConfig}
                setRefetchingConfig={setRefetchingConfig}
              />
            }
          />
        ) : (
          <div className="w-full h-full flex px-4">
            <div className="w-[27rem] h-full">
              <PostLoadsOrTrucksTableEsp
                items={loads?.loads}
                onDelete={(shipperLoadId) => handleDeleteShipperLoad(shipperLoadId)}
                isLoading={isLoadingShipperLoads}
                isDeleting={isDeleting}
                onUpload={handleUploadItem}
                onRefresh={(shipperLoadId) => handleRefreshLoads(shipperLoadId)}
                tableLabel="Loads"
                activeItem={loads?.activeLoad}
                onChooseItem={(shipperLoadId) => handleChooseShipperLoad(shipperLoadId)}
                refreshStatus={loads?.refresh}
              />
            </div>
            <div className="w-[calc(100%-27rem)] h-full pl-2">
              <AvailableLoadsTableClassic
                sort={sortAvailableLoads}
                items={trucks?.trucks}
                isLoading={isLoadingTrucks || isRefetchingTrucks}
                itemsCount={trucks?.trucksPagination?.count}
                tableLabel="Trucks"
                hasNextPage={!!loads?.loadsPagination?.next}
                isLoadingGetLoadsOnScroll={isLoadingGetTrucksOnScroll}
                onSort={handleSortAvailableLoads}
                loadingNextPage={handleGetTrucksOnScroll}
                refetchingConfig={refetchingConfig}
                setRefetchingConfig={setRefetchingConfig}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PostShippersLoads;
