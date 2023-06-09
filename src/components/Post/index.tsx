import React, { useEffect, useState } from 'react'
import { CiBookmarkCheck, CiBookmarkPlus } from 'react-icons/ci'
import { trpc } from '../../utils/trpc'
import type { RouterOutputs } from '../../utils/trpc'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'

type PostProps = RouterOutputs['post']['getPosts']['posts'][number]

// Post part(include bookmark)
const Post = ({ ...post }: PostProps) => {
  const [isBookmarked, setIsBookmarked] = useState(
    Boolean(post.bookmarks?.length)
  )

  const bookmarkPost = trpc.post.bookmarkPost.useMutation({
    onSuccess: () => {
      setIsBookmarked((prev) => !prev)
    },
  })
  const removeBookmark = trpc.post.removeBookmark.useMutation({
    onSuccess: () => {
      setIsBookmarked((prev) => !prev)
    },
  })

  useEffect(() => {
    setIsBookmarked(isBookmarked)
  }, [isBookmarked])

  return (
    <div
      key={post.id}
      className="flex flex-col space-y-4 border-b border-gray-300 pb-8 last:border-none"
    >
      {/* Author and Created at */}
      <Link
        href={`/user/${post.author.username}`}
        className="group flex w-full cursor-pointer items-center space-x-2"
      >
        {/* Author icon */}
        <div className="relative h-10 w-10 rounded-full bg-gray-400">
          {post.author.image && (
            <Image
              src={post.author.image}
              alt={post.author.name ?? 'icon'}
              className="rounded-full"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
        <div>
          <p className="font-semibold">
            <span className="mr-1 decoration-black group-hover:underline">
              {post.author.name}
            </span>
            &#x2022;
            <span className="mx-1">
              {dayjs(post.createdAt).format('YYYY/MM/DD')}
            </span>
          </p>
          <p className="text-sm">Developer</p>
        </div>
      </Link>
      <Link
        href={`/${post.slug !== '' ? post.slug : 'not-found'}`}
        className="group grid h-44 w-full grid-cols-12 gap-4 overflow-hidden"
      >
        {/* Content */}
        <div className="col-span-8 flex h-full w-full flex-col space-y-4">
          <p className="text-2xl font-bold text-gray-800 decoration-black group-hover:underline">
            {post.title}
          </p>
          <div className="h-full w-full max-w-sm truncate break-words text-sm text-gray-500">
            {post.description}
          </div>
        </div>
        {/* Image */}
        <div className="col-span-4">
          <div className="relative h-full w-full transform rounded-xl bg-gray-300 transition duration-300 hover:scale-105 hover:shadow-xl">
            {post.featuredImage && (
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
        </div>
      </Link>
      {/* tags */}
      <div>
        <div className="flex w-full items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            {post.tags.map((tag) => (
              <div
                key={tag.id}
                onClick={() => {
                  // Tag page
                }}
                className="rounded-2xl bg-gray-200/50 px-5 py-3"
              >
                {tag.name}
              </div>
            ))}
          </div>
          {/* Bookmark */}
          <div>
            {isBookmarked ? (
              <CiBookmarkCheck
                onClick={() => removeBookmark.mutate({ postId: post.id })}
                className="cursor-pointer text-3xl text-indigo-600"
              />
            ) : (
              <CiBookmarkPlus
                className="cursor-pointer text-3xl"
                onClick={() => {
                  bookmarkPost.mutate({
                    postId: post.id,
                  })
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
