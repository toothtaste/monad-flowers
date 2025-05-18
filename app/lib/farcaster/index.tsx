"use client"

import { generateNonce } from "@farcaster/auth-client"
import sdk from "@farcaster/frame-sdk"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { login } from "../api/login"
import { updateStore } from "../store"

const Farcaster = ({ children }: { children: React.ReactNode }) => {
  const { mutateAsync: loginMutateAsync } = useMutation({ mutationFn: login })

  async function prepare() {
    const isMiniApp = await sdk.isInMiniApp()

    if (!isMiniApp) return

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
  }, [])

  return <>{children}</>
}

export default Farcaster
