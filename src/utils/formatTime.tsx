function formatTime(
  time: number,
  nextTime?: number,
  showMiliseconds: boolean = false
) {
  const timeToShow = time > 0 || !nextTime ? time : nextTime;
  const minutes = timeToShow >= 0 ? Math.floor(timeToShow / (60 * 1000)) : 0;
  const seconds = timeToShow >= 0 ? Math.ceil((timeToShow / 1000) % 60) : 0;
  const miliseconds = timeToShow >= 0 ? Math.ceil(timeToShow % 1000) : 0;

  return `${formatMinutes(minutes, seconds)}:${formatSeconds(seconds)}${
    showMiliseconds ? `.${formatMiliseconds(miliseconds)}` : ""
  }`;
}

function formatMinutes(minutes: number, seconds: number) {
  if (seconds === 60) return minutes + 1;

  return minutes;
}

function formatSeconds(seconds: number) {
  if (seconds === 60) return "00";

  return seconds < 10 ? `0${seconds}` : seconds;
}

function formatMiliseconds(miliseconds: number) {
  const roundedMiliseconds = Math.round(miliseconds / 10);

  if (roundedMiliseconds === 100) return "00";

  return roundedMiliseconds < 10
    ? `0${roundedMiliseconds}`
    : roundedMiliseconds;
}

export { formatTime };
