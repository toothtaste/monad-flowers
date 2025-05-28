function login({ session }: { session: string }) {
  return fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session }),
  }).then(res => res.json())
}

export { login }
