import { useEffect, useState } from "react";

function DownTimer({ initialTime }) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    setTime(initialTime - 1);
  }, [initialTime]);

  useEffect(() => {
    if (time >= 0) {
      const timerId = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
    return setTime(initialTime);
  }, [time, initialTime]);

  return <div className="w-5 text-end">{time}s</div>;
}

export default DownTimer;
