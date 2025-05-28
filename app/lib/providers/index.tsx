"use client"

import sdk from "@farcaster/frame-sdk"
import { farcasterFrame as miniAppConnector } from "@farcaster/frame-wagmi-connector"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect } from "react"
import { http } from "viem"
import { monadTestnet } from "viem/chains"
import { createConfig, WagmiProvider } from "wagmi"
import { login } from "../api/login"
import { updateStore } from "../store"

const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(`https://${process.env.NEXT_PUBLIC_HOST}/api/rpc`),
  },
  connectors: [miniAppConnector()],
})

const tanstackQueryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ;(async function () {
      const isMiniApp = await sdk.isInMiniApp()

      if (!isMiniApp) return

      const { user, client } = await sdk.context

      updateStore({ user, client })

      await sdk.actions.ready({ disableNativeGestures: true })

      try {
        const { token: session } = await sdk.experimental.quickAuth()
        await login({ session })
        updateStore({ session })
      } catch (error) {
        await sdk.actions.close()
      }
    })()
  }, [])

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={tanstackQueryClient}>
        {children}
        <div className="absolute inset-0 pointer-events-none" onDragStart={e => e.preventDefault()}></div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
