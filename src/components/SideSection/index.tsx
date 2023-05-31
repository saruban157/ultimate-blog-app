import React from 'react'
import classNames from 'classnames'
import { trpc } from '../../utils/trpc'
import dayjs from 'dayjs'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

const SideSection = () => {
  const defaultButtonStyle =
    'flex items-center space-x-3 rounded border border-gray-200 px-4 py-2.5 transition hover:border-gray-900'

  const readingList = trpc.post.getReadingList.useQuery()
  const suggestions = trpc.user.getSuggestions.useQuery()

  const followUser = trpc.user.followUser.useMutation({
    onSuccess: () => {
      toast.success('User followed')
    },
  })

  return (
    <aside className="hidden flex-col space-y-4 p-6 lg:col-span-4 lg:flex">
      {/* Reccomendation list */}
      <div>
        <h3 className="my-6 text-lg font-semibold">
          People you might be interested
        </h3>
        {/* Bookmarks */}
        <div className="flex flex-col space-y-4">
          {suggestions.isSuccess &&
            suggestions.data.map((user) => (
              <div
                key={user.id}
                className="flex flex-row items-center space-x-5"
              >
                {/* icon */}
                <div className="h-10 w-10 flex-none rounded-full bg-gray-300"></div>
                <div>
                  {/* title and description */}
                  <div className="text-sm font-bold text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-xs">{user.username}</div>
                </div>
                <div>
                  <button
                    onClick={() =>
                      followUser.mutate({
                        followingUserId: user.id,
                      })
                    }
                    className={classNames(
                      defaultButtonStyle,
                      'border-gray-400/50'
                    )}
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* Reading list */}
      <div>
        <h3 className="my-6 text-lg font-semibold">Your reading list</h3>
        <div className="flex flex-col space-y-8">
          {readingList.data &&
            readingList.data.map((bookmark) => (
              <Link
                href={`/${bookmark.post.slug}`}
                key={bookmark.id}
                className="group flex items-center space-x-6"
              >
                {/* Thumnail */}
                <div className="aspect-square h-full w-2/5 rounded-xl bg-gray-300"></div>
                {/* Title and description */}
                <div className="flex w-3/5 flex-col space-y-2">
                  <div className="text-lg font-semibold decoration-black group-hover:underline">
                    {bookmark.post.title}
                  </div>
                  <div className="truncate">{bookmark.post.description} </div>
                  {/* Author */}
                  <div className="flex w-full items-center space-x-4">
                    {/* icon */}
                    <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                    <div>{bookmark.post.author.name} &#x2022;</div>
                    <div>
                      {dayjs(bookmark.post.createdAt).format('YYYY/MM/DD')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </aside>
  )
}

export default SideSection
