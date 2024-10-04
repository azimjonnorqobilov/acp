import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTrucks } from "store/slices/truckSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { chooseLoad, getLoads, deleteLoad, updateLoad } from "store/slices/loadSlice";
import PostLoadsOrTrucksTableClassic from "layers/post-loads-tables/PostLoadsOrTrucksTableClassic";
import AvailableLoadsTableClassic from "layers/available-loads-tables/AvailableLoadsTableClassic";
import PostLoadsOrTrucksTableEsp from "layers/post-loads-tables/PostLoadsOrTrucksTableEsp";
import SplitContainer from "components/split-container/SplitContainer";

function PostLoads() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {
    auth: { userInfo },
    loads: { loads },
    theme: {
      themeType,
      device: { deviceType },
    },
    trucks: { trucks },
  } = useSelector((store) => store);
  const [firstRequest, setFirstRequest] = useState(false);
  const [refetchingConfig, setRefetchingConfig] = useState({
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
  });
  const [sortAvailableLoads, setSortAvailableLoads] = useState({ field: null, sort: true });

  document.title = t("post-loads");

  const { isLoading: isLoadingLoads, refetch: onRefetchGetLoads } = useQuery(
    ["get-loads", userInfo?.entity_type],
    () => {
      setFirstRequest(true);
      return dispatch(
        getLoads({
          role: userInfo?.entity_type,
          execute: firstRequest,
          pagination: { page: 1, page_size: 1000 },
        })
      );
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval: 15 * 1000,
      refetchIntervalInBackground: true,
    }
  );

  const { isLoading: isLoadingTrucks, isRefetching: isRefetchingTrucks } = useQuery(
    [
      "get-available-trucks",
      deviceType,
      sortAvailableLoads,
      userInfo?.entity_type,
      loads?.activeLoad?.id,
    ],
    () =>
      deviceType === "desktop" &&
      dispatch(
        getTrucks({
          role: userInfo?.entity_type,
          by_load: loads?.activeLoad?.id,
          pagination: { page: 1, page_size: 50 },
        })
      ),
    {
      ...refetchingConfig,
    }
  );

  const { mutate: handleGetTrucksOnScroll, isLoading: isLoadingGetTrucksOnScroll } = useMutation(
    "get-trucks-on-scroll",
    () => {
      dispatch(
        getTrucks({
          role: userInfo?.entity_type,
          ordering: sortAvailableLoads?.field
            ? `${sortAvailableLoads?.sort ? "" : "-"}${sortAvailableLoads?.field}`
            : "",
          by_load: loads?.activeLoad?.id,
          pagination: { page: trucks?.trucksPagination?.page + 1, page_size: 100 },
          availableLoad: true,
        })
      );
    }
  );

  const { mutate: handleDeleteLoad, isLoading: isDeleting } = useMutation("delete-load", (loadId) =>
    dispatch(deleteLoad({ role: userInfo?.entity_type, loadId: loadId }))
  );

  const handleChooseLoad = (load) => dispatch(chooseLoad(load));

  const handleRefreshTrucks = (load) =>
    load?.id === loads?.activeLoad?.id
      ? queryClient.invalidateQueries("get-available-trucks")
      : handleChooseLoad({ ...load, open: false });

  const handleUploadItem = (load) => {
    dispatch(
      updateLoad({
        role: userInfo?.entity_type,
        load: { id: load?.id, pickup_date: load?.pickup_date },
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
    onRefetchGetLoads();
  }, [loads?.refresh]);

  return (
    <>
      <div className="w-full h-full p-2 hidden lg:block">
        <PostLoadsOrTrucksTableEsp
          items={loads?.loads}
          onDelete={(loadId) => handleDeleteLoad(loadId)}
          isLoading={isLoadingLoads}
          isDeleting={isDeleting}
          onUpload={handleUploadItem}
          onRefresh={(load) => handleRefreshTrucks(load)}
          tableLabel="Loads"
          activeItem={loads?.activeLoad}
          onChooseItem={(load) => handleChooseLoad(load)}
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
                    onDelete={(loadId) => handleDeleteLoad(loadId)}
                    isLoading={isLoadingLoads}
                    isDeleting={isDeleting}
                    onUpload={handleUploadItem}
                    onRefresh={(load) => handleRefreshTrucks(load)}
                    tableLabel="Loads"
                    activeItem={loads?.activeLoad}
                    onChooseItem={(load) => handleChooseLoad(load)}
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
                tableLabel="trucks"
                hasNextPage={!!trucks?.trucksPagination?.next}
                isLoadingGetLoadsOnScroll={isLoadingGetTrucksOnScroll}
                onSort={handleSortAvailableLoads}
                loadingNextPage={handleGetTrucksOnScroll}
                refetchingConfig={refetchingConfig}
                setRefetchingConfig={setRefetchingConfig}
              />
            }
          />
        ) : (
          <div className="w-full h-full flex px-4 pb-2">
            <div className="w-[27rem] h-full">
              <PostLoadsOrTrucksTableEsp
                items={loads?.loads}
                onDelete={(loadId) => handleDeleteLoad(loadId)}
                isLoading={isLoadingLoads}
                isDeleting={isDeleting}
                onUpload={handleUploadItem}
                onRefresh={(load) => handleRefreshTrucks(load)}
                tableLabel="Loads"
                activeItem={loads?.activeLoad}
                onChooseItem={(load) => handleChooseLoad(load)}
                refreshStatus={loads?.refresh}
              />
            </div>
            <div className="w-[calc(100%-27rem)] h-full pl-2">
              <AvailableLoadsTableClassic
                sort={sortAvailableLoads}
                items={trucks?.trucks}
                isLoading={isLoadingTrucks || isRefetchingTrucks}
                itemsCount={trucks?.trucksPagination?.count}
                tableLabel="trucks"
                hasNextPage={!!trucks?.trucksPagination?.next}
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

export default PostLoads;
