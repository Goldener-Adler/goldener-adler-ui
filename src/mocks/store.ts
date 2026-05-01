import type { RoomHoldingBE } from "@/assets/types";

const STORE_KEY = "msw_holdings_store";

function loadStore(): Map<string, RoomHoldingBE[]> {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    if (!raw) return new Map();
    const entries = JSON.parse(raw) as [string, RoomHoldingBE[]][];
    return new Map(entries);
  } catch {
    return new Map();
  }
}

function persistStore(store: Map<string, RoomHoldingBE[]>): void {
  sessionStorage.setItem(STORE_KEY, JSON.stringify([...store.entries()]));
}

const holdingsStore = loadStore();

export const mockStore = {
  getHoldings: (sessionId: string): RoomHoldingBE[] => {
    const now = new Date();
    const valid = (holdingsStore.get(sessionId) ?? []).filter(
      h => new Date(h.expiresAt) > now
    );

    holdingsStore.set(sessionId, valid);
    persistStore(holdingsStore);

    return valid;
  },

  addHolding: (sessionId: string, holding: RoomHoldingBE): void => {
    const existing = holdingsStore.get(sessionId) ?? [];
    holdingsStore.set(sessionId, [...existing, holding]);
    persistStore(holdingsStore);
  },

  updateHolding: (sessionId: string, holdingId: string, updates: Partial<RoomHoldingBE>): RoomHoldingBE | null => {
    const existing = holdingsStore.get(sessionId) ?? [];
    const index = existing.findIndex(h => h.holdingId === holdingId);
    if (index === -1) return null;
    const updated = { ...existing[index], ...updates };
    holdingsStore.set(sessionId, [
      ...existing.slice(0, index),
      updated,
      ...existing.slice(index + 1),
    ]);
    persistStore(holdingsStore);
    return updated;
  },

  removeHolding: (sessionId: string, holdingId: string): void => {
    const existing = holdingsStore.get(sessionId) ?? [];
    holdingsStore.set(sessionId, existing.filter(h => h.holdingId !== holdingId));
    persistStore(holdingsStore);
  },

  clearHoldings: (sessionId: string): void => {
    holdingsStore.delete(sessionId);
    persistStore(holdingsStore);
  },

  clear: (): void => {
    holdingsStore.clear();
    sessionStorage.removeItem(STORE_KEY);
  },
};