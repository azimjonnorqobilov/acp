import { useState } from "react";
import { useMutation } from "react-query";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { checkingEmail, createEmployee } from "store/slices/userSlice";
import BounceDotsLoader from "components/loader/BounceDotsLoader";
import { toastify } from "components/toastify/toastify";
import Input from "components/input/Input";

function CreateUserForm({ onAdd }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    user: {
      verificationCompany: { checkedEmail },
    },
  } = useSelector((store) => store);
  const [user, setUser] = useState({});

  const handleChangeUser = (name, value) => setUser({ ...user, [name]: value });

  const handleCheckingEmail = (email) => dispatch(checkingEmail(email));

  const { mutate: handleSave, isLoading } = useMutation(
    "create-employee",
    () => {
      user?.password?.length &&
        user?.password1?.length &&
        user?.password !== user?.password1 &&
        toastify.error("Incorrect Password");

      if (
        ["first_name", "last_name", "email", "password", "password1"].every((e) => {
          !user?.[e] && toastify.error(`${e?.replaceAll("_", " ")} required!`);
          return user?.[e];
        }) &&
        user?.password === user?.password1 &&
        checkedEmail?.status === 200
      )
        return dispatch(createEmployee(user));
    },
    { onSuccess: () => onAdd() }
  );

  return (
    <div className="w-[30rem] h-full overflow-y-auto lg:w-full flex flex-col items-end">
      <p className="w-full font-bicubik text-center uppercase lg:text-start pb-4">
        {t("add-new-user")}
      </p>
      <div className="w-full h-[calc(100%-40px-36px)] overflow-y-auto">
        <div className="w-full h-full grid grid-cols-2 lg:grid-cols-1 gap-4 pb-4 px-2">
          <Input
            id="firt-name"
            label={`${t("first-name")} *`}
            value={user?.first_name}
            onChange={(e) => handleChangeUser("first_name", e.target.value)}
            clearable
            placeholder={t("first-name")}
          />
          <Input
            id="last-name"
            label={`${t("last-name")} *`}
            value={user?.last_name}
            onChange={(e) => handleChangeUser("last_name", e.target.value)}
            clearable
            placeholder={t("last-name")}
          />
          <Input
            id="email"
            type="email"
            label={`${t("email")} *`}
            value={user?.email}
            onBlur={(e) => handleCheckingEmail(e.target.value)}
            onChange={(e) => handleChangeUser("email", e.target.value)}
            clearable
            placeholder={t("email")}
            errorMessage={(checkedEmail?.status !== 200 && checkedEmail?.message) || ""}
          />
          <Input
            id="phone"
            mask="(999) 999-9999"
            label={t("cell-phone")}
            value={user?.phone}
            onChange={(e) => handleChangeUser("phone", e.target.value?.replaceAll("_", ""))}
            clearable
            placeholder={t("cell-phone")}
          />
          <Input
            id="password"
            type="password"
            label={`${t("password")} *`}
            value={user?.password}
            onChange={(e) => handleChangeUser("password", e.target.value)}
            placeholder="* * * * * * * * * * *"
          />
          <Input
            id="confirm-password"
            type="password"
            label={`${t("confirm-password")} *`}
            value={user?.password1}
            onChange={(e) => handleChangeUser("password1", e.target.value)}
            placeholder="* * * * * * * * * * *"
          />
        </div>
      </div>
      <button
        disabled={
          ["first_name", "last_name", "email", "password", "password1"].every((e) => user?.[e]) &&
          user?.password === user?.password1 &&
          checkedEmail?.status === 200
            ? false
            : true
        }
        onClick={handleSave}
        className={`bg-blue text-white px-10 py-2 text-sm rounded-lg uppercase lg:w-full ${
          ["first_name", "last_name", "email", "password", "password1"].every((e) => user?.[e]) &&
          user?.password === user?.password1 &&
          checkedEmail?.status === 200
            ? ""
            : "opacity-50 cursor-not-allowed"
        }`}
      >
        {t("add")}
      </button>

      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center rounded-xl">
          <BounceDotsLoader />
        </div>
      )}
    </div>
  );
}

export default CreateUserForm;
