"use client";

import { useCallback, useSyncExternalStore } from "react";
import { z } from "zod";

interface ReadNotificationsSnapshot {
  ids: readonly string[];
  loaded: boolean;
  error: string | null;
}

const serverSnapshot: ReadNotificationsSnapshot = {
  ids: [],
  loaded: false,
  error: null,
};
const snapshots = new Map<string, ReadNotificationsSnapshot>();
const subscribers = new Map<string, Set<() => void>>();
const readIdsSchema = z.array(z.string());

function publish(key: string, snapshot: ReadNotificationsSnapshot) {
  snapshots.set(key, snapshot);
  subscribers.get(key)?.forEach((notify) => notify());
}

function readStoredSnapshot(key: string): ReadNotificationsSnapshot {
  try {
    const storedValue = window.localStorage.getItem(key);
    if (!storedValue) {
      const emptySnapshot = { ids: [], loaded: true, error: null };
      return emptySnapshot;
    }

    const parsedIds = readIdsSchema.safeParse(JSON.parse(storedValue));
    return parsedIds.success
      ? { ids: parsedIds.data, loaded: true, error: null }
      : {
          ids: [],
          loaded: true,
          error:
            "Saved notification status is invalid. Mark reminders read to reset it.",
        };
  } catch {
    return {
      ids: [],
      loaded: true,
      error: "Unable to load saved notification status from this browser.",
    };
  }
}

function getSnapshot(key: string): ReadNotificationsSnapshot {
  return snapshots.get(key) ?? serverSnapshot;
}

function subscribe(key: string, notify: () => void) {
  const keySubscribers = subscribers.get(key) ?? new Set<() => void>();
  keySubscribers.add(notify);
  subscribers.set(key, keySubscribers);

  if (!snapshots.has(key)) publish(key, readStoredSnapshot(key));

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== key) return;
    publish(key, readStoredSnapshot(key));
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
    keySubscribers.delete(notify);
    if (keySubscribers.size === 0) subscribers.delete(key);
  };
}

function persistReadIds(key: string, ids: readonly string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
    publish(key, { ids: [...ids], loaded: true, error: null });
  } catch {
    publish(key, {
      ...getSnapshot(key),
      loaded: true,
      error: "Unable to save notification status in this browser.",
    });
  }
}

export function useReadBillNotifications(userId?: string) {
  const key = `finance-dashboard:${userId ?? "guest"}:read-bill-notifications`;
  const subscribeToKey = useCallback(
    (notify: () => void) => subscribe(key, notify),
    [key],
  );
  const getSnapshotForKey = useCallback(() => getSnapshot(key), [key]);
  const snapshot = useSyncExternalStore(
    subscribeToKey,
    getSnapshotForKey,
    () => serverSnapshot,
  );

  const markRead = useCallback(
    (ids: readonly string[]) => {
      const currentIds = getSnapshot(key).ids;
      persistReadIds(key, [...new Set([...currentIds, ...ids])]);
    },
    [key],
  );

  return {
    readIds: snapshot.ids,
    isLoaded: snapshot.loaded,
    error: snapshot.error,
    markRead,
  };
}
