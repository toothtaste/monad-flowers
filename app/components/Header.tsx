import { store } from "@/lib/store"
import Image from "next/image"

const Header = () => {
  const { user } = store()

  return (
    <header>
      <div className="fixed left-5 top-8">
        <Image src={"/images/info.svg"} width={32} height={32} alt="info" />

        <div className="absolute -left-[29px] -bottom-8 -z-10 w-18 h-20">
          <Image src={"/images/dandelion.png"} fill alt="dandelion" />
        </div>
      </div>

      <div className="fixed left-0 right-0 flex justify-center">
        <Image src={"/images/logo.svg"} width={166} height={71} alt="logo" />
        <h1
          className="absolute left-1/2 -translate-x-1/2 bottom-[5px] pb-0.5
                     font-(family-name:--mogra) text-[19px] text-white"
        >
          monad&nbsp;flowers
        </h1>
      </div>

      <div className="fixed right-5 top-8">
        <div className="relative z-10 w-[31px] h-[31px] bg-[var(--accent)] rounded-full outline-2 outline-[var(--accent)]">
          <Image src={user?.pfpUrl || "/images/profile.svg"} fill alt="profile" className="rounded-full" />
        </div>

        <div className="absolute -left-0.5 bottom-1 w-12 h-12">
          <Image src={"/images/violet.png"} fill alt="profile-flower" />
        </div>
      </div>
    </header>
  )
}

export default Header

// import Image from "next/image"

// const Header = () => {
//   return (
//     <header
//       className="flex justify-between items-end
//                  w-11/12
//                  mx-auto"
//     >
//       <Image src={"/images/info.png"} width={32} height={32} alt="info" />
//       <Image src={"/images/logo.png"} width={166.6} height={71.3} alt="logo" />
//       <div
//         className="w-8 h-8
//                    bg-[var(--accent)]
//                    rounded-full"
//       ></div>
//     </header>
//   )
// }

// export default Header
