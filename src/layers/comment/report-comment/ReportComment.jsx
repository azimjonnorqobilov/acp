import { useMutation } from "react-query";
import { icons } from "assets/icons/icons";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { sendCommentReport } from "store/slices/userSlice";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import RadioGroup from "components/radio/RadioGroup";

const reportMessages = [
  {
    id: 2,
    label: "violent-or-repulsive-comment",
    value: "vorc",
  },
  { id: 3, label: "hateful-or-abusive-content", value: "hoac" },
  { id: 4, label: "harassment-or-bullying", value: "hob" },
  { id: 5, label: "harmful-or-dangerous-acts", value: "hoda" },
  { id: 6, label: "misinformation", value: "mis" },
  { id: 7, label: "promotes-terrorism", value: "pt" },
  { id: 8, label: "spam-or-misleading", value: "som" },
  { id: 9, label: "legal-issue", value: "li" },
];

function ReportComment({ comment, report, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [newReport, setNewReport] = useState(report);
  const [reportList, setReportList] = useState({});

  const { mutate: handleReport, isLoading } = useMutation("send-message", () =>
    dispatch(
      sendCommentReport({
        comment,
        ...reportList,
      })
    )
  );

  useEffect(() => {
    let list = {};
    reportMessages?.map(
      (message) => (list = { ...list, [message?.value]: message?.value === newReport })
    );
    setReportList(list);
  }, [report, newReport]);

  return (
    <div className="bg-white w-[20rem] p-6 rounded-xl flex flex-col gap-4 relative outline-none dark:bg-green_7">
      <button onClick={onClose} className="w-max h-max absolute top-4 right-4">
        <icons.close className="w-3 stroke-black dark:stroke-white" />
      </button>
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center rounded-xl">
          <BounceDotsLoader />
        </div>
      )}
      <p className="font-bicubik text-center dark:text-white">{t("report-comment")}</p>
      <RadioGroup
        value={report}
        options={reportMessages}
        onSelected={(value) => setNewReport(value)}
      />

      <button
        onClick={handleReport}
        className="bg-blue text-white px-4 py-2 text-sm rounded-lg uppercase"
      >
        {t("report")}
      </button>
    </div>
  );
}

export default ReportComment;
