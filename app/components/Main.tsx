import { store } from "@/lib/store"
import { Step } from "@/lib/store/types"
import Flowers from "./Flowers"
import Guide from "./Guide"
import Receiver from "./Receiver"
import Result from "./Result"

const Main = () => {
  const { step } = store()

  if (step === Step.Guide) return <Guide />
  if (step === Step.Flower) return <Flowers />
  if (step === Step.Receiver) return <Receiver />
  if (step === Step.Result) return <Result />
}

export default Main
