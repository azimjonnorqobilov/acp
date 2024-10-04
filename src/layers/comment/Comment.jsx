import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getComments, sendComment } from "store/slices/userSlice";
import { useMutation, useQuery, useQueryClient } from "react-query";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import Textarea from "components/textarea/Textarea";
import Loader from "components/loader/Loader";
import Message from "./message/Message";

function Comment() {
  const commentsRef = useRef();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {
    auth: {
      userInfo: { entity_type },
    },
    user: {
      commentAndReview: { comments, isLoading },
      companyInformation: { companyInfo, ratesStatus },
    },
  } = useSelector((store) => store);
  const [keyDown, setKeyDown] = useState("");
  const [newComment, setNewComment] = useState("");

  useQuery(
    ["get-comments", companyInfo?.id, ratesStatus],
    () => {
      return companyInfo?.id && dispatch(getComments({ company: companyInfo?.id }));
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval: 10 * 1000,
      refetchIntervalInBackground: true,
    }
  );

  const { mutate: handleSendNewComment, isLoading: isLoadingSendComment } = useMutation(
    "send-message",
    () => dispatch(sendComment({ company: companyInfo?.id, content: newComment })),
    {
      onSuccess: () => {
        setNewComment("");
        queryClient.invalidateQueries("get-comment");
      },
    }
  );

  useEffect(() => {
    companyInfo?.id &&
      commentsRef.current &&
      (commentsRef.current.scrollTop = commentsRef.current.scrollHeight);
  }, [comments?.length, companyInfo?.id]);

  return (
    <div className="w-full h-full border border-gray_lighter lg:border-none rounded-xl lg:rounded-none overflow-hidden dark:border-[#4A7186] relative">
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full rounded-xl backdrop-blur-md backdrop-brightness-95 flex items-center justify-center z-10">
          <BounceDotsLoader />
        </div>
      )}

      <div
        className={`bg-gray_light dark:bg-[#1F323C] lg:bg-transparent  flex items-end p-2 ${
          entity_type === "broker" ||
          entity_type === "carrier" ||
          (entity_type === "shipper" && companyInfo?.my_company)
            ? "h-[calc(100%-57px)]"
            : "h-full"
        }`}
      >
        {comments?.length ? (
          <div
            ref={commentsRef}
            className="w-full max-h-full overflow-y-auto table-scrollbar flex flex-col gap-4 p-2"
          >
            {comments?.map((comment) => (
              <Message
                key={comment?.id}
                comment={comment}
                me={comment?.author?.me}
                onGetComments={() => queryClient.invalidateQueries("get-comment")}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full font-bicubik flex items-center justify-center text-2xl text-center text-gray uppercase">
            {t("comments-not-found")}
          </div>
        )}
      </div>

      {(entity_type === "broker" ||
        entity_type === "carrier" ||
        (entity_type === "shipper" && companyInfo?.my_company)) && (
        <div className="bg-white w-full px-4 py-2 flex items-center gap-4 dark:bg-[#4E7084] lg:shadow-[0_7px_20px_1px_rgba(0,0,0,0.7)]">
          <Textarea
            rows={1}
            value={newComment || ""}
            className="flex-1"
            placeholder={t("comments")}
            onChange={(e) => setNewComment(e.target.value)}
            classNameTextarea="bg-gray_light resize-none"
            onKeyDown={(e) => e?.key === "Control" && setKeyDown(e?.key)}
            onKeyUp={() => setKeyDown("")}
            onKeyPress={(e) => {
              e?.key === "Enter" && e.preventDefault();
              e?.key === "Enter" && keyDown === "Control" && setNewComment(`${newComment} \n`);
              e?.key === "Enter" &&
                keyDown === "" &&
                newComment?.replaceAll("\n", "")?.trimStart()?.trimEnd()?.length &&
                handleSendNewComment();
            }}
          />
          <button
            onClick={handleSendNewComment}
            disabled={newComment && !isLoadingSendComment ? false : true}
            className={`w-10 h-10 flex items-center justify-center rounded-full ${
              isLoadingSendComment ? "bg-white border-4 border-blue" : "bg-blue"
            }`}
          >
            {isLoadingSendComment ? <Loader /> : <icons.send className="fill-white" />}
          </button>
        </div>
      )}
    </div>
  );
}

export default Comment;
