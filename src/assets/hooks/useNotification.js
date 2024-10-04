import { useEffect } from "react";

export const useNotification = ({ audio, returnPlayTime, play }) => {
  const audioRef = new Audio(audio);

  useEffect(() => {
    play &&
      (returnPlayTime
        ? setInterval(() => {
            audioRef.play();
          }, returnPlayTime * 1000)
        : audioRef.play());
  }, [play]);

  return { onPlay: () => audioRef.play() };
};
