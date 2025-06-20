import { useEffect, useState } from "react";

export const Timer = () => {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  useEffect(() => {
    const calcTimeLeft = () => {
      const dateNow = new Date();
      const nextDay = new Date(dateNow);
      nextDay.setDate(dateNow.getDate() + 1);
      nextDay.setHours(0, 0, 0);

      const diffTime = Math.abs(nextDay.getTime() - dateNow.getTime());
      const totalSeconds = Math.floor(diffTime / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);

      const seconds = totalSeconds % 60;
      const minutes = totalMinutes % 60;
      const hours = Math.floor(totalMinutes / 60);

      setHour(hours);
      setMinute(minutes);
      setSecond(seconds);
    };

    calcTimeLeft();
    const interval = setInterval(calcTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center text-lg">
      <p>Time left until the next fighter is picked:</p>
      <p>{`${hour} Hours - ${minute} Minutes - ${second} Seconds`}</p>
    </div>
  );
};
