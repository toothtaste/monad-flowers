import axiosInstance from "../config"
import { User } from "../types"

export default function fetchFollows(): Promise<{ object: string; user: User }[]> {
  return axiosInstance.get(`/api/follows`).then(res => res.data)
}
