"use client"

import { EMOJIES_MAP } from "@/lib/constants"
import { store, updateStore } from "@/lib/store"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { monadTestnet } from "viem/chains"
import { useSwitchChain } from "wagmi"
import Button from "../components/Button"

const Flowers = () => {
  const { flower } = store()

  const { switchChain } = useSwitchChain()

  const navigate = useRouter()

  useEffect(() => {
    navigate.prefetch("/receiver")
  }, [])

  return (
    <main>
      <div
        className="fixed top-25 left-10 right-10
                 flex justify-center
                 pt-9 pb-14
                 rounded-2xl
               bg-white
                 border-3 border-[var(--accent)]"
      >
        <div className="relative w-36 h-45">
          <Image src={`/images/flowers/${flower}.png`} sizes="144px" fill priority alt={flower} />
        </div>

        <div
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            const clicked = (e.target as HTMLElement)?.textContent

            if (!clicked) return

            if (!EMOJIES_MAP[clicked]) return

            updateStore({ flower: EMOJIES_MAP[clicked] })
          }}
          className="absolute bottom-2
                   flex gap-2
                   text-lg tracking-widest"
        >
          {["🌹", "🌼", "🌺", "🌻", "🌷"].map((em, i) => (
            <div key={i} className="cursor-pointer">
              {em}
            </div>
          ))}
        </div>
      </div>

      <Button
        text="select"
        to="/receiver"
        onClick={() => {
          switchChain({ chainId: monadTestnet.id })
        }}
      />
    </main>
  )
}

export default Flowers
