import { useEffect } from "react";
import { supabase } from "../data/supabase/client";
import { TimerModel } from "../data/supabase/types";

interface UseTimerSubscriptionProps {
  timerId: string | null;
  onUpdate: (timer: Partial<TimerModel>) => void;
}

export function useTimerSubscription({
  timerId,
  onUpdate,
}: UseTimerSubscriptionProps) {
  useEffect(() => {
    if (!timerId) return;

    // Subscribe to realtime updates for this specific timer
    const channel = supabase
      .channel(`timers:id=eq.${timerId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "timers",
          filter: `id=eq.${timerId}`,
        },
        (payload) => {
          // payload.new contains the updated row
          onUpdate(payload.new);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount or timer change
    return () => {
      channel.unsubscribe();
    };
  }, [timerId, onUpdate]);
}
