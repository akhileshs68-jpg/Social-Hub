"use client"

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