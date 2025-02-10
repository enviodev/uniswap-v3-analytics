import { useEffect, useState } from "react";
import { graphqlClient, STATS_QUERY } from "@/lib/graphql";

type Hook = {
  id: string;
  chainId: string;
  numberOfPools: string;
  numberOfSwaps: string;
  firstPoolCreatedAt: string;
};

type HooksData = {
  HookStats: Hook[];
};

export function useHooks() {
  const [hooks, setHooks] = useState<HooksData | null>(null);

  useEffect(() => {
    const fetchHooks = async () => {
      try {
        const data = await graphqlClient.request(STATS_QUERY);
        setHooks({ HookStats: data.HookStats });
      } catch (error) {
        console.error("Error fetching hooks:", error);
      }
    };

    fetchHooks();
    const interval = setInterval(fetchHooks, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return hooks;
}
