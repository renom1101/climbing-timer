import dingUrl from "../assets/ding.wav";
import dongUrl from "../assets/dong.wav";

const dingAudio = new Audio(dingUrl);
const dongAudio = new Audio(dongUrl);

function playDing() {
  dingAudio.pause();
  dingAudio.currentTime = 0;
  dingAudio.play();
}

function playDong() {
  dongAudio.pause();
  dongAudio.currentTime = 0;
  dongAudio.play();
}

export { playDing, playDong };
