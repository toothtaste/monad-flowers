"use client"

import { ABI, CA, IDS_MAP } from "@/lib/constants"
import { store, updateStore } from "@/lib/store"
import { UserData } from "@/lib/store/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import clsx from "clsx"
import { Suspense, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { monadTestnet } from "viem/chains"
import { useAccount, useChainId, useConnect, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import Button from "../components/Button"
import Warning from "../components/Warning"

const Receiver = () => {
  const { session, user, receiver, follows } = store()

  const bottomRef = useRef<HTMLDivElement | null>(null)

  const { data: links, isLoading } = useQuery({
    queryKey: ["linksByFid", user?.fid],
    queryFn: () => fetch(`/api/linksByFid?fid=${user?.fid}`).then(res => res.json()),
    enabled: !!user?.fid,
  })

  const [page, setPage] = useState(Math.floor(follows?.length / 10))

  useEffect(() => {
    async function main() {
      if (!links?.length) return
      if (follows?.length >= links.length) return

      const fids = links
        .slice(page * 10, page * 10 + 10)
        .map((link: any) => link.data.linkBody.targetFid)
        .join(",")

      if (!fids) return

      const following = (await fetch(`/api/following?fids=${fids}`).then(res => res.json())) as UserData[]

      updateStore(prev => ({
        follows: [...prev.follows, ...following.sort((a, b) => a.username.localeCompare(b.username))],
      }))
    }

    main()

    return () => {}
  }, [links?.length, page])

  useEffect(() => {
    if (!bottomRef.current) return
    if (follows?.length >= links?.length) return

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (page * 10 >= links.length) return observer.disconnect()
        setPage(prev => prev + 1)
      }
    })

    observer.observe(bottomRef.current)

    return () => observer.disconnect()
  }, [bottomRef.current])

  const navigate = useNavigate()

  const { data: hash, isPending, writeContractAsync } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ chainId: monadTestnet.id, hash })
  const { switchChainAsync, switchChain } = useSwitchChain()
  const chainId = useChainId()
  const { isConnected, address } = useAccount()
  const { connectAsync, connectors } = useConnect()

  const { mutateAsync: giftMutateAsync } = useMutation({
    mutationFn: async (flower: "daisy" | "lily" | "rose" | "sunflower" | "tulip") =>
      axios.post("/api/gifts", {
        session,
        receiverFid: receiver?.fid,
        flower,
      }),
  })

  return (
    <main>
      <div
        className={clsx(
          "fixed top-24 min-[370px]:top-30 left-10 right-10",
          "text-black font-bold",
          "rounded-3xl",
          "bg-[var(--accent)]",
          "tracking-widest",
          "border-3 border-[var(--accent)]",
          "overflow-hidden",
        )}
      >
        <div className={clsx("bg-[var(--accent)]", "text-lg min-[420px]:text-xl", "text-white text-center", "pb-1.5")}>
          users you follow
        </div>
        <div className={`h-50 min-[390px]:h-65 overflow-y-scroll `}>
          {(!follows.length || isLoading) &&
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 pt-3 last:pb-3 bg-white overflow-hidden">
                <div className="bg-gray-200 w-5 h-5 rounded-full animate-pulse"></div>
                <div className="bg-gray-200 w-full h-4 rounded animate-pulse"></div>
              </div>
            ))}
          {follows &&
            follows.map((user: UserData) => (
              <div
                key={user.fid}
                onClick={() => {
                  updateStore({ receiver: user })
                }}
                className={clsx(
                  "flex items-center gap-3",
                  "px-3 py-1.5",
                  "border-b border-b-[var(--accent)]",
                  "overflow-hidden",
                  "cursor-pointer",
                  "first:border-t first:border-t-[var(--dark-accent)]",
                  "last:border-b-[var(--dark-accent)]",
                  receiver?.fid === user.fid ? "text-white bg-[var(--accent)]" : "bg-white",
                )}
              >
                <div className="w-5 h-5">
                  <Suspense fallback={<div className="bg-gray-200 w-5 h-5 rounded-full animate-pulse"></div>}>
                    <img
                      loading="lazy"
                      src={user.pfp_url || "/images/user.svg"}
                      sizes="20px"
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

          {links?.length && <div ref={bottomRef} className="h-[1px]" />}
        </div>
      </div>

      <Button
        text={((isPending || isConfirming) && "minting...") || "gift"}
        disabled={!receiver || isPending || isConfirming}
        onClick={async () => {
          if (!receiver) return

          const { flower } = store.getState()

          // if (chainId !== monadTestnet.id)

          try {
            await connectAsync({ connector: connectors[0] })
          } catch (error) {}

          try {
            await switchChainAsync({ chainId: monadTestnet.id })
          } catch (error) {}

          await writeContractAsync({
            address: CA,
            abi: ABI,
            functionName: "mint",
            args: [receiver.verified_addresses.primary.eth_address, BigInt(IDS_MAP[flower]), BigInt(1), "0x"],
            chain: monadTestnet,
          })

          await giftMutateAsync(flower)

          navigate(`/result`)
        }}
      />

      <Warning />
    </main>
  )
}

export default Receiver
