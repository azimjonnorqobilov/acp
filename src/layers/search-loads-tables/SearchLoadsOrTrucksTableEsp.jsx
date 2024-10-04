import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import SearchCard from "layers/search-card/SearchCard";
import MUIModal from "components/mui-modal/MUIModal";
import NewSearch from "layers/new-search/NewSearch";
import Delete from "layers/delete/Delete";

function SearchLoadsOrTrucksTableEsp({
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
  const [openModal, setOpenModal] = useState({ open: false, action: "", item: {} });

  const handleOpenModal = (action, item) => setOpenModal({ open: true, action, item });
  const handleCloseModal = () => setOpenModal({ ...openModal, open: false });

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
      <div className="w-full h-full flex flex-col justify-end dark:text-white">
        <div className="h-[calc(100%-16px-0.25rem)] lg:h-full mt-1 lg:m-0 border border-gray_lighter rounded-xl overflow-hidden bg-white  dark:text-white dark:bg-[#1A313E] dark:border-green_5">
          {isLoading ? (
            <BounceDotsLoader className="h-full" />
          ) : items?.length ? (
            <div className="h-full overflow-y-auto table-scrollbar ">
              {items?.map((item) => (
                <SearchCard
                  key={item?.id}
                  load={item}
                  active={activeItem?.id === item?.id ? true : false}
                  onEdit={() => handleOpenModal("edit", item)}
                  onDelete={() => handleOpenModal("delete", item)}
                  onChooseLoad={(open) => onChooseItem({ ...item, ...open })}
                  onRefreshLoads={() => onRefresh(item)}
                  onChangeNotification={(notification_status) =>
                    onChangeNotification(item?.id, notification_status)
                  }
                />
              ))}
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

export default SearchLoadsOrTrucksTableEsp;
