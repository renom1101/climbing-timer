import { supabase } from "./client";

let clockOffset = 0;

/**
 * Initialize clock offset by getting server's current time
 * This compensates for clock skew between client and server
 * Accounts for network latency (RTT) to ensure accuracy
 */
export async function initClockOffset(): Promise<void> {
  try {
    const clientTimeStart = Date.now();

    // Execute a query that returns the server's current time
    const { data, error } = await supabase.rpc("get_server_time_ms");

    if (error) {
      console.warn(
        "Could not initialize clock offset (function not found, using fallback):",
        error,
      );
      clockOffset = 0;
      return;
    }

    const clientTimeEnd = Date.now();
    const serverTime = data as number;

    // Calculate round-trip time (RTT)
    const rtt = clientTimeEnd - clientTimeStart;
    
    // The server time is from the middle of the RTT period
    // Use midpoint of client time to estimate when server executed the RPC
    const clientTimeMidpoint = clientTimeStart + rtt / 2;
    
    // Calculate offset accounting for network latency
    clockOffset = serverTime - clientTimeMidpoint;

    console.debug(
      `Clock offset initialized: ${clockOffset}ms (server: ${serverTime}, client midpoint: ${clientTimeMidpoint}, RTT: ${rtt}ms)`,
    );
  } catch (error) {
    console.error("Error initializing clock offset:", error);
    clockOffset = 0;
  }
}

/**
 * Refine clock offset based on server timestamp
 * Called when receiving realtime updates with updated_at_ms (exact server time)
 * This ensures per-device clock calibration is accurate
 */
export function refineClockOffset(serverTimestamp: number): void {
  const currentDeviceTime = Date.now();
  const measuredOffset = serverTimestamp - currentDeviceTime;
  
  // Smoothly update offset towards the measured value
  // This prevents abrupt jumps while still correcting drift
  clockOffset = Math.round((clockOffset + measuredOffset) / 2);
  
  if (Math.abs(measuredOffset - clockOffset) > 100) {
    console.debug(
      `Clock offset refined to ${clockOffset}ms (measured: ${measuredOffset}ms)`,
    );
  }
}

/**
 * Get the current time adjusted for server clock
 * This ensures all clients calculate elapsed time consistently
 */
export function getAdjustedNow(): number {
  return Date.now() + clockOffset;
}
