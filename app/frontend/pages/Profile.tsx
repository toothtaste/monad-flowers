"use client"

import { store } from "@/lib/store"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { Gifts } from "../../../db"
import Button from "../components/Button"

const Profile = () => {
  const { user } = store()

  const { data, isLoading, error } = useQuery<Gifts, Error>({
    queryKey: ["gifts", user?.fid],
    queryFn: () => fetch(`/api/gifts?fid=${user?.fid}`).then(res => res.json()),
    enabled: !!user?.fid,
  })

  // domain, vercel, ask to test in the group

  return (
    <main>
      <div
        className="fixed top-30 min-[390px]:top-32 left-10 right-10
               text-white font-bold
                 rounded-3xl
               bg-[var(--accent)]
                 tracking-widest
                 border-3 border-[var(--accent)]
                 overflow-hidden"
      >
        <div
          className="bg-[var(--accent)]
                   text-lg min-[420px]:text-xl text-center
                   pb-1.5"
        >
          received gifts
        </div>
        <div className={`flex flex-wrap justify-between px-2 min-[390px]:px-4 pt-4 h-77 overflow-y-scroll bg-white`}>
          {data?.receivedGifts.map((g, i) =>
            Object.entries(g.flowers)
              .filter(([_, count]) => count > 0)
              .map(([flower, count], j) => (
                <div
                  key={`${g.sender}-${flower}-${count}-${j}`}
                  className="
                        relative
                        flex flex-col items-center justify-between basis-[47.5%]
                       h-5/12 mb-2 min-[390px]:mb-4
                       rounded-2xl
                       border-2 border-[var(--accent)]
                       overflow-hidden"
                >
                  <div className="relative h-full w-full py-2">
                    <div className="relative h-full mx-auto">
                      <Image src={`/images/flowers/${flower}.png`} sizes="144px" fill priority alt={flower} />
                    </div>

                    <div className="absolute bottom-0 right-1 text-black">{count}</div>
                  </div>

                  <div
                    className="bg-[var(--accent)] w-full
              text-center text-xs truncate overflow-hidden whitespace-nowrap
              px-1 pt-[1px] pb-1"
                  >
                    @{g.sender}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      <Button text="home" to="/" />
    </main>
  )
}

export default Profile
