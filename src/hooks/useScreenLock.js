import { useState } from "react";

const useScreenLock = () => {
  const [screenLock, setScreenLock] = useState();

  const isLocked = !screenLock ? false : !screenLock.released;

  function isScreenLockSupported() {
    return "wakeLock" in navigator;
  }

  async function lock() {
    if (isScreenLockSupported()) {
      try {
        const lock = await navigator.wakeLock.request("screen");
        setScreenLock(lock);
        console.log("Locked");
      } catch (err) {
        console.log(err.name, err.message);
      }
      return screenLock;
    }
  }

  function release() {
    if (typeof screenLock !== "undefined" && screenLock != null) {
      screenLock.release().then(() => {
        console.log("Lock released 🎈");
        setScreenLock(undefined);
      });
    }
  }

  return { lock, release, isLocked };
};

export default useScreenLock;
