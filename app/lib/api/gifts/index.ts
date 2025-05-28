import { GiftsCollection } from "@/lib/db"
import { Flower } from "@/lib/store/types"
import axiosInstance from "../config"

function getGifts(): Promise<GiftsCollection> {
  return axiosInstance.get(`/api/gifts`).then(res => res.data)
}

function postGifts({ receiverFid, flower }: { receiverFid: number; flower: Flower }) {
  return axiosInstance.post("/api/gifts", { receiverFid, flower }).then(res => res.data)
}

export { getGifts, postGifts }
