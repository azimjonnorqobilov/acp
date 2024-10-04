import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import BounceDotsLoader from "components/loader/BounceDotsLoader";

function Delete({ isDeleting, onDelete, onCancel }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white w-[18rem] px-4 pt-10 pb-6 rounded-xl flex flex-col items-center gap-4 relative dark:bg-green_7">
      <button onClick={onCancel} className="w-max h-max absolute top-4 right-4">
        <icons.close className="w-3 stroke-black dark:stroke-white" />
      </button>
      {isDeleting && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center rounded-xl">
          <BounceDotsLoader />
        </div>
      )}
      <p className="text-center uppercase font-bicubik dark:text-white">
        {t("are-you-sure-to-delete")}
      </p>
      <div className="w-[80%] flex gap-4">
        <button
          onClick={onDelete}
          className="w-1/2 bg-blue px-4 py-2 rounded-lg text-sm text-white uppercase"
        >
          {t("yes")}
        </button>
        <button
          onClick={onCancel}
          className="w-1/2 bg-[#F2F5F9] px-4 py-2 rounded-lg text-sm uppercase dark:bg-green_8 dark:text-white"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}

export default Delete;
