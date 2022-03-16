import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import Focus from "./Focus";
import Break from "./Break"
import PlayStop from "./PlayStop"
import SessionTimer from "./SessionTimer"

function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

function nextSession(focusDuration, breakDuration) {
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [session, setSession] = useState(null);
  const [focusDuration, setFocusDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [disableControl, setDisableControl] = useState(false)
  const [disableStop, setDisableStop] = useState(true)

  const focusDecrease = () => {
    setFocusDuration(Math.max(5, focusDuration - 5));
  };
  const focusIncrease = () => {
    setFocusDuration(Math.min(60, focusDuration + 5));
  };

  const breakDecrease = () => {
    setBreakDuration(Math.max(1, breakDuration - 1));
  };
  const breakIncrease = () => {
    setBreakDuration(Math.min(15, breakDuration + 1));
  };

  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  function playPause() {
    setDisableControl(true)
    setDisableStop(false)
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  function handleStop () {
    setDisableControl(false)
    setIsTimerRunning(false)
    setFocusDuration(25)
    setBreakDuration(5)
    setDisableStop(true)
    setSession(null)
  }


  return (
    <div className="pomodoro">
      <div className="row">
        <Focus focusIncrease = {focusIncrease}
        focusDecrease = {focusDecrease}
        focusDuration = {focusDuration}
        disableControl = {disableControl} />
        <Break breakIncrease = {breakIncrease}
        breakDecrease = {breakDecrease}
        breakDuration = {breakDuration}
        disableControl = {disableControl} />
      </div>
      <div className="row">
        <PlayStop isTimerRunning={isTimerRunning}
          playPause={playPause} 
          handleStop = {handleStop}
          disableStop = {disableStop} />
      </div>
      <SessionTimer session={session}
          focusDuration={focusDuration}
          breakDuration={breakDuration} />
    </div>
  );
}

export default Pomodoro;