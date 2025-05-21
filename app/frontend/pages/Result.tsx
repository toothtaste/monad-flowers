"use client"

import { store } from "@/lib/store"
import sdk from "@farcaster/frame-sdk"
import { Fireworks, FireworksHandlers } from "@fireworks-js/react"
import clsx from "clsx"
import { useEffect, useRef } from "react"
import Button from "../components/Button"

const Result = () => {
  const { receiver } = store()

  const btnClick = async () => {
    await sdk.actions.composeCast({
      text: [`Hey, @${receiver?.username}! 🌼👋`, "My little flower gift is waiting for you — check it out:"].join("\n\n"),
      embeds: ["https://warpcast.com/miniapps/KxLyvVqyb3-v/monad-flowers"],
    })
  }

  const ref = useRef<FireworksHandlers>(null)

  useEffect(() => {
    ref.current?.launch(10)
  }, [])

  return (
    <main
      className={clsx(
        "fixed top-24 left-10 right-10",
        "min-[370px]:top-30",
        "border-3 border-[var(--accent)] rounded-2xl",
        "text-black font-bold tracking-widest",
        "bg-white",
      )}
    >
      <Fireworks
        ref={ref}
        options={{
          opacity: 0.5,
          hue: { min: 0, max: 360 },
          acceleration: 1,
          particles: 100,
          explosion: 8,
          intensity: 0,
          delay: { min: 15, max: 30 },
          traceSpeed: 5,
          brightness: { min: 70, max: 100 },
          decay: { min: 0.01, max: 0.02 },
          lineWidth: {
            explosion: { min: 2, max: 5 },
            trace: { min: 1, max: 2 },
          },
          rocketsPoint: { min: 40, max: 60 },
        }}
        className={clsx("fixed inset-0 pointer-events-none")}
      />

      <div className={clsx("bg-[var(--accent)]", "pb-1.5", "rounded-t-lg", "text-white text-lg text-center", "min-[420px]:text-xl")}>
        result
      </div>

      <div
        className={clsx(
          "flex flex-col justify-between items-center",
          "h-40",
          "text-sm text-center",
          "min-[420px]:text-base",
          "px-2 pt-8 pb-6",
        )}
      >
        <p>{`@${receiver?.username} has received your gift!`}</p>

        <button className={clsx("text-white text-base", "bg-[var(--accent)]", "px-2.5 pt-1 pb-[5px]", "rounded-xl")} onClick={btnClick}>
          share
        </button>
      </div>

      <Button to="/" text="back" />
    </main>
  )
}

export default Result
