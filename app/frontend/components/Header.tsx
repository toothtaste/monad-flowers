// import { store } from "@/lib/store"
// import Image from "next/image"

// const Header = () => {
//   const { user } = store()

//   return (
//     <header>
//       <div className="fixed left-5 top-8">
//         <Image src={"/images/header/info.svg"} sizes="32px" width={32} height={32} alt="info" className="cursor-pointer" />

//         <div className="absolute -left-[29px] -bottom-8 -z-10 w-18 h-20">
//           <Image src={"/images/header/dandelion.png"} sizes="72px" fill alt="dandelion" />
//         </div>
//       </div>

//       <div className="fixed left-0 right-0 flex justify-center pointer-events-none">
//         <Image src={"/images/header/logo.svg"} sizes="166px" width={166} height={71} alt="logo" className="w-auto h-auto" />
//         <h1
//           className="absolute left-1/2 -translate-x-1/2 bottom-[5px] pb-0.5
//                      font-(family-name:--mogra) text-[19px] text-white"
//         >
//           monad&nbsp;flowers
//         </h1>
//       </div>

//       <div className="fixed right-5 top-8" onClick={() => {}}>
//         <div className="relative z-10 w-[31px] h-[31px] bg-[var(--accent)] rounded-full outline-2 outline-[var(--accent)] cursor-pointer">
//           <Image src={user?.pfpUrl || "/images/user.svg"} sizes="31px" fill alt="profile" className="rounded-full" />
//         </div>

//         <div className="absolute -left-0.5 bottom-1 w-12 h-12">
//           <Image src={"/images/header/violet.png"} sizes="48px" fill alt="profile-flower" />
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Header
