"use client"

import { generateNonce } from "@farcaster/auth-client"
import sdk from "@farcaster/frame-sdk"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { login } from "../api/login"
import { webhook } from "../api/webhook"
import { updateStore } from "../store"

const Farcaster = ({ children }: { children: React.ReactNode }) => {
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

  return <>{children}</>
}

export default Farcaster
