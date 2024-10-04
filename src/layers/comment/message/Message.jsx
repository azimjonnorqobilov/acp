import { useMutation } from "react-query";
import { icons } from "assets/icons/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { REFACTOR_DATE } from "assets/constants/constants";
import { sendCommentRate, deleteComment } from "store/slices/userSlice";
import RatingStars from "components/rating-stars/RatingStars";
import ReportComment from "../report-comment/ReportComment";
import MUIModal from "components/mui-modal/MUIModal";
import Delete from "layers/delete/Delete";

const ShowMoreText = ({ showTextCount = 45, children: text }) => {
  const { t } = useTranslation();
  const [showCount, setShowCount] = useState(showTextCount);

  const textList = text?.split(" ");
  const textCount = textList?.length;

  return textCount > showTextCount ? (
    <p>
      <span>{textList?.slice(0, showCount)?.join(" ")}</span>
      {textCount === showCount ? (
        <p onClick={() => setShowCount(showTextCount)} className="text-blue cursor-pointer pt-1">
          {t("hide")}
        </p>
      ) : (
        <span>
          <span>... </span>
          <span onClick={() => setShowCount(textCount)} className="text-blue cursor-pointer">
            {t("more")}
          </span>
        </span>
      )}
    </p>
  ) : (
    <p>{text}</p>
  );
};

function Message({ comment, me = false, onGetComments }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    user: {
      commentAndReview: { reportStatus },
    },
  } = useSelector((store) => store);
  const [openModal, setOpenModal] = useState({ open: false, action: null });

  const handleOpenModal = (action) => setOpenModal({ open: true, action });
  const handleCloseModal = () => setOpenModal({ ...openModal, open: false });

  const { mutate: handleRate } = useMutation(
    "rate",
    ({ comment, value }) => dispatch(sendCommentRate({ comment, value })),
    {
      onSuccess: () => onGetComments(),
    }
  );

  const { mutate: handleDeleteComment, isLoading } = useMutation("rate", () =>
    dispatch(deleteComment(comment?.id))
  );

  useEffect(() => {
    handleCloseModal();
  }, [reportStatus]);

  return (
    <>
      <MUIModal open={openModal?.open}>
        {openModal?.action === "report" && (
          <ReportComment
            comment={comment?.id}
            report={comment?.my_reactions?.report}
            onClose={handleCloseModal}
          />
        )}

        {openModal?.action === "delete" && (
          <Delete
            isDeleting={isLoading}
            onDelete={handleDeleteComment}
            onCancel={handleCloseModal}
          />
        )}
      </MUIModal>
      <div className={`w-full flex ${me ? "justify-end" : ""}`}>
        <div
          className={`max-w-[80%] lg:max-w-[90%] border border-blue_5 p-4 rounded-xl text-gray_dark dark:text-white relative dark:border-[#5B8CA9] ${
            me ? "bg-blue_7 dark:bg-[#47758E]" : "bg-blue_6 dark:bg-[#3F5D6E]"
          }`}
        >
          <div className="flex items-center justify-between gap-4 border-b pb-2 border-gray_lighter dark:border-[#5B8CA9]">
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10  flex items-center justify-center rounded-full dark:bg-[#2D434F] ${
                  me ? "bg-blue_6" : "bg-blue_4"
                }`}
              >
                <icons.person className="fill-blue" />
              </div>
              <div className="flex flex-col">
                <p className="flex items-center gap-2 text-blue font-bold text-sm lg:text-xs">
                  {comment?.author?.company?.name || ""}
                  {comment?.author?.status && <icons.verify className="w-3 h-3 fill-blue" />}
                </p>
                <p className="text-xs">{comment?.author?.full_name || ""}</p>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between pl-8">
              <RatingStars
                rating={comment?.author?.company?.total_rating}
                variable={false}
                className="!gap-1"
                classNameStars="w-4"
              />
              <span className="bg-blue_4 text-xs text-gray_dark px-2  rounded-full dark:text-white dark:bg-[#2D434F] xl:!bg-transparent xl:p-0">
                {REFACTOR_DATE(comment?.created_at?.split("T")?.[0])},{" "}
                {comment?.created_at?.split("T")?.[1]?.substr(0, 5)}
              </span>
            </div>
          </div>

          <div className="w-full text-xs py-2">
            <ShowMoreText showTextCount={45}>{comment?.content}</ShowMoreText>
            <div className="flex items-center gap-4 absolute bottom-1 right-4">
              <p
                onClick={() => handleRate({ comment: comment?.id, value: true })}
                className="flex items-center gap-1 cursor-pointer"
              >
                <icons.like
                  className={`${
                    comment?.my_reactions?.reaction === true ? "fill-blue" : "fill-gray"
                  }`}
                />{" "}
                <span
                  className={`${
                    comment?.my_reactions?.reaction === true ? "text-blue" : "text-gray"
                  }`}
                >
                  {comment?.likes || 0}
                </span>
              </p>

              <p
                onClick={() => handleRate({ comment: comment?.id, value: false })}
                className="flex items-center gap-2 cursor-pointer"
              >
                <icons.dislike
                  className={`${
                    comment?.my_reactions?.reaction === false ? "fill-blue" : "fill-gray"
                  }`}
                />{" "}
                <span
                  className={`${
                    comment?.my_reactions?.reaction === false ? "text-blue" : "text-gray"
                  }`}
                >
                  {comment?.dislikes || 0}
                </span>
              </p>

              {me ? (
                <icons.trash
                  onClick={() => handleOpenModal("delete")}
                  className={`fill-[#F10F0F90] cursor-pointer`}
                />
              ) : (
                <p
                  onClick={() => handleOpenModal("report")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <icons.report
                    className={`${comment?.my_reactions?.report ? "fill-yellow" : "fill-gray"}`}
                  />
                  <span
                    className={`${comment?.my_reactions?.report ? "text-yellow" : "text-gray"}`}
                  >
                    {t("report")}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Message;
