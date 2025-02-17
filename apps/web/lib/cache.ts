import { HookInfo } from "@/types/hooks";

let cachedData: HookInfo[] | null = null;
let lastFetched: number | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour in milliseconds

export async function getCachedHookInfo(): Promise<HookInfo[] | null> {
  try {
    if (
      lastFetched &&
      cachedData &&
      Date.now() - lastFetched < CACHE_DURATION
    ) {
      return cachedData;
    }
    return null;
  } catch (error) {
    console.error("Error reading cache:", error);
    return null;
  }
}

export async function setCachedHookInfo(data: HookInfo[]): Promise<void> {
  try {
    cachedData = data;
    lastFetched = Date.now();
  } catch (error) {
    console.error("Error writing cache:", error);
  }
}
