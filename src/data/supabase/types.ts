type TimerModel = {
  id: string;
  host_id: string;
  start_timestamp: number | null;
  climbing_seconds: number;
  preparation_seconds: number;
  preparation_enabled: boolean;
  created_at: string;
};
