import { useTranslation } from "react-i18next";
import { Fragment, useEffect, useState } from "react";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import MUIModal from "components/mui-modal/MUIModal";
import PostCard from "layers/post-card/PostCard";
import NewPost from "layers/new-post/NewPost";
import Delete from "layers/delete/Delete";

function PostLoadsOrTrucksTableEsp({
  items,
  onDelete = () => {},
  onUpload = () => {},
  onRefresh = () => {},
  isLoading,
  isDeleting,
  tableLabel = "Results",
  activeItem,
  onChooseItem = () => {},
  refreshStatus,
}) {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState({ open: false, action: "", item: {} });

  const handleOpenModal = (action, item) => setOpenModal({ open: true, action, item });
  const handleCloseModal = () => setOpenModal({ ...openModal, open: false });

  useEffect(() => {
    handleCloseModal();
  }, [refreshStatus]);

  return (
    <Fragment>
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
      <div className="w-full h-full flex flex-col justify-end dark:text-white">
        <div className="h-[calc(100%-16px-0.25rem)] lg:h-full mt-1 lg:m-0 border border-gray_lighter rounded-xl overflow-hidden bg-white dark:bg-[#1A313E] dark:border-green_5">
          {isLoading ? (
            <BounceDotsLoader className="h-full" />
          ) : items?.length ? (
            <div className="h-full overflow-y-auto table-scrollbar flex flex-col">
              {items?.map((item) => (
                <PostCard
                  key={item?.id}
                  load={item}
                  open={activeItem?.id === item?.id && activeItem?.open ? true : false}
                  active={activeItem?.id === item?.id ? true : false}
                  onEdit={() => handleOpenModal("edit", item)}
                  onDelete={() => handleOpenModal("delete", item)}
                  onChooseLoad={(open) => onChooseItem({ ...item, ...open })}
                  onUpload={onUpload}
                  onRefreshLoads={() => onRefresh(item)}
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-full font-bicubik flex items-center justify-center text-2xl text-center text-gray uppercase">
              {t("no-posts")}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default PostLoadsOrTrucksTableEsp;
