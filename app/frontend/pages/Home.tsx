"use client"

import { updateStore } from "@/lib/store"
import { Flower } from "@/lib/store/types"
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
      className="fixed top-30 left-10 right-10
                 text-black font-bold
                   rounded-2xl
                 bg-white
                   tracking-widest
                   border-3 border-[var(--accent)]"
    >
      <div
        className="bg-[var(--accent)]
                     text-lg text-white text-center
                     pb-1.5
                     rounded-t-lg"
      >
        guide
      </div>
      <div className="flex flex-col gap-3 px-3 pt-[9px] pb-3.5 text-sm leading-6">
        <p>
          Select a&nbsp;flower you&rsquo;d like to&nbsp;gift, choose a&nbsp;recipient, and pay for everything with test MON
          tokens.
        </p>
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
