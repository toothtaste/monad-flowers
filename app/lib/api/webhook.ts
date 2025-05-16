import { store } from "@/lib/store"
import axios from "axios"

export async function webhook({ token }: { token: string }) {
  try {
    const { session } = store.getState()

    if (!session) throw new Error("No session")

    await axios.post("/api/webhook", { session, token })
  } catch (error: any) {
    throw new Error(error.response?.data?.message)
  }
}
