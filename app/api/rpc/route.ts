import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { ALCHEMY_API_KEY } = process.env
  if (!ALCHEMY_API_KEY) throw new Error("AlchemyNotConfigured")

  try {
    const body = await req.text()

    const response = await fetch(`https://monad-testnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })

    const data = await response.text()

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
