import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  getShipperLoads,
  chooseSearchLoad,
  getSearchShipperLoads,
  updateSearchShipperLoad,
  deleteSearchShipperLoad,
} from "store/slices/loadSlice";
import SearchLoadsOrTrucksTableClassic from "layers/search-loads-tables/SearchLoadsOrTrucksTableClassic";
import AvailableLoadsTableClassic from "layers/available-loads-tables/AvailableLoadsTableClassic";
import SearchLoadsOrTrucksTableEsp from "layers/search-loads-tables/SearchLoadsOrTrucksTableEsp";
import SplitContainer from "components/split-container/SplitContainer";

function FindShippersLoads() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    auth: { userInfo },
    loads: { loads, searchLoads },
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

  document.title = t("shippers-loads");

  const { isLoading: isLoadingSearchShipperLoads, refetch: onRefetchSearchShipperLoads } = useQuery(
    ["get-search-shipper-loads", userInfo?.entity_type],
    (props) => {
      setFirstRequest(true);
      return dispatch(
        getSearchShipperLoads({
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

  const { isLoading: isLoadingShipperLoads, isRefetching: isRefetchingShipperLoads } = useQuery(
    [
      "get-available-shipper-loads",
      deviceType,
      sortAvailableLoads,
      userInfo?.entity_type,
      searchLoads?.activeSearchLoad?.id,
    ],
    () =>
      deviceType === "desktop" &&
      dispatch(
        getShipperLoads({
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

  const { mutate: handleGetShipperLoadsOnScroll, isLoading: isLoadingGetShipperLoadsOnScroll } =
    useMutation("get-shipper-loads-on-scroll", () => {
      dispatch(
        getShipperLoads({
          role: userInfo?.entity_type,
          ordering: sortAvailableLoads?.field
            ? `${sortAvailableLoads?.sort ? "" : "-"}${sortAvailableLoads?.field}`
            : "",
          by_search: searchLoads?.activeSearchLoad?.id,
          pagination: { page: loads?.loadsPagination?.page + 1, page_size: 100 },
          availableLoad: true,
        })
      );
    });

  const { mutate: handleDeleteSearchShipperLoad, isLoading: isDeleting } = useMutation(
    "delete-load",
    (searchShipperLoadId) =>
      dispatch(
        deleteSearchShipperLoad({ role: userInfo?.entity_type, loadId: searchShipperLoadId })
      )
  );

  const handleChooseSearchShipperLoad = (searchShipperLoad) =>
    dispatch(chooseSearchLoad(searchShipperLoad));

  const handleRefreshShipperLoads = (searchShipperLoad) => {
    searchShipperLoad?.id === searchLoads?.activeSearchLoad?.id
      ? dispatch(
          getShipperLoads({
            role: userInfo?.entity_type,
            searchLoadId: searchLoads?.activeSearchLoad?.id,
          })
        )
      : handleChooseSearchShipperLoad(searchShipperLoad);
  };

  const handleChangeNotification = (id, notification_status) =>
    dispatch(
      updateSearchShipperLoad({
        role: userInfo?.entity_type,
        search: { id, notification_status },
      })
    );

  const handleSortAvailableLoads = (field) => {
    setSortAvailableLoads({
      field: !sortAvailableLoads?.sort && sortAvailableLoads?.field === field ? "" : field,
      sort: sortAvailableLoads?.field === field && sortAvailableLoads?.sort ? false : true,
    });
  };

  useEffect(() => {
    onRefetchSearchShipperLoads();
  }, [searchLoads?.refresh]);

  return (
    <>
      <div className="w-full h-full p-2 hidden lg:block">
        <SearchLoadsOrTrucksTableEsp
          items={searchLoads?.searchLoads}
          onDelete={(searchShipperLoadId) => handleDeleteSearchShipperLoad(searchShipperLoadId)}
          isLoading={isLoadingSearchShipperLoads}
          isDeleting={isDeleting}
          onRefresh={(searchShipperLoad) => handleRefreshShipperLoads(searchShipperLoad)}
          tableLabel="Find Loads"
          activeItem={searchLoads?.activeSearchLoad}
          refreshStatus={searchLoads?.refresh}
          onChooseItem={(searchShipperLoad) => handleChooseSearchShipperLoad(searchShipperLoad)}
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
                    onDelete={(searchShipperLoadId) =>
                      handleDeleteSearchShipperLoad(searchShipperLoadId)
                    }
                    isLoading={isLoadingSearchShipperLoads}
                    isDeleting={isDeleting}
                    onRefresh={(searchShipperLoad) => handleRefreshShipperLoads(searchShipperLoad)}
                    tableLabel="Find Loads"
                    activeItem={searchLoads?.activeSearchLoad}
                    refreshStatus={searchLoads?.refresh}
                    onChooseItem={(searchShipperLoad) =>
                      handleChooseSearchShipperLoad(searchShipperLoad)
                    }
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
                isLoading={isLoadingShipperLoads || isRefetchingShipperLoads}
                itemsCount={loads?.loadsPagination?.count}
                tableLabel="Loads"
                hasNextPage={!!loads?.loadsPagination?.next}
                isLoadingGetLoadsOnScroll={isLoadingGetShipperLoadsOnScroll}
                onSort={handleSortAvailableLoads}
                loadingNextPage={handleGetShipperLoadsOnScroll}
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
                onDelete={(searchShipperLoadId) =>
                  handleDeleteSearchShipperLoad(searchShipperLoadId)
                }
                isLoading={isLoadingSearchShipperLoads}
                isDeleting={isDeleting}
                onRefresh={(searchShipperLoad) => handleRefreshShipperLoads(searchShipperLoad)}
                tableLabel="Find Loads"
                activeItem={searchLoads?.activeSearchLoad}
                refreshStatus={searchLoads?.refresh}
                onChooseItem={(searchShipperLoad) =>
                  handleChooseSearchShipperLoad(searchShipperLoad)
                }
                onChangeNotification={handleChangeNotification}
              />
            </div>
            <div className="w-[calc(100%-27rem)] h-full pl-2">
              <AvailableLoadsTableClassic
                sort={sortAvailableLoads}
                items={loads?.loads}
                isLoading={isLoadingShipperLoads || isRefetchingShipperLoads}
                itemsCount={loads?.loadsPagination?.count}
                tableLabel="Loads"
                hasNextPage={!!loads?.loadsPagination?.next}
                isLoadingGetLoadsOnScroll={isLoadingGetShipperLoadsOnScroll}
                onSort={handleSortAvailableLoads}
                loadingNextPage={handleGetShipperLoadsOnScroll}
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

export default FindShippersLoads;
