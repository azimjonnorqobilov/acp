import { icons } from "assets/icons/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { signIn } from "store/slices/authSlice";
import { ROUTES } from "assets/constants/constants";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DotsLoader from "components/loader/DotsLoader";
import Input from "components/input/Input";

function SignIn() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState({ email: "", password: "" });
  const { isLoading, userInfo } = useSelector((store) => store.auth);

  document.title = t("sign-in");

  const handleChangeUser = (name, value) => {
    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSignIn = () => {
    !user?.email
      ? setErrors({ ...errors, email: t("enter-the-email") })
      : !user?.password
      ? setErrors({ ...errors, password: t("enter-the-password") })
      : dispatch(signIn(user));
  };

  useEffect(() => {
    userInfo?.id && navigate(ROUTES(userInfo?.entity_type)?.[0]?.collapses?.[0]?.route);
  }, [userInfo, navigate]);

  return (
    <div className="w-[25rem] bg-white rounded-3xl p-8 flex flex-col gap-4 md:w-full md:px-4 md:py-6 md:border md:border-[#D1DAE6]">
      <p className="font-bicubik text-center text-2xl">{t("sign-in")}</p>
      <Input
        id="email"
        type="email"
        label={t("email")}
        value={user?.email || ""}
        onChange={(e) => handleChangeUser("email", e.target.value)}
        className="w-full"
        classNameInput="text-base"
        themeMode="light"
        placeholder={t("email")}
        errorMessage={errors?.email || ""}
      />
      <Input
        id="password"
        label={t("password")}
        type="password"
        value={user?.password || ""}
        onChange={(e) => handleChangeUser("password", e.target.value)}
        className="w-full"
        themeMode="light"
        placeholder="* * * * * * * * * * *"
        errorMessage={errors?.password || ""}
      />
      <Link to="/reset-password" className="uppercase text-sm underline text-start">
        {t("forgot-your-password")}
      </Link>
      <button
        onClick={handleSignIn}
        className={`bg-blue px-8 py-2 h-10 rounded-lg text-lg  text-white flex items-center justify-center uppercase ${
          isLoading ? "" : ""
        }`}
      >
        {isLoading ? <DotsLoader /> : t("login")}
      </button>
      {/* <span className="text-red text-sm">{errorMessage}</span> */}
      <p className="text-gray uppercase text-sm text-center">{t("dont-have-an-account-yet")}</p>
      <Link to="/sign-up" className="flex items-center w-max mx-auto gap-2">
        <span className="text-blue text-lg uppercase">{t("sign-up")}</span>
        <icons.signUp className="fill-blue" />
      </Link>
    </div>
  );
}

export default SignIn;
