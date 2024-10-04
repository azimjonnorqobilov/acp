import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getTrucks,
  getSearchTrucks,
  chooseSearchTruck,
  deleteSearchTruck,
  updateSearchTruck,
} from "store/slices/truckSlice";
import { useMutation, useQuery, useQueryClient } from "react-query";
import SearchLoadsOrTrucksTableClassic from "layers/search-loads-tables/SearchLoadsOrTrucksTableClassic";
import AvailableLoadsTableClassic from "layers/available-loads-tables/AvailableLoadsTableClassic";
import SearchLoadsOrTrucksTableEsp from "layers/search-loads-tables/SearchLoadsOrTrucksTableEsp";
import SplitContainer from "components/split-container/SplitContainer";

function FindTrucks() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {
    auth: { userInfo },
    trucks: { trucks, searchTrucks },
    theme: {
      themeType,
      device: { deviceType },
    },
  } = useSelector((store) => store);
  const [firstRequest, setFirstRequest] = useState("");
  const [refetchingConfig, setRefetchingConfig] = useState({
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
  });
  const [sortAvailableLoads, setSortAvailableLoads] = useState({ field: null, sort: true });

  document.title = t("find-trucks");

  const { isLoading: isLoadingSearchTrucks, refetch: onRefetchGetSearchTrucks } = useQuery(
    ["get-search-trucks", userInfo?.entity_type],
    (props) => {
      setFirstRequest(true);
      return dispatch(
        getSearchTrucks({
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
      searchTrucks?.activeSearchTruck?.id,
    ],
    () =>
      deviceType === "desktop" &&
      dispatch(
        getTrucks({
          role: userInfo?.entity_type,
          by_search: searchTrucks?.activeSearchTruck?.id,
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
          by_search: searchTrucks?.activeSearchTruck?.id,
          pagination: { page: trucks?.trucksPagination?.page + 1, page_size: 100 },
          availableLoad: true,
        })
      );
    }
  );

  const { mutate: handleDeleteSearchTruck, isLoading: isDeleting } = useMutation(
    "delete-load",
    (searchTruckId) =>
      dispatch(deleteSearchTruck({ role: userInfo?.entity_type, truckId: searchTruckId }))
  );

  const handleChangeNotification = (id, notification_status) =>
    dispatch(
      updateSearchTruck({ role: userInfo?.entity_type, search: { id, notification_status } })
    );

  const handleChooseSearchTruck = (searchTruck) => dispatch(chooseSearchTruck(searchTruck));

  const handleRefreshTrucks = (searchTruck) =>
    searchTruck?.id === searchTrucks?.activeSearchTruck?.id
      ? queryClient.invalidateQueries("get-available-trucks")
      : handleChooseSearchTruck(searchTruck);

  const handleSortAvailableLoads = (field) => {
    setSortAvailableLoads({
      field: !sortAvailableLoads?.sort && sortAvailableLoads?.field === field ? "" : field,
      sort: sortAvailableLoads?.field === field && sortAvailableLoads?.sort ? false : true,
    });
  };

  useEffect(() => {
    onRefetchGetSearchTrucks();
  }, [searchTrucks?.refresh]);

  return (
    <>
      <div className="w-full h-full p-2 hidden lg:block">
        <SearchLoadsOrTrucksTableEsp
          items={searchTrucks?.searchTrucks}
          onDelete={(searchTruckId) => handleDeleteSearchTruck(searchTruckId)}
          isLoading={isLoadingSearchTrucks}
          isDeleting={isDeleting}
          onRefresh={(searchTruck) => handleRefreshTrucks(searchTruck)}
          tableLabel="Find Trucks"
          activeItem={searchTrucks?.activeSearchTruck}
          refreshStatus={searchTrucks?.refresh}
          onChangeNotification={handleChangeNotification}
          onChooseItem={(searchTruck) => handleChooseSearchTruck(searchTruck)}
        />
      </div>
      <div className="w-full h-full lg:hidden">
        {themeType === "classic" ? (
          <SplitContainer
            loadsCount={searchTrucks?.searchTrucks?.length}
            loads={
              <div className="bg-white h-full flex flex-col items-center justify-between border border-gray_lighter rounded-xl overflow-hidden dark:border-green_5 dark:bg-[#1A313E]">
                <div className="w-full h-[calc(100%-8px)]">
                  <SearchLoadsOrTrucksTableClassic
                    items={searchTrucks?.searchTrucks}
                    onDelete={(searchTruckId) => handleDeleteSearchTruck(searchTruckId)}
                    isLoading={isLoadingSearchTrucks}
                    isDeleting={isDeleting}
                    onRefresh={(searchTruck) => handleRefreshTrucks(searchTruck)}
                    tableLabel="Find Trucks"
                    activeItem={searchTrucks?.activeSearchTruck}
                    refreshStatus={searchTrucks?.refresh}
                    onChangeNotification={handleChangeNotification}
                    onChooseItem={(searchTruck) => handleChooseSearchTruck(searchTruck)}
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
              <SearchLoadsOrTrucksTableEsp
                items={searchTrucks?.searchTrucks}
                onDelete={(searchTruckId) => handleDeleteSearchTruck(searchTruckId)}
                isLoading={isLoadingSearchTrucks}
                isDeleting={isDeleting}
                onRefresh={(searchTruck) => handleRefreshTrucks(searchTruck)}
                tableLabel="Find Trucks"
                activeItem={searchTrucks?.activeSearchTruck}
                refreshStatus={searchTrucks?.refresh}
                onChangeNotification={handleChangeNotification}
                onChooseItem={(searchTruck) => handleChooseSearchTruck(searchTruck)}
              />
            </div>
            <div className="w-[calc(100%-27rem)] h-full pl-2">
              <AvailableLoadsTableClassic
                sort={sortAvailableLoads}
                items={trucks?.trucks}
                isLoading={isLoadingTrucks || isRefetchingTrucks}
                itemsCount={trucks?.trucksPagination?.count}
                tableLabel="Trucks"
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

export default FindTrucks;
