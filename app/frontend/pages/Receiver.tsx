"use client"

import { ABI, CA, IDS_MAP } from "@/lib/constants"
import { store, updateStore } from "@/lib/store"
import { UserData } from "@/lib/store/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Suspense } from "react"
import { useNavigate } from "react-router"
import { monadTestnet } from "viem/chains"
import { useAccount, useChainId, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import Button from "../components/Button"

const Receiver = () => {
  const { session, user, receiver, flower } = store()

  const { data, isLoading, error } = useQuery<UserData[], Error>({
    queryKey: ["following", user?.fid],
    queryFn: () => fetch(`/api/following?fid=${user?.fid}`).then(res => res.json()),
    enabled: !!user?.fid,
  })

  const navigate = useNavigate()

  const { data: hash, isPending, writeContract, writeContractAsync } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ chainId: monadTestnet.id, hash })
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { isConnected, address } = useAccount()

  const { mutateAsync: giftMutateAsync } = useMutation({
    mutationFn: async (flowerName: "daisy" | "lily" | "rose" | "sunflower" | "tulip") =>
      axios.post("/api/gifts", {
        session,
        receiverFid: receiver?.fid,
        flowerName,
      }),
  })

  // (https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

  return (
    <main>
      <div
        className="fixed top-24 min-[370px]:top-30 left-10 right-10
               text-black font-bold
                 rounded-3xl
               bg-[var(--accent)]
                 tracking-widest
                 border-3 border-[var(--accent)]
                 overflow-hidden"
      >
        <div
          className="bg-[var(--accent)]
                   text-lg min-[420px]:text-xl text-white text-center
                   pb-1.5"
        >
          users you follow
        </div>
        <div className={`h-50 min-[390px]:h-65 overflow-y-scroll `}>
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
        </div>
      </div>

      <Button
        text={
          ((isPending || isConfirming) && "minting...") || (chainId !== monadTestnet.id && "change network") || "gift"
        }
        disabled={!receiver || isPending || isConfirming || chainId !== monadTestnet.id}
        onClick={async () => {
          if (!receiver) return

          const { flower } = store.getState()

          if (!(chainId === monadTestnet.id)) switchChain({ chainId: monadTestnet.id })

          const hash = await writeContractAsync({
            address: CA,
            abi: ABI,
            functionName: "mint",
            args: [receiver.verified_addresses.primary.eth_address, BigInt(IDS_MAP[flower]), BigInt(1), "0x"],
            chain: monadTestnet,
          })

          await giftMutateAsync(flower)

          navigate(`/result/${hash}`)
        }}
      />
    </main>
  )
}

export default Receiver
