import { store } from "@/lib/store"
import { monadTestnet } from "viem/chains"
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi"

const Result = () => {
  const { receiver } = store()

  const { data: hash } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ chainId: monadTestnet.id, hash })

  return (
    <main
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
        <p>{isSuccess ? `@${receiver?.username}&nbsp;has received your gift!` : "confirming..."}</p>
        <p>tx&nbsp;hash: {hash}</p>
        <p>powered w/&nbsp;Monad Protocol</p>
      </div>
    </main>
  )
}

export default Result
