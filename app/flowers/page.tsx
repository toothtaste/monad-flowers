"use client"

import { store, updateStore } from "@/lib/store"
import { Flower } from "@/lib/store/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { monadTestnet } from "viem/chains"
import { useSwitchChain } from "wagmi"
import Button from "../components/Button"

const Flowers = () => {
  const router = useRouter()

  const { flower } = store()

  const { switchChain } = useSwitchChain()

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
          <Image src={`/images/flowers/${flower}.png`} sizes="144px" fill alt={flower} />
        </div>

        <div
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            const clicked = (e.target as HTMLElement)?.textContent

            if (!clicked) return

            const emojies: Record<string, Flower> = {
              "🌹": Flower.Rose,
              "🌼": Flower.Daisy,
              "🌺": Flower.Lily,
              "🌻": Flower.Sunflower,
              "🌷": Flower.Tulip,
            }

            if (!emojies[clicked]) return

            updateStore({ flower: emojies[clicked] })
          }}
          className="absolute bottom-2
                   flex gap-2
                   text-lg tracking-widest"
        >
          <div className="cursor-pointer">🌹</div> <div className="cursor-pointer">🌼</div>{" "}
          <div className="cursor-pointer">🌺</div>
          <div className="cursor-pointer">🌻</div> <div className="cursor-pointer">🌷</div>
        </div>
      </div>

      <Button
        children={"select"}
        onClick={() => {
          switchChain({ chainId: monadTestnet.id })
          router.push("/receiver")
        }}
      />
    </main>
  )
}

export default Flowers
