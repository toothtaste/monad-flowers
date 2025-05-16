"use client"

import { generateNonce } from "@farcaster/auth-client"
import sdk from "@farcaster/frame-sdk"
import { farcasterFrame as miniAppConnector } from "@farcaster/frame-wagmi-connector"
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { http } from "viem"
import { monadTestnet } from "viem/chains"
import { createConfig, WagmiProvider } from "wagmi"
import { login } from "../api/login"
import { webhook } from "../api/webhook"
import { updateStore } from "../store"

const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  connectors: [miniAppConnector()],
})

const tanstackQueryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  const { mutateAsync: loginMutateAsync } = useMutation({ mutationFn: login })
  const { mutateAsync: webhookMutateAsync } = useMutation({ mutationFn: webhook })

  async function prepare() {
    const { user, client } = await sdk.context

    updateStore({ user, client })

    const nonce = generateNonce()

    await sdk.actions.ready({ disableNativeGestures: true })

    try {
      const { message, signature } = await sdk.actions.signIn({ nonce })
      const { session } = await loginMutateAsync({ message, signature, nonce })

      updateStore({ session })
    } catch (error) {
      await sdk.actions.close()
    }
  }

  useEffect(() => {
    prepare()

    sdk.on("frameAdded", async ({ notificationDetails }) => {
      if (notificationDetails?.token) await webhookMutateAsync({ token: notificationDetails.token })
    })

    return () => {
      sdk.removeAllListeners()
    }
  }, [])

  return (
    <>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={tanstackQueryClient}>{children}</QueryClientProvider>
      </WagmiProvider>

      <div className="absolute inset-0 -z-10 backdrop-blur-[2px] pointer-events-none" onDragStart={e => e.preventDefault()}></div>
    </>
  )
}
