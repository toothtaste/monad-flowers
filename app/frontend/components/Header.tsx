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
          <Image src={"/images/header/info.svg"} sizes="32px" width={32} height={32} alt="info" />
        </div>

        <div className="absolute -left-[29px] -bottom-8 -z-10 w-18 h-20">
          <Image src={"/images/header/dandelion.png"} sizes="72px" fill alt="dandelion" />
        </div>
      </div>

      <div className="fixed left-0 right-0 min-[390px]:-top-3 flex justify-center pointer-events-none">
        <div className="relative w-41.5 h-18 min-[390px]:w-50 min-[390px]:h-22 min-[420px]:w-58">
          <Image src={"/images/header/logo.svg"} sizes="166px" fill alt="logo" />
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
          className="relative z-10 w-[31px] h-[31px] bg-[var(--accent)] rounded-full outline-2 outline-[var(--accent)] cursor-pointer"
          onClick={() => {
            navigate("/profile")
          }}
        >
          <Image src={user?.pfpUrl || "/images/user.svg"} sizes="31px" fill alt="profile" className="rounded-full" />
        </div>

        <div className="absolute -left-0.5 bottom-1 w-12 h-12">
          <Image src={"/images/header/violet.png"} sizes="48px" fill alt="profile-flower" />
        </div>
      </div>
    </header>
  )
}

export default Header
