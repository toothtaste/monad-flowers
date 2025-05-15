import { store, updateStore } from "@/lib/store"
import { UserData } from "@/lib/store/types"
import { useQuery } from "@tanstack/react-query"
import { Suspense } from "react"

const Receiver = () => {
  const { user, receiver } = store()

  const { data, isLoading, error } = useQuery<UserData[], Error>({
    queryKey: ["following", user?.fid],
    queryFn: () => fetch(`/api/following?fid=${user?.fid}`).then(res => res.json()),
    enabled: !!user?.fid,
  })

  return (
    <main
      className="fixed top-30 left-10 right-10
               text-black font-bold
                 rounded-3xl
               bg-[var(--accent)]
                 tracking-widest
                 border-3 border-[var(--accent)]
                 overflow-hidden"
    >
      <div
        className="bg-[var(--accent)]
                   text-lg text-white text-center
                   pb-1.5"
      >
        users you follow
      </div>
      <div className={`h-50 overflow-y-scroll `}>
        {isLoading &&
          Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 pt-3 last:pb-3 bg-white overflow-hidden">
              <div className="bg-gray-200 w-5 h-5 rounded-full animate-pulse"></div>
              <div className="bg-gray-200 w-full h-4 rounded animate-pulse"></div>
            </div>
          ))}
        {data &&
          data
            .sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()))
            .map((user: UserData) => (
              <div
                key={user.fid}
                onClick={() => {
                  updateStore({ receiver: user })
                }}
                className={`flex items-center gap-3
                         px-3 py-1.5
                         border-b border-b-[var(--accent)]
                         overflow-hidden
                         cursor-pointer
                         first:border-t first:border-t-[var(--dark-accent)]
                         last:border-b-[var(--dark-accent)]
                         ${receiver?.fid === user.fid ? "text-white bg-[var(--accent)]" : "bg-white"}`}
              >
                <div className="w-5 h-5">
                  <Suspense fallback={<div className="bg-gray-200 w-5 h-5 rounded-full animate-pulse"></div>}>
                    <img
                      loading="lazy"
                      src={user.pfp_url || "/images/user.svg"}
                      alt="pfp_url"
                      onError={e => {
                        e.currentTarget.src = "/images/user.svg"
                      }}
                      className="object-cover w-full h-full rounded-full mt-[1px]"
                    />
                  </Suspense>
                </div>
                <div>{user.username}</div>
              </div>
            ))}
      </div>
    </main>
  )
}

export default Receiver
