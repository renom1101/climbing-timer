export type TimerModel = {
  id: string;
  host_id: string;
  start_timestamp: number | null;
  is_preparation_time: boolean;
  stop_time_milliseconds: number | null;
  climbing_seconds: number;
  preparation_seconds: number;
  preparation_enabled: boolean;
  updated_at_ms: number | null;
  created_at: string;
};
