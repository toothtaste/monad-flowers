import { GiftsCollection } from "@/lib/db"
import { Flower } from "@/lib/store/types"
import axiosInstance from "../config"

function getGifts(): Promise<GiftsCollection> {
  return axiosInstance.get(`/api/gifts`).then(res => res.data)
}

function postGifts({ receiverFid, flower, note }: { receiverFid: number; flower: Flower; note: string }) {
  return axiosInstance.post("/api/gifts", { receiverFid, flower, note }).then(res => res.data)
}

export { getGifts, postGifts }
