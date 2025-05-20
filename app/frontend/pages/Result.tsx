"use client"

import { store } from "@/lib/store"
import sdk from "@farcaster/frame-sdk"
import clsx from "clsx"
import Button from "../components/Button"

const Result = () => {
  const { receiver } = store()

  const btnClick = async () => {
    await sdk.actions.composeCast({
      text: [`Hey, @${receiver?.username}! 🌼👋`, "My little flower gift is waiting for you — check it out:"].join(
        "\n\n",
      ),
      embeds: ["https://warpcast.com/miniapps/KxLyvVqyb3-v/monad-flowers"],
    })
  }

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
      <div
        className={clsx(
          "bg-[var(--accent)]",
          "pb-1.5",
          "rounded-t-lg",
          "text-white text-lg text-center",
          "min-[420px]:text-xl",
        )}
      >
        result
      </div>

      <div
        className={clsx(
          "flex flex-col justify-around items-center",
          "h-40",
          "text-sm text-center",
          "min-[420px]:text-base",
          "px-2 pt-2",
        )}
      >
        <p>{`@${receiver?.username} has received your gift!`}</p>

        <button
          className={clsx("text-white text-base", "bg-[var(--accent)]", "px-2.5 pt-1 pb-[5px]", "rounded-xl")}
          onClick={btnClick}
        >
          share
        </button>
      </div>

      <Button to="/" text="back" />
    </main>
  )
}

export default Result
