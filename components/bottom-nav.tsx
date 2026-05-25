"use client"

import { useRouter } from "next/navigation"

import {
  House,
  Compass,
  Bell,
  User
} from "lucide-react"

export default function BottomNav() {

  const router =
    useRouter()

  return (

    <div
      className="
        fixed
        bottom-4
        left-1/2
        -translate-x-1/2
        w-[95%]
        max-w-[520px]
        h-[74px]
        rounded-[28px]
        bg-[#0B1020]/90
        backdrop-blur-2xl
        border
        border-white/10
        flex
        items-center
        justify-around
        z-[9999]
        shadow-2xl
      "
    >

      {/* HOME */}
      <button

        onClick={() =>
          router.push("/")
        }

        className="
          flex
          flex-col
          items-center
          gap-1
          text-pink-500
        "
      >

        <House size={22} />

        <span
          className="
            text-[11px]
            font-medium
          "
        >
          Home
        </span>

      </button>

      {/* EXPLORE */}
      <button

        onClick={() =>
          router.push("/explore")
        }

        className="
          flex
          flex-col
          items-center
          gap-1
          text-gray-300
          hover:text-white
          transition
        "
      >

        <Compass size={22} />

        <span
          className="
            text-[11px]
          "
        >
          Explore
        </span>

      </button>

      {/* NOTIFICATION */}
      <button

        onClick={() =>
          router.push("/notifications")
        }

        className="
          flex
          flex-col
          items-center
          gap-1
          text-gray-300
          hover:text-white
          transition
        "
      >

        <Bell size={22} />

        <span
          className="
            text-[11px]
          "
        >
          Alerts
        </span>

      </button>

      {/* PROFILE */}
      <button

        onClick={() =>
          router.push("/profile")
        }

        className="
          flex
          flex-col
          items-center
          gap-1
          text-gray-300
          hover:text-white
          transition
        "
      >

        <User size={22} />

        <span
          className="
            text-[11px]
          "
        >
          Profile
        </span>

      </button>

    </div>

  )

}