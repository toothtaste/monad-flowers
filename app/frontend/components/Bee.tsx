import Image from "next/image"
import { useState } from "react"

const Bee = () => {
  const [gif, setGif] = useState<number>(1)
  const [visible, setVisible] = useState<boolean>(false)

  return (
    <>
      <div
        className="fixed bottom-3/12 animate-bee-flight cursor-pointer z-20"
        onClick={() => {
          setVisible(true)
        }}
      >
        <Image src={"/images/bee.svg"} width={48} height={48} alt="bee" />
      </div>

      {visible && (
        <div className="fixed inset-0 z-30">
          <Image
            src={`/bees/${gif}.webp`}
            fill
            unoptimized
            alt="gif"
            className="object-fill object-center"
            onLoad={() => {
              setTimeout(() => {
                setVisible(false)
                setGif(prev => {
                  return prev >= 7 ? 1 : prev + 1
                })
              }, 5000)
            }}
          />
        </div>
      )}
    </>
  )
}

export default Bee
