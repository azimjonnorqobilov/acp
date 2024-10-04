import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";

function TermsOfService({ onClose }) {
  const { t } = useTranslation();

  return (
    <div className="w-[50rem] md:!w-full h-[45rem] xl:h-[40rem] md:!h-full bg-white flex flex-col items-center p-6 md:p-4 rounded-2xl relative md:!rounded-none">
      <button onClick={onClose} className="w-max h-max absolute top-4 right-4">
        <icons.close className="w-3 stroke-black dark:stroke-white" />
      </button>

      <p className="text-3xl xl:text-2xl font-bicubik pt-4">{t("terms-of-service")}</p>
      <p className="text-xl xl:text-lg pb-2 pt-4 font-bicubik">{t("aggrement")}</p>
      <div className="h-[calc(100%-52px-52px)] xl:h-[calc(100%-48px-52px)] bg-[#F2F5F9] py-4 pl-4 pr-2 rounded-2xl">
        <div className="h-full overflow-y-auto table-scrollbar flex flex-col gap-2 xl:text-sm">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum ut officia quas quis
            accusantium deleniti aspernatur quia quibusdam doloremque similique veniam accusamus
            delectus consectetur deserunt neque, dolor harum laborum tempora quidem molestias quae
            mollitia corrupti numquam? In facere consequatur laboriosam beatae sit ab et, asperiores
            ullam nobis quisquam, quibusdam laudantium itaque cumque enim eos deserunt adipisci.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum ut officia quas quis
            accusantium deleniti aspernatur quia quibusdam doloremque similique veniam accusamus
            delectus consectetur deserunt neque, dolor harum laborum tempora quidem molestias quae
            mollitia corrupti numquam? In facere consequatur laboriosam beatae sit ab et, asperiores
            ullam nobis quisquam, quibusdam laudantium itaque cumque enim eos deserunt adipisci.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum ut officia quas quis
            accusantium deleniti aspernatur quia quibusdam doloremque similique veniam accusamus
            delectus consectetur deserunt neque, dolor harum laborum tempora quidem molestias quae
            mollitia corrupti numquam? In facere consequatur laboriosam beatae sit ab et, asperiores
            ullam nobis quisquam, quibusdam laudantium itaque cumque enim eos deserunt adipisci.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum ut officia quas quis
            accusantium deleniti aspernatur quia quibusdam doloremque similique veniam accusamus
            delectus consectetur deserunt neque, dolor harum laborum tempora quidem molestias quae
            mollitia corrupti numquam? In facere consequatur laboriosam beatae sit ab et, asperiores
            ullam nobis quisquam, quibusdam laudantium itaque cumque enim eos deserunt adipisci.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum ut officia quas quis
            accusantium deleniti aspernatur quia quibusdam doloremque similique veniam accusamus
            delectus consectetur deserunt neque, dolor harum laborum tempora quidem molestias quae
            mollitia corrupti numquam? In facere consequatur laboriosam beatae sit ab et, asperiores
            ullam nobis quisquam, quibusdam laudantium itaque cumque enim eos deserunt adipisci.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum ut officia quas quis
            accusantium deleniti aspernatur quia quibusdam doloremque similique veniam accusamus
            delectus consectetur deserunt neque, dolor harum laborum tempora quidem molestias quae
            mollitia corrupti numquam? In facere consequatur laboriosam beatae sit ab et, asperiores
            ullam nobis quisquam, quibusdam laudantium itaque cumque enim eos deserunt adipisci.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum ut officia quas quis
            accusantium deleniti aspernatur quia quibusdam doloremque similique veniam accusamus
            delectus consectetur deserunt neque, dolor harum laborum tempora quidem molestias quae
            mollitia corrupti numquam? In facere consequatur laboriosam beatae sit ab et, asperiores
            ullam nobis quisquam, quibusdam laudantium itaque cumque enim eos deserunt adipisci.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
