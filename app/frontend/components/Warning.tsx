import clsx from "clsx"
import { useState } from "react"

const Warning = () => {
  const [visible, setVisible] = useState(navigator.userAgent === "warpcast")

  if (visible)
    return (
      <div className={clsx("fixed left-5 bottom-25 right-5 z-30", "bg-yellow-600", "p-3 pb-3.5", "text-white", "rounded-xl")}>
        If&nbsp;you can&rsquo;t gift on&nbsp;mobile, try restarting your phone to&nbsp;update Warpcast to&nbsp;the latest version.
        <div
          className={clsx("absolute right-[2.5%] top-0", "cursor-pointer", "text-white", "text-2xl")}
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
