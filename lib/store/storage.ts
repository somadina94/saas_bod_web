import type { WebStorage } from "redux-persist/es/types";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/** SSR / Node: avoid importing default `redux-persist/lib/storage` (it touches `self` at load time). */
const noopStorage: WebStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
};

export const persistStorage: WebStorage =
  typeof window !== "undefined" ? createWebStorage("local") : noopStorage;
