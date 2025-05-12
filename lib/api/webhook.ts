import { store } from "@/store"
import axios from "axios"

export default async function webhook({ token }: { token: string }) {
  try {
    const { session } = store.getState()

    await axios.post("/api/webhook", { session, token })
  } catch (error: any) {
    throw new Error(error.response?.data?.message)
  }
}
