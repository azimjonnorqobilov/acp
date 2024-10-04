import { useState } from "react";
import { useMutation } from "react-query";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { editUserPassword } from "store/slices/authSlice";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import Input from "components/input/Input";

function EditPassword({ onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    auth: { editPassword },
  } = useSelector((store) => store);
  const [data, setData] = useState({});

  const handleChangeData = (name, value) => setData({ ...data, [name]: value });

  const { mutate: handleSave, isLoading } = useMutation("edit-password", () =>
    dispatch(editUserPassword(data))
  );

  return (
    <div className="bg-white w-[20rem] p-6 rounded-xl flex flex-col gap-4 relative dark:bg-green_7">
      <button onClick={onClose} className="w-max h-max absolute top-4 right-4">
        <icons.close className="w-3 stroke-black dark:stroke-white" />
      </button>
      <p className="font-bicubik text-center dark:text-white">{t("edit-password")}</p>
      <Input
        id="current-password"
        type="password"
        value={data?.old_password || ""}
        label={t("current-password")}
        onChange={(e) => handleChangeData("old_password", e.target.value)}
        placeholder="* * * * * * * * * * *"
      />
      <hr className="border-[1] border-gray_lighter dark:border-green_8" />
      <Input
        id="new-password"
        type="password"
        value={data?.password || ""}
        label={t("new-password")}
        onChange={(e) => handleChangeData("password", e.target.value)}
        placeholder="* * * * * * * * * * *"
      />
      <Input
        id="confirm-password"
        type="password"
        value={data?.password1 || ""}
        label={t("confirm-password")}
        onChange={(e) => handleChangeData("password1", e.target.value)}
        placeholder="* * * * * * * * * * *"
      />
      {editPassword?.status === 400 && (
        <span className="text-red text-sm ">{editPassword?.message}</span>
      )}
      <button
        onClick={handleSave}
        className="bg-blue text-white px-8 py-2 rounded-lg text-sm uppercase w-full"
      >
        {t("save")}
      </button>
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center rounded-xl">
          <BounceDotsLoader />
        </div>
      )}
    </div>
  );
}

export default EditPassword;
