"use client"

<<<<<<< HEAD
import { PostCard } from "@/components/post-card"
import type { Post } from "@/lib/types"

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    username: "cryptopinoneer",
    avatar: "C",
    timeAgo: "2h ago",
    content:
      "Just reached 100 Pi! This community is amazing. Can't wait to see what we build together on Social Hub Pi! #PiNetwork #Milestone #Crypto",
    likes: 42,
    comments: 8,
    shares: 3,
    isLiked: false,
    imageUrl: "/placeholder.svg?height=400&width=600",
    hashtags: ["PiNetwork", "Milestone", "Crypto"],
    piUid: "user123",
  },
  {
    id: "2",
    username: "blockchain_dev",
    avatar: "B",
    timeAgo: "4h ago",
    content:
      "Working on a new dApp for the Pi Network ecosystem. Anyone interested in collaborating? Drop your ideas below! #dApp #Development #Web3",
    likes: 128,
    comments: 23,
    shares: 12,
    isLiked: true,
    hashtags: ["dApp", "Development", "Web3"],
    piUid: "user456",
  },
  {
    id: "3",
    username: "pi_enthusiast",
    avatar: "P",
    timeAgo: "6h ago",
    content:
      "The future of social media is decentralized. Proud to be part of this revolution with Pi Network! #Decentralized #SocialMedia",
    likes: 89,
    comments: 15,
    shares: 7,
    isLiked: false,
    media: [
      {
        type: "image",
        url: "/placeholder.svg?height=400&width=400",
      },
      {
        type: "image",
        url: "/placeholder.svg?height=400&width=400",
      },
    ],
    hashtags: ["Decentralized", "SocialMedia"],
    piUid: "user789",
  },
  {
    id: "4",
    username: "techsavvy",
    avatar: "T",
    timeAgo: "8h ago",
    content:
      "Quick tip for new Pioneers: Make sure to mine daily and engage with the community. Together we're stronger! #PiTips #Community",
    likes: 203,
    comments: 34,
    shares: 18,
    isLiked: true,
    hashtags: ["PiTips", "Community"],
    piUid: "user101",
    isEdited: true,
  },
]

export function Feed() {
  return (
    <div className="divide-y divide-border">
      {MOCK_POSTS.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  )
}
=======
import {
  useEffect,
  useState
} from "react"

import {
  onValue,
  ref,
  remove
} from "firebase/database"

import {
  database
} from "../lib/firebase"

import PostCard from "./post-card"

export default function Feed() {

  const [posts, setPosts] =
    useState<any[]>([])

  // LOAD POSTS
  useEffect(() => {

    const postsRef =
      ref(database, "posts")

    onValue(
      postsRef,
      (snapshot) => {

        const data =
          snapshot.val()

        if (data) {

          const postsArray =
            Object.keys(data).map(
              (key) => ({
                firebaseId: key,
                ...data[key]
              })
            )

          setPosts(
            postsArray.reverse()
          )

        } else {

          setPosts([])

        }

      }
    )

  }, [])

  // DELETE
  const deletePost =
    async (
      id: string
    ) => {

      await remove(
        ref(
          database,
          `posts/${id}`
        )
      )

    }

  return (

    <div
      className="
        space-y-6
      "
    >

      {posts.map((post) => (

        <PostCard

          key={post.firebaseId}

          id={post.firebaseId}

          username="Pi User"

          content={
            post.content || ""
          }

          likes={
            post.likes || 0
          }

          createdAt={
            post.createdAt
          }

          media={
            post.media
              ? [
                  {
                    type:
                      post.mediaType,
                    url:
                      post.media
                  }
                ]
              : []
          }

          onDelete={() =>
            deletePost(
              post.firebaseId
            )
          }

        />

      ))}

    </div>

  )

}
>>>>>>> c07617a5128ffd992b542a41c1dea574864a3046
