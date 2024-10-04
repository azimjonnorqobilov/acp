import { icons } from "assets/icons/icons";
import { toast } from "react-toastify";

export const toastify = {
  success: (message) =>
    toast.success(message, {
      icon: (
        <div className="bg-[#3F96D01A] rounded-md w-[2rem] h-[2rem] flex items-center justify-center">
          <icons.check className="fill-[#3F96D0] w-4" />
        </div>
      ),
      className: "dark:bg-[#1C394A] dark:text-white",
      bodyClassName: "[&>*:nth-child(1)]:w-auto [&>*:nth-child(2)]:font-bicubik",
      position: "bottom-right",
    }),

  error: (message) =>
    toast.error(message, {
      icon: (
        <div className="bg-[#FBE7E7] dark:bg-[#F10F0F1A] rounded-md w-[2rem] h-[2rem] flex items-center justify-center">
          <icons.close className="stroke-[#F10F0F] w-3 " />
        </div>
      ),
      className: "dark:bg-[#1C394A] dark:text-white",
      bodyClassName: "[&>*:nth-child(1)]:w-auto [&>*:nth-child(2)]:font-bicubik",
      position: "bottom-right",
    }),

  warning: (message) =>
    toast.warning(message, {
      icon: (
        <div className="bg-[#FAF3DA] dark:bg-[#4C4A43] rounded-md w-[2rem] h-[2rem] flex items-center justify-center">
          <icons.warning className="fill-[#D0B03F] w-5" />
        </div>
      ),
      className: "dark:bg-[#1C394A] dark:text-white",
      bodyClassName: "[&>*:nth-child(1)]:w-auto [&>*:nth-child(2)]:font-bicubik",
      position: "bottom-right",
    }),
};
