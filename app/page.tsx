"use client"

import { login } from "@/lib/api/login"
import { webhook } from "@/lib/api/webhook"
import { updateStore } from "@/lib/store"
import { generateNonce } from "@farcaster/auth-client"
import sdk from "@farcaster/frame-sdk"
import { useMutation } from "@tanstack/react-query"
import Image from "next/image"
import { useEffect } from "react"
import Button from "./components/Button"
import Header from "./components/Header"
import Main from "./components/Main"

export default function Home() {
  const { mutateAsync: loginMutateAsync } = useMutation({ mutationFn: login })
  const { mutateAsync: webhookMutateAsync } = useMutation({ mutationFn: webhook })

  async function prepare() {
    // for development
    return
    //

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
      <div className="absolute inset-0 -z-10 backdrop-blur-[2px]" onDragStart={e => e.preventDefault()}></div>
      <div className="fixed right-0 top-23 w-22.5 h-48 z-10 blur-[1px]">
        <Image src={"/images/roses.png"} fill alt="roses" />
      </div>
      <div className="fixed left-0 top-70 w-28 h-57 z-10 blur-[1px]">
        <Image src={"/images/violets.png"} fill alt="violets" />
      </div>
      <div className="fixed right-0 bottom-0 w-23 h-23 z-10 blur-[1px]">
        <Image src={"/images/blue-flower.png"} fill alt="blue-flower" />
      </div>
      <Header />
      <Main />
      <Button />
    </>
  )
}
