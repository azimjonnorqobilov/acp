import { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { editContact } from "store/slices/authSlice";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import Input from "components/input/Input";

function EditContact({ user, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [userContact, setUserContact] = useState({
    ...(user?.phone && { phone: user?.phone }),
    ...(user?.telegram && { telegram: user?.telegram }),
  });

  const handleChangeUserContact = (name, value) =>
    setUserContact({ ...userContact, [name]: value });

  const { mutate: handleSave, isLoading } = useMutation("edit-contact", () =>
    dispatch(editContact(userContact))
  );

  return (
    <div className="bg-white w-[20rem] p-6 rounded-xl flex flex-col gap-4 relative dark:bg-green_7">
      <button onClick={onClose} className="w-max h-max absolute top-4 right-4">
        <icons.close className="w-3 stroke-black dark:stroke-white" />
      </button>

      <p className="font-bicubik text-center dark:text-white">{t("edit-contact")}</p>

      <Input
        id="phone"
        mask="(999) 999-9999"
        label={t("phone")}
        value={userContact?.phone || ""}
        onChange={(e) => handleChangeUserContact("phone", e.target.value?.replaceAll("_", ""))}
        clearable
        placeholder="(999) 999-9999"
      />
      <Input
        id="telegram"
        label={t("telegram")}
        value={userContact?.telegram || ""}
        onChange={(e) => handleChangeUserContact("telegram", e.target.value)}
        clearable
        placeholder="@username"
      />
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

export default EditContact;
