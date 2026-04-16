import { supabase } from "./client";

let clockOffset = 0;

const SAMPLE_COUNT = 8;
const BEST_SAMPLE_COUNT = 4;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

async function measureOnce(): Promise<{ rtt: number; offset: number } | null> {
  const clientTimeStart = Date.now();
  const { data, error } = await supabase.rpc("get_server_time_ms");
  if (error || data == null) return null;
  const clientTimeEnd = Date.now();

  const rtt = clientTimeEnd - clientTimeStart;
  const offset = (data as number) - (clientTimeStart + rtt / 2);
  return { rtt, offset };
}

/**
 * NTP-like multi-sample clock sync.
 * Takes SAMPLE_COUNT measurements, keeps the BEST_SAMPLE_COUNT with lowest RTT
 * (lowest RTT ≈ most symmetric network path ≈ most accurate offset), and uses
 * the median offset to reject outliers.
 */
export async function initClockOffset(): Promise<void> {
  try {
    const samples: { rtt: number; offset: number }[] = [];

    for (let i = 0; i < SAMPLE_COUNT; i++) {
      const sample = await measureOnce();
      if (sample) samples.push(sample);
    }

    if (samples.length === 0) {
      console.warn("Could not initialize clock offset (no successful samples)");
      clockOffset = 0;
      return;
    }

    samples.sort((a, b) => a.rtt - b.rtt);
    const best = samples.slice(0, Math.min(BEST_SAMPLE_COUNT, samples.length));

    clockOffset = median(best.map((s) => s.offset));

    console.debug(
      `Clock offset initialized: ${clockOffset}ms (${best.length}/${samples.length} best samples, best RTT: ${best[0].rtt}ms)`,
    );
  } catch (error) {
    console.error("Error initializing clock offset:", error);
    clockOffset = 0;
  }
}

/**
 * Get the current time adjusted for server clock.
 * All clients using this will agree on "now" within the accuracy of the offset.
 */
export function getAdjustedNow(): number {
  return Date.now() + clockOffset;
}
