import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import "./styles.css";

export default function App({ width, height }) {
  const paleteSize = height / 10,
    BallSize = height / 25,
    ScoreBoardX = width / 2,
    ScoreBoardY = height / 5;

  const [
    { ball, leftPlayer, rightPlayer, leftPoints, rightPoints },
    setGameState
  ] = useState({
    ball: {
      x: width / 2,
      y: height / 2,
      dx: Math.random() - 0.5,
      dy: Math.random() - 0.5
    },
    leftPlayer: {
      y: height / 2,
      dy: 0
    },
    rightPlayer: {
      y: height / 2,
      dy: 0
    },
    leftPoints: 0,
    rightPoints: 0
  });

  const [playing, setPlaying] = useState(false);

  const animationRef = useRef();
  const prevTimeRef = useRef();

  const onKeyDown = ev => {
    switch (ev.key) {
      case "q":
        setGameState(({ leftPlayer: { y, dy }, ...rest }) => {
          return { ...rest, leftPlayer: { y, dy: -0.2 } };
        });
        break;
      case "a":
        setGameState(({ leftPlayer: { y, dy }, ...rest }) => {
          return { ...rest, leftPlayer: { y, dy: +0.2 } };
        });
        break;
      case "p":
        setGameState(({ rightPlayer: { y, dy }, ...rest }) => {
          return { ...rest, rightPlayer: { y, dy: -0.2 } };
        });
        break;
      case "l":
        setGameState(({ rightPlayer: { y, dy }, ...rest }) => {
          return { ...rest, rightPlayer: { y, dy: +0.2 } };
        });
        break;
      case "s":
        setPlaying(v => !v);
        prevTimeRef.current = 0;
        break;
      case "r":
        setGameState(({ ball, ...rest }) => ({
          ...rest,
          ball: {
            x: width / 2,
            y: height / 2,
            dx: Math.random() - 0.5,
            dy: Math.random() - 0.5
          }
        }));
        break;
      default:
    }
  };

  const onKeyUp = ev => {
    switch (ev.key) {
      case "q":
      case "a":
        setGameState(({ leftPlayer: { y }, ...rest }) => {
          return { ...rest, leftPlayer: { y, dy: 0 } };
        });
        break;
      case "l":
      case "p":
        setGameState(({ rightPlayer: { y }, ...rest }) => {
          return { ...rest, rightPlayer: { y, dy: 0 } };
        });
        break;
      default:
    }
  };

  const updatePlayerPos = (deltaTime, { y, dy }) => {
    const newY = y + (dy * deltaTime) / 2;
    if (newY > 10 && newY < height - paleteSize + 10) {
      return { y: newY, dy };
    } else {
      return { y, dy };
    }
  };

  const moveTheBall = time => {
    if (ball) {
      if (prevTimeRef.current) {
        const deltaTime = time - prevTimeRef.current;

        setGameState(
          ({ ball, leftPlayer, rightPlayer, leftPoints, rightPoints }) => {
            const b = ball;

            console.log("Data", ball, leftPlayer, rightPlayer);

            let newX = b.x + (b.dx * deltaTime) / 3;
            let newY = b.y + (b.dy * deltaTime) / 3;

            let newDx = b.dx;
            let newDy = b.dy;

            const newLeftPlayer = updatePlayerPos(deltaTime, leftPlayer);
            const newRightPlayer = updatePlayerPos(deltaTime, rightPlayer);

            if (newX < 20) {
              if (
                newY > newLeftPlayer.y &&
                newY < newLeftPlayer.y + paleteSize
              ) {
                newDx = -newDx;
              } else {
                rightPoints++;
                newX = width / 2;
                newY = height / 2;
                newDx = Math.random() - 0.5;
                newDy = Math.random() - 0.5;
              }
            }

            if (newX > width - 20) {
              if (
                newY > newRightPlayer.y &&
                newY < newRightPlayer.y + paleteSize
              ) {
                newDx = -newDx;
              } else {
                leftPoints++;
                newX = width / 2;
                newY = height / 2;
                newDx = Math.random() - 0.5;
                newDy = Math.random() - 0.5;
              }
            }

            if (newY > height - BallSize + 10 || newY < 10) {
              newDy = -newDy;
            }

            console.log("New Data", newX, newY, newLeftPlayer, newRightPlayer);

            return {
              ball: {
                x: newX,
                y: newY,
                dx: newDx,
                dy: newDy
              },
              leftPlayer: newLeftPlayer,
              rightPlayer: newRightPlayer,
              leftPoints,
              rightPoints
            };
          }
        );
      }

      prevTimeRef.current = time;
      if (playing) {
        animationRef.current = requestAnimationFrame(moveTheBall);
      }
    }
  };
  useLayoutEffect(() => {
    if (playing) {
      animationRef.current = requestAnimationFrame(moveTheBall);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [playing]);

  useEffect(() => {
    const sub1 = document.addEventListener("keydown", onKeyDown);
    const sub2 = document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", sub1);
      document.removeEventListener("keyup", sub2);
    };
  });
  return (
    <div
      className="board"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div
        className="score"
        style={{
          height: `${ScoreBoardX}px`,
          width: `${ScoreBoardY}px`
        }}
      >
        {leftPoints} : {rightPoints}
      </div>
      <div
        className="ball"
        style={{
          left: `${ball.x}px`,
          top: `${ball.y}px`,
          height: `${BallSize}px`,
          width: `${BallSize}px`
        }}
      />
      <div
        className="paleta"
        style={{
          left: "15px",
          top: `${leftPlayer.y}px`,
          height: `${paleteSize}px`
        }}
      />
      <div
        className="paleta"
        style={{
          left: `${width - 0}px`,
          top: `${rightPlayer.y}px`,
          height: `${paleteSize}px`
        }}
      />
    </div>
  );
}
