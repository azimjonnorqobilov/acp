import { icons } from "assets/icons/icons";
import notification_sound from "assets/sounds/error.wav";
import { useNotification } from "assets/hooks/useNotification";
import { useMutation } from "react-query";

function NotificationSettings({
  count = 0,
  sound = true,
  theme = "classic",
  onChange = () => {},
  className = "w-7 h-7 p-[0.4rem]",
}) {
  useNotification({ audio: notification_sound, play: sound && count });

  const { mutate: handleChange, isLoading } = useMutation("notification-change", () =>
    onChange(!sound)
  );

  return (
    <div
      onClick={handleChange}
      className={`relative bg-white border border-gray_lighter flex items-center justify-center rounded-full cursor-pointer hover:scale-[1.2] transition dark:bg-[#1A313E] dark:border-[#2C495A] ${
        isLoading ? "notifcation-animation" : ""
      } ${theme === "acp" ? "w-10 h-10 p-[0.6rem]" : "w-5 h-5 p-[0.2rem]"}`}
    >
      {sound ? (
        <icons.notificationOn className="w-full h-full fill-[#04B30B]" />
      ) : (
        <icons.notificationOff className="w-full h-full fill-gray_dark dark:fill-white" />
      )}
      {count ? (
        <div
          className={`absolute  bg-blue  flex items-center justify-center text-white rounded-full ${
            theme === "acp"
              ? "px-1 text-xs top-[-3px] left-[27px]"
              : "px-1 h-3 text-[6px] top-[-2px] left-[13px]"
          }`}
        >
          {count}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default NotificationSettings;
