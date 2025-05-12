import axios from "axios"

type params = { message: string; signature: string; nonce: string }

export async function login({ message, signature, nonce }: params) {
  try {
    const { data } = await axios.post("/api/login", {
      message,
      signature,
      nonce,
    })

    return data
  } catch (error: any) {
    throw new Error(error.response?.data?.message)
  }
}
