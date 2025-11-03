import { useEffect, useState } from "react";

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetDate));

  function getTimeRemaining(endTime) {
    const total = new Date(endTime) - new Date();
    if (total <= 0) {
      return {
        total: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { total, days, hours, minutes, seconds };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.total <= 0) {
    return <span className="text-red-500 font-medium">Muddati tugagan</span>;
  }

  return (
    <span className="font-medium text-blue-500">
      {timeLeft.days > 0 && `${timeLeft.days} kun `}
      {timeLeft.hours > 0 && `${timeLeft.hours} soat `}
      {timeLeft.minutes > 0 && `${timeLeft.minutes} daqiqa `}
      {`${timeLeft.seconds} soniya`}
    </span>
  );
}

export default CountdownTimer;
