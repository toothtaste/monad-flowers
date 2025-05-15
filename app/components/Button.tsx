import { store, updateStore } from "@/lib/store"
import { Flower, Step } from "@/lib/store/types"
import { monadTestnet } from "viem/chains"
import { useAccount, useConnect, useWaitForTransactionReceipt, useWriteContract } from "wagmi"

const ca = "0xB84BAF79Ab57f4485c53925be707e45e1e7B90f0"
const abi = ["function mint(address account, uint256 id, uint256 amount, bytes data)"]

const Button = () => {
  const { step, receiver, flower } = store()

  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  const { data: hash, isPending, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ chainId: monadTestnet.id, hash })

  return (
    <button
      onClick={() => {
        switch (step) {
          case Step.Receiver:
            if (!receiver) break

            if (!isConnected) console.log("not connected")

            console.log(address)

            const ids = {
              [Flower.Rose]: 3,
              [Flower.Daisy]: 1,
              [Flower.Lily]: 2,
              [Flower.Sunflower]: 4,
              [Flower.Tulip]: 5,
            }

            writeContract({
              address: ca,
              abi,
              functionName: "mint",
              args: [receiver.verified_addresses.primary.eth_address, ids[flower], 1, "0x"],
            })

            break
          case Step.Result:
            updateStore({ step: 0 })
            break
          default:
            updateStore({ step: Step.Guide })
            return
        }

        updateStore(prev => ({ step: prev.step + 1 }))
      }}
      disabled={(step === Step.Receiver && !receiver) || isPending || isConfirming}
      className={`fixed bottom-12 left-13 right-13
                 pt-2 pb-2.5
               text-white font-bold text-base
                 rounded-2xl
                 bg-[var(--accent)]
                 ${step === Step.Receiver && !receiver && "bg-[var(--inactive-accent)]"}`}
    >
      {step === Step.Flower
        ? "select"
        : step === Step.Receiver
        ? ((isPending || isConfirming) && "minting...") || "gift"
        : step === Step.Result
        ? "home"
        : "okay"}
    </button>
  )
}

export default Button
