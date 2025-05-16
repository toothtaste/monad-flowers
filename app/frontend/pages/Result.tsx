"use client"

import { ABI, CA } from "@/lib/constants"
import { store } from "@/lib/store"
import Link from "next/link"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { monadTestnet } from "viem/chains"
import { useReadContract, useWaitForTransactionReceipt } from "wagmi"
import Button from "../components/Button"

const Result = () => {
  const navigate = useNavigate()

  const { hash } = useParams() as { hash: `0x${string}` | undefined }

  const { receiver } = store()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ chainId: monadTestnet.id, hash })
  const { data, isLoading, error } = useReadContract({
    address: CA,
    abi: ABI,
    functionName: "balanceOf",
    args: [receiver?.verified_addresses.primary.eth_address, 4],
    query: {
      enabled: !!receiver?.verified_addresses.primary.eth_address,
    },
  })

  useEffect(() => {
    console.log(hash)
  }, [hash])

  useEffect(() => {
    console.log(error)
  }, [error])

  useEffect(() => {
    console.log(data)
  }, [data])

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
        <div className="flex flex-col gap-3 px-3 pt-[9px] pb-3.5 text-sm text-center leading-6">
          <p>{isSuccess ? `@${receiver?.username} has received your gift!` : "confirming..."}</p>
          <p>
            tx&nbsp;hash:{" "}
            {hash && (
              <Link href={`https://monad-testnet.socialscan.io/tx/${hash}`} className="underline">
                {hash && `${hash.slice(0, 6)}...${hash.slice(-6)}`}
              </Link>
            )}
          </p>

          <p>
            balance:&nbsp;
            {isLoading ? "loading..." : data !== undefined ? data?.toString() : "no data"}
          </p>

          <p>powered by&nbsp;Monad Protocol</p>
        </div>
      </div>

      <Button
        text="home"
        onClick={() => {
          navigate("/")
        }}
      />
    </main>
  )
}

export default Result
