import { MouseEventHandler, ReactNode } from "react"

const Button = ({
  onClick,
  children,
  disabled,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
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
      {children}
    </button>
  )
}

export default Button
