"use client";

import { useState } from "react";
import { useStats } from "@/hooks/useStats";
import { AnimatedBar } from "@/components/AnimatedBar";
import StatsSummary from "@/components/StatsSummary";
import { TabsContainer } from "@/components/TabsContainer";
import { ChevronDown, ChevronUp, AlertCircle, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PoolsSummary } from "../components/PoolsSummary";
import { LogoHeader } from "@/components/LogoHeader";
import { ApisContent } from "@/components/ApisContent";
import { TvlSummary } from "@/components/TvlSummary";
import { TvlAnimatedBar } from "@/components/TvlAnimatedBar";
import { PulseSwapsColumn } from "@/components/PulseSwapsColumn";
import { PulsePoolsColumn } from "@/components/PulsePoolsColumn";

const NETWORK_NAMES: Record<string, string> = {
  "1": "Ethereum",
  "10": "Optimism",
  "137": "Polygon",
  "42161": "Arbitrum",
  "8453": "Base",
  "81457": "Blast",
  "7777777": "Zora",
  "56": "BSC",
  "43114": "Avalanche",
  "57073": "Ink",
  "1868": "Soneium",
  "130": "Unichain",
};

// Helper function to extract chain ID from the new format
const extractChainId = (id: string): string => {
  // If the ID contains an underscore, extract the part before it
  if (id.includes("-")) {
    const chainId = id.split("-")[0];
    return chainId || id; // Fallback to original id if split fails
  }
  return id;
};

const TABS = [
  { id: "overview", label: "Swaps" },
  { id: "pulse", label: "Pulse" },
  { id: "tvl", label: "TVL" },
  { id: "pools", label: "Pools" },
  { id: "apis", label: "APIs" },
];

type FactoryStat = {
  txCount: string;
  poolCount: string;
  id: string;
  owner: string;
  totalFeesETH: string;
  totalFeesUSD: string;
  totalValueLockedETH: string;
  totalValueLockedETHUntracked: string;
  totalValueLockedUSD: string;
  totalValueLockedUSDUntracked: string;
  totalVolumeETH: string;
  totalVolumeUSD: string;
  untrackedVolumeUSD: string;
};

export default function Page() {
  const [activeTab, setActiveTab] = useState("pools");
  const [showAllNetworks, setShowAllNetworks] = useState(false);
  const { stats, error } = useStats();

  // Handle tab changes, with special case for Pulse tab
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <div className="text-center space-y-4">
          <div className="text-red-500">{error}</div>
          {error.includes("Retrying") && (
            <div className="animate-pulse text-muted-foreground">
              Attempting to reconnect...
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        Loading...
      </div>
    );
  }

  const sortedStats = [...stats.Factory].sort(
    (a, b) => parseInt(b.txCount) - parseInt(a.txCount)
  ) as FactoryStat[];

  const totalSwaps = sortedStats.reduce(
    (acc, stat) => acc + parseInt(stat.txCount),
    0
  );
  const totalPools = sortedStats.reduce(
    (acc, stat) => acc + parseInt(stat.poolCount),
    0
  );

  const globalStats = {
    totalSwaps,
    totalPools,
    avgSwapsPerPool: totalPools > 0 ? totalSwaps / totalPools : 0,
  };

  const networkStats = sortedStats.map((stat) => {
    const chainId = extractChainId(stat.id);
    return {
      id: stat.id,
      name: NETWORK_NAMES[chainId] || `Chain ${stat.id}`,
      swaps: parseInt(stat.txCount),
      pools: parseInt(stat.poolCount),
      avgSwapsPerPool:
        parseInt(stat.poolCount) > 0
          ? parseInt(stat.txCount) / parseInt(stat.poolCount)
          : 0,
    };
  });

  // Calculate TVL-related stats
  const totalTVL = sortedStats.reduce(
    (acc, stat) => acc + parseFloat(stat.totalValueLockedUSD || "0"),
    0
  );

  const totalVolume = sortedStats.reduce(
    (acc, stat) => acc + parseFloat(stat.totalVolumeUSD || "0"),
    0
  );

  const totalFees = sortedStats.reduce(
    (acc, stat) => acc + parseFloat(stat.totalFeesUSD || "0"),
    0
  );

  const tvlNetworkStats = sortedStats.map((stat) => {
    const chainId = extractChainId(stat.id);
    return {
      id: stat.id,
      name: NETWORK_NAMES[chainId] || `Chain ${stat.id}`,
      tvl: parseFloat(stat.totalValueLockedUSD || "0"),
      volume: parseFloat(stat.totalVolumeUSD || "0"),
    };
  });

  return (
    <div className="flex flex-col min-h-svh">
      <div className="flex items-center justify-center flex-1 px-2 sm:px-4">
        <div className="w-full max-w-full sm:max-w-3xl">
          <LogoHeader />
          <TabsContainer
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          >
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-end mb-6">
                    <button
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/30 hover:bg-secondary/50 transition-colors text-xs font-medium"
                    >
                      <span
                        className="text-primary"
                      >
                        Swaps
                      </span>
                    </button>
                  </div>

                  <StatsSummary
                    factoryStats={sortedStats}
                  />
                  <div className="space-y-3">
                    {sortedStats.map((stat) => {
                      const chainId = extractChainId(stat.id);
                      return (
                        <AnimatedBar
                          key={stat.id}
                          label={
                            NETWORK_NAMES[chainId] || `Chain ${stat.id}`
                          }
                          value={parseInt(stat.txCount)}
                          maxValue={totalSwaps}
                          pools={parseInt(stat.poolCount)}
                          maxPools={totalPools}
                          mode="overview"
                        />
                      );
                    })}
                  </div>
                </motion.div>
              )}
              {activeTab === "tvl" && (
                <motion.div
                  key="tvl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-6">
                    <TvlSummary
                      globalStats={{
                        totalTVL,
                        totalVolume,
                        totalFees,
                      }}
                      networkStats={tvlNetworkStats}
                    />
                    <div className="space-y-3">
                      {tvlNetworkStats
                        .sort((a, b) => b.tvl - a.tvl)
                        .map((stat) => (
                          <TvlAnimatedBar
                            key={stat.id}
                            label={stat.name}
                            tvl={stat.tvl}
                            maxTvl={totalTVL}
                            volume={stat.volume}
                            maxVolume={totalVolume}
                          />
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
              {/* {activeTab === "pools" && (
                <motion.div
                  key="pools"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Pools</h2>
                    <PoolsSummary />
                  </div>
                </motion.div>
              )}
              {activeTab === "apis" && (
                <motion.div
                  key="apis"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-6 flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground bg-secondary/30 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      This page is under active development and will be improved
                      shortly
                    </span>
                  </div>
                  <ApisContent />
                </motion.div>
              )} */}
              {/* {activeTab === "pulse" && (
                <motion.div
                  key="pulse"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left column: Recent Swaps */}
              {/* <div className="rounded-lg border border-border/50 overflow-hidden">
                        <PulseSwapsColumn />
                      </div>

                      {/* Right column: Recent Pools */}
              {/* <div className="rounded-lg border border-border/50 overflow-hidden">
                        <PulsePoolsColumn />
                      </div>
                    </div>

                    <div className="text-center text-xs text-muted-foreground mt-2">
                      <p>
                        Recent data from Uniswap V4 pools across all supported
                        networks
                      </p>
                    </div>
                  </div> */}
              {/* </motion.div> */}
              {/* )} */}
            </AnimatePresence>
          </TabsContainer>
        </div>
      </div>
      {/* <footer className="mt-8 text-center text-sm text-muted-foreground pb-4">
        <p>
          Data indexed by{" "}
          <a
            href="https://docs.envio.dev/docs/HyperIndex/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/70 hover:text-primary transition-colors"
          >
            HyperIndex
          </a>{" "}
          on{" "}
          <a
            href="https://envio.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/70 hover:text-primary transition-colors"
          >
            envio.dev
          </a>
        </p>
      </footer> */}
    </div>
  );
}
