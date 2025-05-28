import axiosInstance from "../config"

function login({ session }: { session: string }) {
  return axiosInstance.post("/api/login", { session }).then(res => res.data)
}

export { login }
