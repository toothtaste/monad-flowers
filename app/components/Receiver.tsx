const Receiver = () => {
  return (
    <main
      className="fixed top-30 left-10 right-10
                 text-black font-bold
                   rounded-2xl
                 bg-white
                   tracking-widest
                   border-3 border-[var(--accent)]"
    >
      <div
        className="bg-[var(--accent)]
                     text-lg text-white text-center
                     pb-1.5
                     rounded-t-lg"
      >
        users you follow
      </div>
      <div className="flex flex-col gap-3 px-3 pt-[9px] pb-3.5 text-sm leading-6"></div>
    </main>
  )
}

export default Receiver
