"use client"

import { updateStore } from "@/lib/store"
import { Flower } from "@/lib/store/types"
import clsx from "clsx"
import { useEffect } from "react"
import { useAccount, useConnect } from "wagmi"
import Button from "../components/Button"

export default function Home() {
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()

  useEffect(() => {
    updateStore({
      flower: Flower.Sunflower,
      receiver: undefined,
    })
  }, [])

  return (
    <main
      className={clsx(
        "fixed top-24 min-[369px]:top-30 left-10 right-10",
        "text-black font-bold",
        "rounded-2xl",
        "bg-white",
        "tracking-widest",
        "border-3 border-[var(--accent)]",
      )}
    >
      <div
        className={clsx(
          "bg-[var(--accent)]",
          "text-base min-[360px]:text-lg min-[420px]:text-xl",
          "text-white text-center",
          "pb-1.5",
          "rounded-t-lg",
        )}
      >
        guide
      </div>
      <div
        className={clsx(
          "flex flex-col gap-2 min-[369px]:gap-3",
          "px-3 pt-[9px] pb-3.5",
          "text-xs min-[360px]:text-sm min-[419px]:text-base",
          "leading-6",
        )}
      >
        <p>
          Select a&nbsp;flower you&rsquo;d like to&nbsp;gift, choose a&nbsp;recipient, and pay for everything with test MON
          tokens.
        </p>
        <p>Check out the gifts you&rsquo;ve received in&nbsp;your profile at&nbsp;the top right corner.</p>
        <p>The delivery is&nbsp;fast and cheap&nbsp;&mdash; I&nbsp;promise!</p>
      </div>

      <Button
        to="/flowers"
        text="okay"
        onClick={() => {
          if (!isConnected) connect({ connector: connectors[0] })
        }}
      />
    </main>
  )
}
