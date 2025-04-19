import { GraphQLClient } from "graphql-request";

// Comment out the v4 API endpoint
// export const graphqlClient = new GraphQLClient("https://enviodev-69b6884.dedicated.hyperindex.xyz/v1/graphql");

// Uncomment the v3 API endpoint
export const graphqlClient = new GraphQLClient("https://denhampreen-6f4a4e9.dedicated.hyperindex.xyz/v1/graphql");

export const STATS_QUERY = `
  query myQuery {
    Factory {      
      numberOfSwaps
      poolCount
      id
      owner
      totalFeesETH
      totalFeesUSD
      totalValueLockedETH
      totalValueLockedETHUntracked
      totalValueLockedUSD
      totalValueLockedUSDUntracked
      totalVolumeETH
      totalVolumeUSD
      untrackedVolumeUSD
    }
    chain_metadata {
      chain_id
      latest_processed_block
    }
  }
`;

export const POOLS_QUERY = `
  query myQuery {
    Pool(order_by: {totalValueLockedUSD: desc}, limit: 100) {
      id      
      txCount
      token0_id
      token1_id
      volumeUSD
      untrackedVolumeUSD
      feesUSD      
      totalValueLockedUSD
    }
  }
`;

export const POOLS_BY_HOOK_QUERY = `
  query poolsByHook($hookAddress: String!, $chainId: numeric!) {
    Pool(where: {hooks: {_eq: $hookAddress}, chainId: {_eq: $chainId}}, order_by: {totalValueLockedUSD: desc}) {
      chainId
      hooks
      id
      name
      txCount
      token0
      token1
      volumeUSD
      untrackedVolumeUSD
      feesUSD
      feesUSDUntracked
      totalValueLockedUSD
      createdAtTimestamp
    }
  }
`;

export const RECENT_SWAPS_BY_POOL_QUERY = `
  query recentSwapsByPool($poolId: String!, $limit: Int!) {
    Swap(
      where: {pool: {_eq: $poolId}}, 
      order_by: {timestamp: desc}, 
      limit: $limit
    ) {
      id
      amount0
      amount1
      amountUSD
      origin
      sender
      timestamp
      transaction
      token0 {
        id
        name
        symbol
        decimals
      }
      token1 {
        id
        name
        symbol
        decimals
      }
      sqrtPriceX96
      tick
      chainId
    }
  }
`;
