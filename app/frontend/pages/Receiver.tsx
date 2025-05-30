"use client"

import { ABI, CA, IDS_MAP } from "@/lib/constants"
import { store, updateStore } from "@/lib/store"

import fetchFollows from "@/lib/api/follows"
import { postGifts } from "@/lib/api/gifts"
import { User } from "@/lib/api/types"
import { Flower } from "@/lib/store/types"
import sdk from "@farcaster/frame-sdk"
import { useMutation, useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import Image from "next/image"
import { Suspense, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { monadTestnet } from "viem/chains"
import { useConnect, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import Button from "../components/Button"

const Receiver = () => {
  const { user, receiver, follows } = store()

  const { data, isLoading } = useQuery<{ object: string; user: User }[]>({
    queryKey: ["follows", user?.fid],
    queryFn: () => fetchFollows(),
    enabled: !!user?.fid && !follows?.length,
  })

  useEffect(() => {
    if (!data || follows.length) return

    updateStore({
      follows: data
        .slice()
        .map(val => val.user)
        .sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase())),
    })
  }, [data])

  const navigate = useNavigate()

  const { data: hash, isPending, writeContractAsync } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ chainId: monadTestnet.id, hash })
  const { switchChainAsync } = useSwitchChain()
  const { connectAsync, connectors } = useConnect()

  const { mutateAsync: giftMutateAsync } = useMutation({
    mutationFn: async (flower: Flower) =>
      postGifts({
        receiverFid: receiver?.fid!,
        flower,
      }),
  })

  const [search, setSearch] = useState<string>("")

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
          {follows.length && !isLoading ? (
            <div>
              <div className="relative">
                <Image
                  src={"/images/search.svg"}
                  width={16}
                  height={16}
                  alt="search"
                  className={clsx("absolute left-3.5 top-[calc(50%)] -translate-y-1/2")}
                />
                <input
                  type="search"
                  name="search"
                  id="search"
                  placeholder="search"
                  role="searchbox"
                  className={clsx(
                    "text-white",
                    "pt-0.5 pb-1 pl-11 pr-3",
                    "w-full",
                    "border-y border-y-[var(--dark-accent)]",
                    "outline-0",
                    "focus:outline-none",
                  )}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  onChange={e => {
                    setSearch(e.target.value)
                  }}
                />
              </div>

              {follows
                .slice()
                .sort((a, b) => {
                  const aIndex = a.username.toLowerCase().indexOf(search.toLowerCase())
                  const bIndex = b.username.toLowerCase().indexOf(search.toLowerCase())

                  return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex)
                })
                .map((user: User) => (
                  <div
                    key={user.fid}
                    onClick={() => {
                      updateStore({ receiver: user })
                    }}
                    className={clsx(
                      "flex justify-between items-center",
                      "px-3 py-1.5",
                      "border-b border-b-[var(--accent)]",
                      "overflow-hidden",
                      "cursor-pointer",
                      "first:border-t first:border-t-[var(--dark-accent)]",
                      "last:border-b-[var(--dark-accent)]",
                      receiver?.fid === user.fid ? "text-white bg-[var(--accent)]" : "bg-white",
                    )}
                  >
                    <div className={clsx("flex items-center gap-3")}>
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

                    <div
                      className={clsx("w-4 h-4")}
                      onClick={e => {
                        e.stopPropagation()
                        sdk.actions.viewProfile({ fid: user.fid })
                      }}
                    >
                      <Image src={`/images/farcaster.svg`} alt="farcaster" width={16} height={16} />
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 pt-3 last:pb-3 bg-white overflow-hidden">
                <div className="bg-gray-200 w-5 h-5 rounded-full animate-pulse"></div>
                <div className="bg-gray-200 w-full h-4 rounded animate-pulse"></div>
              </div>
            ))
          )}
        </div>
      </div>

      <Button
        text={((isPending || isConfirming) && "minting...") || "gift"}
        disabled={!receiver || isPending || isConfirming}
        onClick={async () => {
          if (!receiver) return

          const { flower } = store.getState()

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
    </main>
  )
}

export default Receiver
