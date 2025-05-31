"use client"

import { EMOJIES_MAP } from "@/lib/constants"
import { store, updateStore } from "@/lib/store"
import clsx from "clsx"
import Image from "next/image"
import { monadTestnet } from "viem/chains"
import { useSwitchChain } from "wagmi"
import Button from "../components/Button"

const Flowers = () => {
  const { flower, note } = store()

  const { switchChain } = useSwitchChain()

  return (
    <main>
      <div
        className={clsx(
          "flex flex-col items-center",
          "fixed top-24 min-[370px]:top-30 left-10 right-10",
          "flex justify-center",
          "rounded-2xl",
          "bg-[var(--accent)]",
          "border-3 border-[var(--accent)]",
          "overflow-hidden",
        )}
      >
        <div className={clsx("flex justify-center w-full bg-white", "pt-7 pb-5.5")}>
          <div className={clsx("relative", "aspect-[144/180]", "w-36", "min-[370px]:w-40")}>
            <Image src={`/images/flowers/${flower}.png`} sizes="300px" fill priority alt={flower} />
          </div>
        </div>

        <div className={clsx("flex justify-center w-full bg-white")}>
          <div
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              const clicked = (e.target as HTMLElement)?.textContent

              if (!clicked) return
              if (!EMOJIES_MAP[clicked]) return

              updateStore({ flower: EMOJIES_MAP[clicked] })
            }}
            className={clsx("flex gap-2 pb-1.5", "text-lg min-[430px]:text-2xl tracking-widest")}
          >
            {["🌹", "🌼", "🌺", "🌻", "🌷"].map((em, i) => (
              <div key={i} className="cursor-pointer">
                {em}
              </div>
            ))}
          </div>
        </div>

        <div className={clsx("relative w-full", "text-white")}>
          <Image
            src={"/images/note.svg"}
            width={16}
            height={16}
            alt="note"
            className={clsx("absolute left-4 top-[calc(50%)] -translate-y-1/2")}
          />
          <input
            type="text"
            name="note"
            id="note"
            placeholder="optional note"
            role="note"
            className={clsx(
              "pt-1 pb-1.5 pl-10 pr-3",
              "w-full",
              "border-t border-t-[var(--dark-accent)]",
              "outline-0",
              "focus:outline-none",
            )}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={note}
            onChange={e => {
              const val = e.target.value
              if (val.length > 30) return
              updateStore({ note: val })
            }}
          />

          <div className={clsx("absolute right-4 top-[calc(50%)] -translate-y-1/2")}>{30 - note.length}</div>
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
