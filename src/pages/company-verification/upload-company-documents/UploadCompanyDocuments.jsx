import { useTranslation } from "react-i18next";
import UploadFile from "components/upload-file/UploadFile";

function UploadCompanyDocuments({ onUploadFile }) {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full flex flex-col gap-4 px-2">
      <p className="font-bicubik text-center">{t("upload-company-documents")}</p>
      <div className="flex flex-col gap-4 max-h-full overflow-y-auto pb-4">
        <UploadFile
          id="authority"
          label={`${t("authority")} *`}
          placeholder={t("authority")}
          onChange={(e) => onUploadFile("authority", e.target?.files?.[0] || "")}
        />
        <UploadFile
          id="w9"
          label={`${t("W9")} *`}
          onChange={(e) => onUploadFile("w9", e.target?.files?.[0] || "")}
          placeholder={t("W9")}
        />
        <UploadFile
          id="insurance"
          label={`${t("insurance")} *`}
          onChange={(e) => onUploadFile("insurance", e.target?.files?.[0] || "")}
          placeholder={t("insurance")}
        />
        <UploadFile
          id="other-1"
          label={`${t("other")} 1`}
          onChange={(e) => onUploadFile("other1", e.target?.files?.[0] || "")}
          placeholder={`${t("other")} 1`}
        />
        <UploadFile
          id="other-2"
          label={`${t("other")} 2`}
          onChange={(e) => onUploadFile("other2", e.target?.files?.[0] || "")}
          placeholder={`${t("other")} 2`}
        />
      </div>
    </div>
  );
}

export default UploadCompanyDocuments;
