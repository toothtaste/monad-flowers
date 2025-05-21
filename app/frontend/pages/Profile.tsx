"use client"

import { store } from "@/lib/store"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"

import clsx from "clsx"
import { GiftsCollection } from "../../lib/db"
import Button from "../components/Button"

const Profile = () => {
  const { user } = store()

  const { data, isLoading, error } = useQuery<GiftsCollection, Error>({
    queryKey: ["gifts", user?.fid],
    queryFn: () => fetch(`/api/gifts?fid=${user?.fid}`).then(res => res.json()),
    enabled: !!user?.fid,
  })

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
            data.receivedGifts.map((g, i) =>
              Object.entries(g.flowers)
                .filter(([_, count]) => count > 0)
                .map(([flower, count], j) => (
                  <div
                    key={`${g.sender}-${flower}-${count}-${j}`}
                    className={clsx(
                      "relative",
                      "flex flex-col items-center justify-between basis-[47.5%]",
                      "h-5/12 mb-2 min-[390px]:mb-4",
                      "rounded-2xl",
                      "border-2 border-[var(--accent)]",
                      "overflow-hidden",
                    )}
                  >
                    <div className="relative h-full w-full py-2">
                      <div className="relative h-full mx-auto">
                        <Image src={`/images/flowers/${flower}.png`} sizes="144px" fill priority alt={flower} />
                      </div>

                      <div className="absolute bottom-0 right-1 text-black">{count}</div>
                    </div>

                    <div
                      className={clsx(
                        "bg-[var(--accent)] w-full",
                        "text-center text-xs truncate overflow-hidden whitespace-nowrap",
                        "px-1 pt-[1px] pb-1",
                      )}
                    >
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
              <div>But no&nbsp;worries!</div>
              <div>
                Text{" "}
                <a href="https://warpcast.com/marbleheart" className="underline">
                  me
                </a>
                &nbsp;to&nbsp;get one and be&nbsp;Farcaster friends!
              </div>
              <div>Don&rsquo;t be&nbsp;shy&nbsp;&mdash; I&rsquo;m the same!</div>
            </div>
          )}
        </div>
      </div>

      <Button text="back" to="/" />
    </main>
  )
}

export default Profile
