import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoads,
  getSearchLoads,
  updateSearchLoad,
  chooseSearchLoad,
  deleteSearchLoads,
} from "store/slices/loadSlice";
import { useMutation, useQuery, useQueryClient } from "react-query";
import SearchLoadsOrTrucksTableClassic from "layers/search-loads-tables/SearchLoadsOrTrucksTableClassic";
import AvailableLoadsTableClassic from "layers/available-loads-tables/AvailableLoadsTableClassic";
import SearchLoadsOrTrucksTableEsp from "layers/search-loads-tables/SearchLoadsOrTrucksTableEsp";
import SplitContainer from "components/split-container/SplitContainer";

function FindLoads() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {
    auth: { userInfo },
    loads: { loads, searchLoads },
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

  document.title = t("find-loads");

  const { isLoading: isLoadingSearchLoads, refetch: onRefetchGetSearchLoads } = useQuery(
    ["get-search-loads", userInfo?.entity_type],
    (props) => {
      setFirstRequest(true);
      return dispatch(
        getSearchLoads({
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

  const { isLoading: isLoadingLoads, isRefetching: isRefetchingLoads } = useQuery(
    [
      "get-available-loads",
      deviceType,
      sortAvailableLoads,
      userInfo?.entity_type,
      searchLoads?.activeSearchLoad,
    ],
    () =>
      deviceType === "desktop" &&
      dispatch(
        getLoads({
          role: userInfo?.entity_type,
          ordering: sortAvailableLoads?.field
            ? `${sortAvailableLoads?.sort ? "" : "-"}${sortAvailableLoads?.field}`
            : "",
          by_search: searchLoads?.activeSearchLoad?.id,
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
          ordering: sortAvailableLoads?.field
            ? `${sortAvailableLoads?.sort ? "" : "-"}${sortAvailableLoads?.field}`
            : "",
          by_search: searchLoads?.activeSearchLoad?.id,
          pagination: { page: loads?.loadsPagination?.page + 1, page_size: 100 },
          availableLoad: true,
        })
      );
    }
  );

  const { mutate: handleDeleteSearchLoad, isLoading: isDeleting } = useMutation(
    "delete-load",
    (searchLoadId) =>
      dispatch(deleteSearchLoads({ role: userInfo?.entity_type, searchId: searchLoadId }))
  );

  const handleChooseSearchLoad = (searchLoad) => dispatch(chooseSearchLoad(searchLoad));

  const handleRefreshLoads = (searchLoad) =>
    searchLoad?.id === searchLoads?.activeSearchLoad?.id
      ? queryClient.invalidateQueries("get-available-loads")
      : handleChooseSearchLoad(searchLoad);

  const handleChangeNotification = (load, notification_status) =>
    dispatch(
      updateSearchLoad({
        role: userInfo?.entity_type,
        search: { id: load, notification_status },
      })
    );

  const handleSortAvailableLoads = (field) => {
    setSortAvailableLoads({
      field: !sortAvailableLoads?.sort && sortAvailableLoads?.field === field ? "" : field,
      sort: sortAvailableLoads?.field === field && sortAvailableLoads?.sort ? false : true,
    });
  };

  useEffect(() => {
    onRefetchGetSearchLoads();
  }, [searchLoads?.refresh]);

  return (
    <>
      <div className="w-full h-full p-2 hidden lg:block">
        <SearchLoadsOrTrucksTableEsp
          items={searchLoads?.searchLoads}
          onDelete={(searchLoadId) => handleDeleteSearchLoad(searchLoadId)}
          isLoading={isLoadingSearchLoads}
          isDeleting={isDeleting}
          onRefresh={(searchLoad) => handleRefreshLoads(searchLoad)}
          tableLabel="Find Loads"
          activeItem={searchLoads?.activeSearchLoad}
          refreshStatus={searchLoads?.refresh}
          onChooseItem={(searchLoad) => handleChooseSearchLoad(searchLoad)}
          onChangeNotification={handleChangeNotification}
        />
      </div>
      <div className="w-full h-full lg:hidden">
        {themeType === "classic" ? (
          <SplitContainer
            loadsCount={searchLoads?.searchLoads?.length}
            loads={
              <div className="bg-white h-full flex flex-col items-center justify-between border border-gray_lighter rounded-xl overflow-hidden dark:border-green_5 dark:bg-[#1A313E]">
                <div className="w-full h-[calc(100%-8px)]">
                  <SearchLoadsOrTrucksTableClassic
                    items={searchLoads?.searchLoads}
                    onDelete={(searchLoadId) => handleDeleteSearchLoad(searchLoadId)}
                    isLoading={isLoadingSearchLoads}
                    isDeleting={isDeleting}
                    onRefresh={(searchLoad) => handleRefreshLoads(searchLoad)}
                    tableLabel="Find Loads"
                    activeItem={searchLoads?.activeSearchLoad}
                    refreshStatus={searchLoads?.refresh}
                    onChooseItem={(searchLoad) => handleChooseSearchLoad(searchLoad)}
                    onChangeNotification={handleChangeNotification}
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
                itemsCount={loads?.loadsPagination?.count}
                tableLabel="Loads"
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
              <SearchLoadsOrTrucksTableEsp
                items={searchLoads?.searchLoads}
                isLoading={isLoadingSearchLoads}
                isDeleting={isDeleting}
                tableLabel="Find Loads"
                activeItem={searchLoads?.activeSearchLoad}
                refreshStatus={searchLoads?.refresh}
                onDelete={(searchLoadId) => handleDeleteSearchLoad(searchLoadId)}
                onRefresh={(searchLoad) => handleRefreshLoads(searchLoad)}
                onChooseItem={(searchLoad) => handleChooseSearchLoad(searchLoad)}
                onChangeNotification={handleChangeNotification}
              />
            </div>
            <div className="w-[calc(100%-27rem)] h-full pl-2">
              <AvailableLoadsTableClassic
                sort={sortAvailableLoads}
                items={loads?.loads}
                isLoading={isLoadingLoads || isRefetchingLoads}
                itemsCount={loads?.loadsPagination?.count}
                tableLabel="Loads"
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

export default FindLoads;
