import { MouseEventHandler } from "react"

const Button = ({
  onClick,
  text,
  disabled,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>
  text?: string
  disabled?: boolean
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`fixed bottom-12 left-13 right-13
                 pt-2 pb-2.5
               text-white font-bold text-base
                 rounded-2xl
                 bg-[var(--accent)]
                 ${disabled && "bg-[var(--inactive-accent)]"}`}
    >
      {text}
    </button>
  )
}

export default Button
