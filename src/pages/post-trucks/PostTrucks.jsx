import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getLoads } from "store/slices/loadSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getTrucks, deleteTruck, chooseTruck, updateTruck } from "store/slices/truckSlice";
import PostLoadsOrTrucksTableClassic from "layers/post-loads-tables/PostLoadsOrTrucksTableClassic";
import AvailableLoadsTableClassic from "layers/available-loads-tables/AvailableLoadsTableClassic";
import PostLoadsOrTrucksTableEsp from "layers/post-loads-tables/PostLoadsOrTrucksTableEsp";
import SplitContainer from "components/split-container/SplitContainer";

function PostTrucks() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {
    auth: { userInfo },
    trucks: { trucks },
    loads: { loads },
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

  document.title = t("post-trucks");

  const { isLoading: isLoadingTrucks, refetch: onRefetchGetTrucks } = useQuery(
    ["get-trucks", userInfo?.entity_type],
    () => {
      setFirstRequest(true);
      return dispatch(
        getTrucks({
          role: userInfo?.entity_type,
          execute: firstRequest,
          pagination: { page: 1, page_size: 100 },
        })
      );
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval: 15 * 1000,
      refetchIntervalInBackground: true,
    }
  );

  const { isLoading: isLoadingLoads, isRefetching: isRefetchingLoads } = useQuery(
    [
      "get-available-loads",
      deviceType,
      sortAvailableLoads,
      userInfo?.entity_type,
      trucks?.activeTruck?.id,
    ],
    () =>
      deviceType === "desktop" &&
      dispatch(
        getLoads({
          role: userInfo?.entity_type,
          ordering: sortAvailableLoads?.field
            ? `${sortAvailableLoads?.sort ? "" : "-"}${sortAvailableLoads?.field}`
            : "",
          by_truck: trucks?.activeTruck?.id,
          pagination: { page: 1, page_size: 100 },
        })
      ),
    {
      ...refetchingConfig,
    }
  );

  const { mutate: handleGetLoadsOnScroll, isLoading: isLoadingGetLoadsOnScroll } = useMutation(
    "get-loads-on-scroll",
    () => {
      dispatch(
        getLoads({
          role: userInfo?.entity_type,
          by_truck: trucks?.activeTruck?.id,
          pagination: { page: loads?.loadsPagination?.page + 1, page_size: 100 },
          availableLoad: true,
        })
      );
    }
  );

  const { mutate: handleDeleteTruck, isLoading: isDeleting } = useMutation(
    "delete-load",
    (truckId) => dispatch(deleteTruck({ role: userInfo?.entity_type, truckId: truckId }))
  );

  const handleChooseTruck = (truck) => dispatch(chooseTruck(truck));

  const handleRefreshLoads = (truck) =>
    truck?.id === trucks?.activeTruck?.id
      ? queryClient.invalidateQueries("get-available-loads")
      : handleChooseTruck({ ...truck, open: false });

  const handleUploadItem = (truck) => {
    dispatch(
      updateTruck({
        role: userInfo?.entity_type,
        truck: { id: truck?.id, pickup_date: truck?.pickup_date },
      })
    );
  };

  const handleSortAvailableLoads = (field) => {
    setSortAvailableLoads({
      field: !sortAvailableLoads?.sort && sortAvailableLoads?.field === field ? "" : field,
      sort: sortAvailableLoads?.field === field && sortAvailableLoads?.sort ? false : true,
    });
  };

  useEffect(() => {
    onRefetchGetTrucks();
  }, [trucks?.refresh]);

  return (
    <>
      <div className="w-full h-full p-2 hidden lg:block">
        <PostLoadsOrTrucksTableEsp
          items={trucks?.trucks}
          onDelete={(truckId) => handleDeleteTruck(truckId)}
          isLoading={isLoadingTrucks}
          isDeleting={isDeleting}
          onUpload={handleUploadItem}
          onRefresh={(truck) => handleRefreshLoads(truck)}
          tableLabel="Trucks"
          activeItem={trucks?.activeTruck}
          onChooseItem={(truck) => handleChooseTruck(truck)}
          refreshStatus={trucks?.refresh}
        />
      </div>
      <div className="w-full h-full lg:hidden">
        {themeType === "classic" ? (
          <SplitContainer
            loadsCount={trucks?.trucks?.length}
            loads={
              <div className="bg-white h-full flex flex-col items-center justify-between border border-gray_lighter rounded-xl overflow-hidden dark:border-green_5 dark:bg-[#1A313E]">
                <div className="w-full h-[calc(100%-8px)]">
                  <PostLoadsOrTrucksTableClassic
                    items={trucks?.trucks}
                    onDelete={(truckId) => handleDeleteTruck(truckId)}
                    isLoading={isLoadingTrucks}
                    isDeleting={isDeleting}
                    onUpload={handleUploadItem}
                    onRefresh={(truck) => handleRefreshLoads(truck)}
                    tableLabel="Trucks"
                    activeItem={trucks?.activeTruck}
                    onChooseItem={(truck) => handleChooseTruck(truck)}
                    refreshStatus={trucks?.refresh}
                  />
                </div>
                <div className="w-full h-2 bg-[#C7D3E4] flex items-center justify-center dark:bg-[#2C495A]" />
              </div>
            }
            availableLoads={
              <AvailableLoadsTableClassic
                sort={sortAvailableLoads}
                items={loads?.loads}
                isLoading={isLoadingLoads || isRefetchingLoads}
                tableLabel="Loads"
                itemsCount={loads?.loadsPagination?.count}
                hasNextPage={!!loads?.loadsPagination?.next}
                isLoadingGetLoadsOnScroll={isLoadingGetLoadsOnScroll}
                onSort={handleSortAvailableLoads}
                loadingNextPage={handleGetLoadsOnScroll}
                refetchingConfig={refetchingConfig}
                setRefetchingConfig={setRefetchingConfig}
              />
            }
          />
        ) : (
          <div className="w-full h-full flex px-4 pb-2">
            <div className="w-[27rem] h-full">
              <PostLoadsOrTrucksTableEsp
                items={trucks?.trucks}
                onDelete={(truckId) => handleDeleteTruck(truckId)}
                isLoading={isLoadingTrucks}
                isDeleting={isDeleting}
                onUpload={handleUploadItem}
                onRefresh={(truck) => handleRefreshLoads(truck)}
                tableLabel="Trucks"
                activeItem={trucks?.activeTruck}
                onChooseItem={(truck) => handleChooseTruck(truck)}
                refreshStatus={trucks?.refresh}
              />
            </div>
            <div className="w-[calc(100%-27rem)] h-full pl-2">
              <AvailableLoadsTableClassic
                sort={sortAvailableLoads}
                items={loads?.loads}
                isLoading={isLoadingLoads || isRefetchingLoads}
                tableLabel="Loads"
                itemsCount={loads?.loadsPagination?.count}
                hasNextPage={!!loads?.loadsPagination?.next}
                isLoadingGetLoadsOnScroll={isLoadingGetLoadsOnScroll}
                onSort={handleSortAvailableLoads}
                loadingNextPage={handleGetLoadsOnScroll}
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

export default PostTrucks;
