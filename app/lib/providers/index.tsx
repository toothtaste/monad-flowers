"use client"

import { farcasterFrame as miniAppConnector } from "@farcaster/frame-wagmi-connector"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { http } from "viem"
import { monadTestnet } from "viem/chains"
import { createConfig, WagmiProvider } from "wagmi"

const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  connectors: [miniAppConnector()],
})

const tanstackQueryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={tanstackQueryClient}>{children}</QueryClientProvider>
      </WagmiProvider>

      <div className="absolute inset-0 pointer-events-none" onDragStart={e => e.preventDefault()}></div>
    </>
  )
}
