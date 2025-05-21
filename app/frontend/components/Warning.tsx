import clsx from "clsx"
import { useState } from "react"

const Warning = () => {
  const [visible, setVisible] = useState(navigator.userAgent === "warpcast")

  if (visible)
    return (
      <div className={clsx("fixed left-5 bottom-10 right-5 z-30", "bg-yellow-600", "p-3 pb-3.5", "text-white", "rounded-xl")}>
        Gifting on&nbsp;mobile isn&rsquo;t working due to&nbsp;an&nbsp;issue with the Warpcast client. You can either open
        it&nbsp;on&nbsp;desktop or&nbsp;add the mini app to&nbsp;try again later.
        <div
          className={clsx("absolute right-[2.5%] top-[0]", "cursor-pointer", "text-white", "text-2xl")}
          onClick={() => {
            setVisible(false)
          }}
        >
          ×
        </div>
      </div>
    )
}

export default Warning
