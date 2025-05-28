import { GiftsCollection } from "@/lib/db"
import { Flower } from "@/lib/store/types"

function getGifts({ fid }: { fid: number }): Promise<GiftsCollection> {
  return fetch(`/api/gifts?fid=${fid}`).then(res => res.json())
}

function postGifts({ session, receiverFid, flower }: { session: string; receiverFid: number; flower: Flower }) {
  return fetch("/api/gifts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session, receiverFid, flower }),
  }).then(res => res.json())
}

export { getGifts, postGifts }
