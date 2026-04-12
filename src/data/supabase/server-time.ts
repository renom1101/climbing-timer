import { supabase } from "./client";

let clockOffset = 0;

/**
 * Initialize clock offset by getting server's current time
 * This compensates for clock skew between client and server
 */
export async function initClockOffset(): Promise<void> {
  try {
    const clientTime = Date.now();

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

    const serverTime = data as number;

    // Calculate offset: how much the server time differs from client time
    clockOffset = serverTime - clientTime;

    console.debug(
      `Clock offset initialized: ${clockOffset}ms (server: ${serverTime}, client: ${clientTime})`,
    );
  } catch (error) {
    console.error("Error initializing clock offset:", error);
    clockOffset = 0;
  }
}

/**
 * Get the current time adjusted for server clock
 * This ensures all clients calculate elapsed time consistently
 */
export function getAdjustedNow(): number {
  return Date.now() + clockOffset;
}
