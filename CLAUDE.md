# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check (`tsc`) and build for production
- `npm run lint` — ESLint over `.ts`/`.tsx`, fails on any warning
- `npm run preview` — preview built bundle

There is no test suite. Requires a `.env.local` populated from `.env.example` (Firebase + Supabase credentials) to run.

## Architecture

Single-page React + TypeScript + Vite app. A climbing interval timer that syncs across clients in realtime via Supabase. Hosted on Firebase Hosting (prod + beta targets).

### Timer state lives in Supabase, not in the client

The source of truth is one row in the `timers` table (see [TimerModel](src/data/supabase/types.ts)). Every client subscribes to realtime `UPDATE` events on its row and mirrors DB state into local React state. The URL path is the timer id (`window.location.pathname.substring(1)`); visiting `/<timer-id>` joins that timer.

- **Owner vs viewer:** `isTimerOwner = timer.host_id === userId`. Only the owner writes to the DB. Viewers are read-only — [Main.tsx](src/components/Main.tsx) renders just `<TimerDisplay>` for them.
- **Anonymous auth:** [useSession.tsx](src/hooks/useSession.tsx) signs in anonymously via Supabase if no session exists, giving each browser a stable `userId`.
- **Realtime echo loop:** DB writes happen **only** from user-action handlers (`startTimer`/`stopTimer`/`resetTimer` and the setting updaters). The mirror `useEffect` in [useTimer.tsx](src/hooks/useTimer.tsx) reads DB state into local state but never writes back. Preserve this invariant when editing — it's what prevents realtime updates from re-triggering writes.

### Time is computed, not ticked

`startTimestamp` (server ms) + `updated_at_ms` (server ms when row last changed) are the only persisted time fields. [useTimer.tsx](src/hooks/useTimer.tsx) recomputes `timeLeft` every 16ms from `elapsedMs = (updatedAtMs - startTimestamp) + (now - updatedAtMs)`, then takes `elapsed % cycleDurationMs` to find the position within the current prep+climb cycle. The timer auto-loops; there is no "duration" field.

Pause is encoded as `stopTimeMilliseconds != null` (frozen remaining time in current phase). Resume reconstructs a new `startTimestamp` so that `now - startTimestamp` equals the elapsed-at-pause.

### Clock sync (NTP-like)

Clients call the `get_server_time_ms` RPC, do 8 samples, keep the 4 with lowest RTT, and use the median offset — see [server-time.ts](src/data/supabase/server-time.ts). Use `getAdjustedNow()` instead of `Date.now()` anywhere timer state is computed or written. Offset is refreshed every 60s.

### Server-time writes go through an RPC

`updateTimerState` in [useSettingsState.tsx](src/hooks/useSettingsState.tsx) calls the `update_timer_with_server_time` RPC (not a plain table update), so `updated_at_ms` is set from the DB's clock rather than the client's. The client sets `updatedAtMs` optimistically with `getAdjustedNow()` and lets the realtime event correct it.

### Settings flow

[useSettingsState.tsx](src/hooks/useSettingsState.tsx) owns all timer + UI settings and exposes them via `SettingsContext` ([contexts/settings.tsx](src/contexts/settings.tsx)); components read via the `useSettings()` hook. Climb seconds, prep seconds, prep enabled, and dark mode are cached in `localStorage` for fast first paint, then overwritten by DB values after `getTimers()` resolves. Dark mode is the only setting that stays purely client-side; the rest write to Supabase.

## Deployment

Pushes to `master` → prod (`climbing-timer-3f18c`); pushes to `beta` → beta site; PRs get a 30-day Firebase preview channel. All deploys run `npm ci && npm run build` then `firebase deploy`. CI configuration lives in [.github/workflows/](.github/workflows/).
