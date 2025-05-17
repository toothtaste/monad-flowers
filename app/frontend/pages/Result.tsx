"use client"

import { store } from "@/lib/store"
import sdk from "@farcaster/frame-sdk"
import Link from "next/link"
import { useParams } from "react-router"
import Button from "../components/Button"

const Result = () => {
  const { hash } = useParams() as { hash: `0x${string}` | undefined }

  const { receiver } = store()

  return (
    <main>
      <div
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
          result
        </div>
        <div className="flex flex-col gap-5 px-3 pt-5 pb-4.5 text-sm text-center leading-6">
          <p>{hash ? `@${receiver?.username} has received your gift!` : "confirming..."}</p>
          <p>
            tx&nbsp;hash:{" "}
            {hash ? (
              <Link href={`https://monad-testnet.socialscan.io/tx/${hash}`} className="underline">
                {hash && `${hash.slice(0, 6)}...${hash.slice(-6)}`}
              </Link>
            ) : (
              "..."
            )}
          </p>

          <button
            onClick={async () => {
              await sdk.actions.composeCast({
                text: `Hey, ${receiver?.username}! A little flower gift is waiting for you — check it out: `,
                embeds: [`https://${process.env.HOST}/profile`],
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
