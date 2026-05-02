import { formatTime } from "../utils/formatTime";

type Props = {
  timeLeft: number;
};

const TimerDisplay = ({ timeLeft }: Props) => {
  const timeText = formatTime(timeLeft);
  const timeLength = Math.max(1, timeText.length);
  const monoCharWidthRatio = 0.62;
  const fontSize = `calc(95vw / ${timeLength} / ${monoCharWidthRatio})`;

  return (
    <div>
      <div className="flex justify-center">
        <div className="w-[95vw]">
          <h1
            className="w-full whitespace-nowrap text-center font-montserrat-mono font-semibold leading-none text-text tabular-nums"
            style={{ fontSize }}
          >
            {timeText}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
