import { MouseEventHandler } from "react"
import { useNavigate } from "react-router"

const Button = ({
  to,
  onClick,
  text,
  disabled,
}: {
  to?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  text?: string
  disabled?: boolean
}) => {
  const navigate = useNavigate()
  return (
    <button
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) onClick(e)
        if (to) navigate(to)
      }}
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
