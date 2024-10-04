import { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "react-query";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { TOPICS } from "assets/constants/constants";
import { sendHelp } from "store/slices/supportSlice";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import Textarea from "components/textarea/Textarea";
import MUIMenu from "components/mui-menu/MUIMenu";
import Input from "components/input/Input";

function Help({ topic, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [data, setData] = useState({ topic });

  const handleChangeData = (name, value) => setData({ ...data, [name]: value });

  const { mutate: onSave, isLoading } = useMutation("send-help", () => dispatch(sendHelp(data)), {
    onSuccess: () => onClose(),
  });

  return (
    <div className="bg-white w-[25rem] lg:w-[96%] lg:max-h-[98%] py-6 px-4 lg:p-4 rounded-xl flex flex-col relative dark:bg-green_7">
      <button onClick={onClose} className="w-max h-max absolute top-4 right-4">
        <icons.close className="w-3 stroke-black dark:stroke-white" />
      </button>
      <p className="font-bicubik text-center dark:text-white lg:text-start">{t("help")}</p>
      <div className="flex flex-col flex-1 overflow-y-auto gap-4 px-2 py-4">
        <MUIMenu
          id="topic"
          label={t("topic")}
          value={data?.topic || ""}
          onChange={(value) => handleChangeData("topic", value)}
          options={TOPICS}
          clearable
          placeholder={t("topic")}
        />
        <Input
          id="name"
          label={t("first-name")}
          value={data?.first_name}
          onChange={(e) => handleChangeData("first_name", e.target.value)}
          placeholder={t("first-name")}
          clearable
        />
        <Input
          id="name"
          label={t("last-name")}
          value={data?.last_name}
          onChange={(e) => handleChangeData("last_name", e.target.value)}
          placeholder={t("last-name")}
          clearable
        />
        <Input
          id="email"
          label={t("email")}
          value={data?.email}
          onChange={(e) => handleChangeData("email", e.target.value)}
          placeholder={t("email")}
          clearable
        />
        <Input
          id="phone"
          mask="(999) 999-9999"
          label={t("phone")}
          value={data?.phone}
          onChange={(e) => handleChangeData("phone", e.target.value?.replaceAll("_", ""))}
          clearable
          placeholder={`${t("phone")} (${t("optional")})`}
        />
        <Textarea
          id="description"
          rows={4}
          label={t("description")}
          value={data?.comment}
          onChange={(e) => handleChangeData("comment", e.target.value)}
          placeholder={t("description")}
          classNameTextarea="resize-none"
        />
      </div>
      <div className="px-2">
        <button
          onClick={onSave}
          disabled={!["topic", "first_name", "email", "comment"].every((e) => data?.[e])}
          className={`bg-blue text-white px-10 py-2 rounded-lg text-sm uppercase w-full ${
            ["topic", "first_name", "email", "comment"].every((e) => data?.[e])
              ? ""
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          {t("send")}
        </button>
      </div>

      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center rounded-xl">
          <BounceDotsLoader />
        </div>
      )}
    </div>
  );
}

export default Help;
