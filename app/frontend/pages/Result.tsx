"use client"

import { store } from "@/lib/store"
import sdk from "@farcaster/frame-sdk"
import { useParams } from "react-router"
import Button from "../components/Button"

const Result = () => {
  const { hash } = useParams() as { hash: `0x${string}` | undefined }

  const { receiver } = store()

  return (
    <main>
      <div
        className="fixed top-30 min-[390px]:top-33 left-10 right-10
                 text-black font-bold
                   rounded-2xl
                 bg-white
                   tracking-widest
                   border-3 border-[var(--accent)]"
      >
        <div
          className="bg-[var(--accent)]
                     text-lg min-[420px]:text-xl text-white text-center
                     pb-1.5
                     rounded-t-lg"
        >
          result
        </div>
        <div className="flex flex-col gap-5 px-3 pt-5 pb-4.5 text-sm min-[420px]:text-base text-center leading-6">
          <p>{`@${receiver?.username} has received your gift!`}</p>

          <button
            onClick={async () => {
              await sdk.actions.composeCast({
                text: `Hey, @${
                  receiver?.username
                }! 🌼👋\n\nA little flower gift is waiting for you — check it out:\n${`https://${"HOST"}/profile`}`,
                embeds: [],
              })
            }}
            className={`
             px-3 pb-[1px] mx-auto
               text-white text-base
                 rounded-2xl
                 bg-[var(--accent)]
               `}
          >
            share
          </button>
        </div>
      </div>

      <Button to="/" text="home" />
    </main>
  )
}

export default Result
