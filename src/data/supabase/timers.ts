import { supabase } from "./client";

export async function getFirstTimer() {
  const { data: timers } = await supabase
    .from("timers")
    .select()
    .overrideTypes<TimerModel[]>();
  const timer = timers?.[0];

  return timer;
}

export async function getTimerByUserId(userId: string) {
  const { data: timers } = await supabase
    .from("timers")
    .select()
    .overrideTypes<TimerModel[]>();
  const timer = timers?.find((timer) => timer.host_id === userId);

  return timer;
}

export async function getTimerById(id: string) {
  const { data: timers } = await supabase
    .from("timers")
    .select()
    .eq("id", id)
    .overrideTypes<TimerModel[]>();
  const timer = timers?.[0];

  return timer;
}

export async function createNewTimer() {
  const { data: timers } = await supabase
    .from("timers")
    .insert({})
    .select()
    .overrideTypes<TimerModel[]>();

  const timer = timers?.[0];

  return timer;
}

export async function updateTimer(timer: Partial<TimerModel>) {
  const { data: timers } = await supabase
    .from("timers")
    .update(timer)
    .eq("id", timer.id)
    .select()
    .overrideTypes<TimerModel[]>();

  const updatedTimer = timers?.[0];

  return updatedTimer;
}
