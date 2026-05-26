import Feed from "../components/feed"
import BottomNav from "../components/bottom-nav"

export default function Home() {

  return (

    <main
      className="
        min-h-screen
        bg-black
        text-white
        pb-28
      "
    >

      <Feed />

      <BottomNav />

    </main>

  )

}