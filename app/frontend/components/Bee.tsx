import Image from "next/image"
import { useState } from "react"

const Bee = () => {
  const [gif, setGif] = useState<string>()

  return (
    <>
      <div
        className="fixed bottom-3/12 animate-bee-flight cursor-pointer z-20"
        onClick={() => {
          setGif(`/bees/${Math.floor(Math.random() * 7 + 1)}.webp`)
        }}
      >
        <Image src={"/images/bee.svg"} width={48} height={48} alt="bee" />
      </div>

      {gif && (
        <div className="fixed inset-0 z-30">
          <Image
            src={gif}
            fill
            unoptimized
            alt="gif"
            className="object-fill object-center"
            onLoad={() => {
              setTimeout(() => setGif(undefined), 5000)
            }}
          />
        </div>
      )}
    </>
  )
}

export default Bee
