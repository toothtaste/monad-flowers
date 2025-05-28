import { Next, User } from "../types"

export default function fetchFollows({ fid, page }: { fid: number; page: string }): Promise<{
  users: { object: string; user: User }[]
  next: Next
}> {
  return fetch(`/api/follows?fid=${fid}&cursor=${page}`).then(res => res.json())
}
