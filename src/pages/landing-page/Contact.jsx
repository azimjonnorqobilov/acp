import { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { icons } from "assets/icons/icons";
import { useTranslation } from "react-i18next";
import { sendHelp } from "store/slices/supportSlice";
import { Link, useNavigate } from "react-router-dom";
import MUIModal from "components/mui-modal/MUIModal";
import Textarea from "components/textarea/Textarea";
import Input from "components/input/Input";
import { Tooltip } from "@mui/material";

function Contact() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [data, setData] = useState({ topic: "contact_us" });

  document.title = t("contact-us");

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleChangeData = (name, value) => setData({ ...data, [name]: value });

  const { mutate: onSave } = useMutation("send-help", () => dispatch(sendHelp(data)), {
    onSuccess: () => {
      setData({ topic: "contact_us" });
      handleOpenModal();
    },
  });

  return (
    <>
      <MUIModal open={openModal}>
        <div className="bg-green_darker rounded-3xl md:rounded-xl w-[30rem] xl:w-[25rem] p-10 text-white text-center flex flex-col items-center gap-4 md:!w-[90%] md:p-5 md:mx-auto">
          <div className="w-[8rem] xl:w-[6rem] h-[8rem] xl:h-[6rem] border border-white flex justify-center items-center rounded-full">
            <icons.message className="fill-none stroke-white w-16 xl:w-14" />
          </div>

          <p className="font-bicubik text-2xl xl:text-xl">SENT SUCCESSFULLY!</p>
          <p className="w-[90%] text-lg xl:text-base text-[#FFFFFFB2]">
            We will get in touch with you after reviewing your request!
          </p>
          <button
            onClick={handleCloseModal}
            className="bg-blue rounded-xl px-10 py-2 text-lg xl:text-base md:w-full"
          >
            CLOSE
          </button>
        </div>
      </MUIModal>
      <div className="flex flex-col items-center gap-4 h-full pt-6 md:py-2 md:h-auto">
        <div className="flex justify-center gap-8 lg:gap-4 lg:px-4 md:!px-0 md:flex-col">
          <div className="w-[30rem] border border-white_10 p-6 rounded-2xl flex flex-col gap-6 lg:w-1/2 md:!w-full">
            <p className="text-5xl xl:text-3xl md:text-2xl font-bicubik">{t("contact-us")}</p>
            <p id="contact-us-description" className="text-white_70 text-xl xl:text-base">
              {t("contact-us-description")}
            </p>
            {/* <p className="text-white_70 text-xl xl:text-base">
              Feel free to get in touch with us at{" "}
              <span className="text-white">{`\t`} ACP Loads </span> to unlock a world of efficient
              and reliable logistics services. We understand the importance of seamless
              communication in the logistics industry
            </p> */}
            <p className="uppercase font-semibold text-xl xl:text-lg">
              {t("contact-information")}:
            </p>
            <div className="grid grid-cols-2 gap-y-2 text-lg xl:text-base md:text-sm">
              <span className="text-white_70">{t("phone-number")}:</span>
              <span>+1 408-676-5535</span>
              <span className="text-white_70">{t("email")}:</span>
              <span>info@acploads.com</span>
              <span className="text-white_70">{t("location")}:</span>
              <span>38511 S Hampton Dr Frankford, DE 19945 USA</span>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip
                arrow
                title={<span className="uppercase">{t("copied-mail")}</span>}
                open={openTooltip}
                disableHoverListener
                onClick={() => {
                  navigator.clipboard.writeText("info@acploads.com");
                  setOpenTooltip(true);
                  setTimeout(() => {
                    setOpenTooltip(false);
                  }, 2000);
                }}
              >
                <div className="border border-blue rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                  <icons.outlook className="fill-blue w-4 h-4" />
                </div>
              </Tooltip>
              <Link
                to="https://t.me/anycappro_com"
                rel="noreferrer"
                target="_blank"
                className="border border-blue rounded-full w-7 h-7 flex items-center justify-center"
              >
                <icons.telegram_no_border className="fill-blue w-4 h-4" />
              </Link>

              <Link
                to="https://www.instagram.com/acploads/"
                rel="noreferrer"
                target="_blank"
                className="border border-blue rounded-full w-7 h-7 flex items-center justify-center"
              >
                <icons.instagram className="fill-blue w-4 h-4" />
              </Link>
              <Link
                to="https://www.youtube.com/@acploads"
                rel="noreferrer"
                target="_blank"
                className="border border-blue rounded-full w-7 h-7 flex items-center justify-center"
              >
                <icons.youtube className="fill-blue w-4 h-4" />
              </Link>
              <Link
                to="https://www.linkedin.com/in/acp-loads-155277302/"
                rel="noreferrer"
                target="_blank"
                className="border border-blue rounded-full w-7 h-7 flex items-center justify-center"
              >
                <icons.linkedin className="fill-blue w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="w-[30rem] border border-white_10 p-6 rounded-2xl flex flex-col gap-6 lg:w-1/2 md:!w-full">
            <p className="text-2xl xl:text-xl md:text-xl font-bicubik">
              {t("question-or-suggestion")}
            </p>
            <Input
              id="name"
              label={t("name")}
              value={data?.first_name || ""}
              onChange={(e) => handleChangeData("first_name", e.target.value)}
              placeholder={t("your-name")}
              themeMode="dark"
              className="w-full uppercase"
            />
            <Input
              id="email"
              label={t("email")}
              type="email"
              value={data?.email || ""}
              onChange={(e) => handleChangeData("email", e.target.value)}
              themeMode="dark"
              className="w-full uppercase"
              placeholder={t("your-email")}
            />
            <Textarea
              rows={4}
              id="question-or-suggestion"
              label={t("question-or-suggestion")}
              value={data?.comment || ""}
              onChange={(e) => handleChangeData("comment", e.target.value)}
              themeMode="dark"
              className="w-full uppercase"
              placeholder={t("your-question-or-suggestion")}
              classNameTextarea="resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={onSave}
                disabled={["first_name", "email", "comment"].every((e) => data?.[e]) ? false : true}
                className={`uppercase flex items-center gap-2 bg-blue rounded-lg px-4 py-2 text-lg xl:text-base md:w-full md:justify-center ${
                  ["first_name", "email", "comment"].every((e) => data?.[e])
                    ? ""
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {t("send")} <icons.send className="w-3 fill-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center text-center gap-2 mt-6 md:px-4 md:pt-4">
          <p className="text-3xl xl:text-2xl md:text-xl font-bicubik">{t("need-to-now-more")}</p>
          <p className="text-white_70 text-lg xl:text-base">{t("about-our-loadborad")}</p>
          <button
            onClick={() => navigate("/how-it-works")}
            className="px-4 py-2 bg-blue text-white rounded-lg text-lg xl:text-base uppercase"
          >
            {t("how-it-works")}
          </button>
        </div>
      </div>
    </>
  );
}

export default Contact;
