import React, { useRef, useEffect } from "react";
import { useMachine } from "@xstate/react";
import { videoPlayerMachine } from "./machines/videoPlayerMachine";
import { MaxIcon, MinIcon, PlayIcon, StopIcon, CloseIcon, OpenIcon } from "./utils/Icons";
import "./App.css";

function App() {
  const [state, send] = useMachine(videoPlayerMachine);
  const { url, playing } = state.context;
  const videoRef = useRef(null);

  const isClosed = state.matches("closed");
  const isNormal = state.matches("normal");
  const isMinimized = state.matches("minimized");

  useEffect(() => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.play().catch((e) => {
          if (!e.toString().includes("AbortError")) {
            console.log("Ошибка воспроизведения:", e);
          }
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing]);

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    send({ type: "CLOSE" });
  };

  const getPlayButtonClass = () => {
    return playing
      ? "control-button control-button--pause"
      : "control-button control-button--play";
  };

  return (
    <div className="video-app">
      <div
        className={`video-app__controls ${
          isClosed ? "" : "video-app__controls--hidden"
        }`}
      >
        {isClosed && (
          <button
            className="open-button"
            onClick={() => send({ type: "OPEN" })}
          > <OpenIcon />
            
          </button>
        )}
      </div>

      {(isNormal || isMinimized) && (
        <div className="video-player__container" onClick={handleClose}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={`video-player ${
              isMinimized ? "video-player--minimized" : ""
            }`}
          >
            <div className="video-app__title-container">
              <p className="video-app__title">Player</p>
              <button
                className="control-button control-button--close"
                onClick={handleClose}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="video-player-container">
              <video
                ref={videoRef}
                src={url}
                className="video-player__video"
                onError={(e) => console.log("Ошибка видео:", e)}
                controls={false}
              />
            </div>
            <div className="video-player__controls">
              <button
                className={getPlayButtonClass()}
                onClick={() => {
                  if (playing) {
                    send({ type: "PAUSE" });
                  } else {
                    send({ type: "PLAY" });
                  }
                }}
              >
                {playing ? <StopIcon /> : <PlayIcon />}
              </button>

              <div className="button-group">
                {isNormal && (
                  <button
                    className="control-button control-button--minimize"
                    onClick={() => send({ type: "MINIMIZE" })}
                  >
                    <MinIcon />
                  </button>
                )}

                {isMinimized && (
                  <button
                    className="control-button control-button--maximize"
                    onClick={() => send({ type: "MAXIMIZE" })}
                  >
                    <MaxIcon />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
