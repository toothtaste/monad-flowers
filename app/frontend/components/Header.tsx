"use client"

import { store } from "@/lib/store"
import Image from "next/image"
import { useNavigate } from "react-router"

const Header = () => {
  const { user } = store()

  const navigate = useNavigate()

  return (
    <header>
      <div className="fixed left-5 top-8">
        <div
          className="cursor-pointer"
          onClick={() => {
            navigate("/")
          }}
        >
          <div className="flex justify-center items-center aspect-square w-8 bg-white/60 rounded-full">
            <Image src={"/images/header/home.svg"} sizes="24px" priority width={24} height={24} alt="info" />
          </div>
        </div>

        <div className="absolute -left-[29px] -bottom-[32.5px] -z-10 aspect-square w-18">
          <Image src={"/images/header/dandelion.png"} sizes="72px" priority fill alt="dandelion" />
        </div>
      </div>

      <div className="fixed left-0 right-0 min-[390px]:-top-3 flex justify-center pointer-events-none">
        <div className="relative aspect-[166/71] w-41.5 min-[390px]:w-50 min-[390px]:h-22 min-[420px]:w-58">
          <Image src={"/images/header/logo.svg"} sizes="166px" priority fill alt="logo" />
        </div>

        <h1
          className="absolute left-1/2 -translate-x-1/2 bottom-[5px] min-[390px]:bottom-2 pb-0.5
                     font-(family-name:--mogra) text-white text-[19px] min-[390px]:text-[22px] min-[420px]:text-2xl"
        >
          monad&nbsp;flowers
        </h1>
      </div>

      <div className="fixed right-5 top-8">
        <div
          className="relative z-10 aspect-square w-[31px] bg-[var(--accent)] rounded-full outline-2 outline-[var(--accent)] cursor-pointer"
          onClick={() => {
            navigate("/profile")
          }}
        >
          <Image
            src={user?.pfpUrl || "/images/user.svg"}
            sizes="31px"
            priority
            fill
            alt="profile"
            className="rounded-full"
          />
        </div>

        <div className="absolute -left-0.5 bottom-1 aspect-square w-12">
          <Image src={"/images/header/violet.png"} sizes="48px" priority fill alt="profile-flower" />
        </div>
      </div>
    </header>
  )
}

export default Header
