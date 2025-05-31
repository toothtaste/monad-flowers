"use client"

import { store } from "@/lib/store"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"

import { getGifts } from "@/lib/api/gifts"
import sdk from "@farcaster/frame-sdk"
import clsx from "clsx"
import { useState } from "react"
import Button from "../components/Button"

const Profile = () => {
  const { user } = store()

  const { data, isLoading } = useQuery({
    queryKey: ["gifts", user?.fid],
    queryFn: () => getGifts(),
    enabled: !!user?.fid,
  })

  const [notes, setNotes] = useState<{ author?: string; text: string[] }>({ text: [] })

  return (
    <main>
      <div
        className={clsx(
          "fixed top-24 min-[370px]:top-30 left-10 right-10",
          "text-white font-bold",
          "rounded-3xl",
          "bg-[var(--accent)]",
          "tracking-widest",
          "border-3 border-[var(--accent)]",
          "overflow-hidden",
        )}
      >
        <div className={clsx("bg-[var(--accent)]", "text-lg min-[420px]:text-xl text-center", "pb-1.5")}>received gifts</div>
        <div
          className={clsx(
            "flex flex-wrap justify-between",
            "px-2 min-[390px]:px-4",
            "pt-4",
            "h-60 min-[390px]:h-77",
            "overflow-y-scroll",
            "bg-white",
          )}
        >
          {data ? (
            data?.receivedGiftsWithNotes.map((g, i) =>
              Object.entries(g.flowers)
                .filter(([_, { count }]) => count > 0)
                .map(([flower, { count, notes }], j) => (
                  <div
                    key={`${g.sender}-${flower}-${count}-${j}`}
                    className={clsx(
                      "relative",
                      "flex flex-col items-center justify-between basis-[47.5%]",
                      "h-5/12 mb-2 min-[390px]:mb-4",
                      "rounded-2xl",
                      "border-2 border-[var(--accent)] bg-[var(--accent)]",
                      "overflow-hidden",
                    )}
                  >
                    <div className="relative h-full w-full py-2 bg-white">
                      <div className="relative h-full mx-auto">
                        <Image src={`/images/flowers/${flower}.png`} sizes="144px" fill priority alt={flower} />
                      </div>

                      {!!notes?.length && (
                        <div
                          className={clsx(
                            "flex justify-center items-center",
                            "w-[12px] h-[12px] cursor-pointer pointer-events-auto",
                            "absolute bottom-[5px] left-[7px]",
                          )}
                          onClick={() => {
                            setNotes({ author: g.sender, text: notes })
                          }}
                        >
                          <Image src={"/images/note-violet.svg"} width={12} height={12} alt="note" className="pointer-events-auto" />
                        </div>
                      )}

                      <div className={clsx("text-black leading-none", "absolute bottom-[3px] right-1.5")}>{count}</div>
                    </div>

                    <div className={clsx("w-full", "text-center text-xs truncate overflow-hidden whitespace-nowrap", "px-1 pt-[1px] pb-1")}>
                      @{g.sender}
                    </div>
                  </div>
                )),
            )
          ) : isLoading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={clsx(
                  "relative",
                  "flex flex-col items-center justify-between basis-[47.5%]",
                  "h-5/12 mb-2 min-[390px]:mb-4",
                  "rounded-2xl",
                  "border-2 border-[var(--accent)]",
                  "overflow-hidden",
                  "animate-pulse bg-gray-200",
                )}
              ></div>
            ))
          ) : (
            <div
              className={clsx(
                "flex justify-center items-center flex-col gap-4",
                "pb-10",
                "text-black text-sm",
                "mx-auto my-auto",
                "text-center",
              )}
            >
              <div>You don&rsquo;t have any :(</div>
              <div>But no&nbsp;worries! You can follow me&nbsp;to&nbsp;get one.</div>
              <button
                className={clsx("text-white text-base", "bg-[var(--accent)]", "px-2.5 pt-1 pb-[5px]", "rounded-xl")}
                onClick={() => {
                  sdk.actions.viewProfile({ fid: 1021214 })
                }}
              >
                follow
              </button>
            </div>
          )}
        </div>

        {!!notes.text.length && (
          <div className="absolute inset-0 bg-black">
            <div className={clsx("bg-[var(--accent)]", "text-lg min-[420px]:text-xl text-center", "pb-1.5")}>{notes.author} notes</div>

            <div className={clsx("flex flex-col", "h-60 min-[390px]:h-77", "overflow-y-scroll", "bg-white text-black")}>
              {notes.text.length &&
                notes.text?.map((note, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "flex justify-between items-center",
                      "px-3 py-1.5",
                      "border-b border-b-[var(--accent)]",
                      "overflow-hidden",
                      "last:border-b-[var(--dark-accent)]",
                    )}
                  >
                    {note}
                  </div>
                ))}
            </div>

            <div
              className="absolute bottom-0 inset-x-0 bg-[var(--accent)] py-0.5 text-center cursor-pointer"
              onClick={() => {
                setNotes({ text: [] })
              }}
            >
              close
            </div>
          </div>
        )}
      </div>

      <Button text="home" to="/" />
    </main>
  )
}

export default Profile
