# Uniswap V3 Analytics Dashboard

A modern React-based analytics dashboard for Uniswap V3, built with Next.js and TypeScript. This application provides real-time insights into Uniswap V3's performance across multiple networks.

## Features

- **Multi-Network Support**: Track Uniswap V3 metrics across multiple networks including:
  - Ethereum
  - Optimism
  - Polygon
  - Arbitrum
  - Base
  - Blast
  - Zora
  - BSC
  - Avalanche
  - And more...

- **Real-time Analytics**: Live tracking of:
  - Swap volumes and counts
  - Total Value Locked (TVL)
  - Pool statistics
  - Hook usage and performance
  - Transaction counts

- **Interactive UI Components**:
  - Animated data visualizations
  - Network-specific metrics
  - Detailed pool information
  - Hook analytics and information
  - API documentation

## Tech Stack

- **Frontend Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Data Fetching**: GraphQL
- **Animations**: Framer Motion
- **UI Components**: Custom components with Lucide icons
- **Theme Support**: Dark/Light mode via next-themes

## Project Structure

```
.
├── apps/
│   └── web/                 # Main Next.js application
│       ├── app/            # Next.js app directory
│       ├── components/     # React components
│       ├── hooks/         # Custom React hooks
│       └── lib/           # Utilities and configurations
├── packages/              # Shared packages
└── pnpm-workspace.yaml   # Workspace configuration
```

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Build for production:
   ```bash
   pnpm build
   ```

## Development

The application uses a monorepo structure with pnpm workspaces. The main application is located in the `apps/web` directory.

### Key Components

- **Stats Dashboard**: Real-time statistics across all supported networks
- **Pulse Analytics**: Live tracking of swaps and pool activities
- **TVL Tracking**: Total Value Locked metrics and trends
- **Pool Analytics**: Detailed information about Uniswap V3 pools
- **Hook Information**: Comprehensive data about Uniswap V3 hooks
- **API Documentation**: Information about available APIs and endpoints

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
