import { useState, useEffect } from "react";

const useCountdownTimer = (onTimerEnds, initialMinutes = 2) => {
  const timeCurr = parseInt((new Date).getTime()/1000)
  const [expiryTime, setExpiryTime] = useState(timeCurr + initialMinutes * 60)
  const [remainingTime, setRemainingTime] = useState(initialMinutes * 60);

  useEffect(() => {
    if(remainingTime<=0){
      interval && clearInterval(interval)
    }

    const interval = remainingTime > 0 && setInterval(()=>{
      const currTime = parseInt((new Date()).getTime()/1000)
      const remianing = expiryTime - currTime
      remianing > 0 && setRemainingTime(remianing);
      if(remianing <= 0){
        onTimerEnds();
        setRemainingTime(0);
      }
    },1000)

    return ()=>{
      interval && clearInterval(interval);
    }
    
  }, [onTimerEnds, remainingTime]);

  const resetTimer = () => {
    const currTime = parseInt((new Date()).getTime()/1000);
    setRemainingTime(initialMinutes * 60);
    setExpiryTime(currTime + initialMinutes * 60);
  };

  const restartTimer = () => {
    resetTimer();
  };

  const formattedTime = () => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return {
    remainingTime,
    resetTimer,
    formattedTime,
    restartTimer,
  };
};

export default useCountdownTimer;
