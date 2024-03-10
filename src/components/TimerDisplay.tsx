import { formatTime } from "../utils/formatTime";

type Props = {
  timeLeft: number;
};

const TimerDisplay = ({ timeLeft }: Props) => {
  return (
    <div>
      <div className="flex justify-center">
        <h1 className="font-montserrat-mono font-semibold text-[25vw]">
          {formatTime(timeLeft)}
        </h1>
      </div>
    </div>
  );
};

export default TimerDisplay;
