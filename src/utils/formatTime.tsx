function formatTime(time: number, showMiliseconds: boolean = false) {
  const minutes = Math.floor(time / (60 * 1000));
  const seconds = Math.ceil((time / 1000) % 60);
  const miliseconds = Math.ceil(time % 1000);

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
