import React from 'react'
import { CiSearch } from 'react-icons/ci'
import { HiChevronDown } from 'react-icons/hi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { trpc } from '../../utils/trpc'
import Post from '../Post'

const MainSection = () => {
  const getPosts = trpc.post.getPosts.useQuery()

  return (
    <main className="col-span-12 border-gray-300 px-24 lg:col-span-8 lg:border-r">
      {/* search part */}
      <div className="flex w-full flex-col space-y-4 py-10">
        <div className="flex w-full items-center space-x-4">
          <label
            htmlFor="search"
            className="relative w-full rounded-3xl border border-gray-800"
          >
            {/* search icon */}
            <div className="absolute left-2 flex h-full items-center">
              <CiSearch />
            </div>
            {/* search bar */}
            <input
              type="text"
              name="search"
              id="search"
              className="w-full rounded-3xl px-4 py-1 pl-7 text-sm outline-none placeholder:text-xs placeholder:text-gray-300"
              placeholder="Search..."
            />
          </label>
          <div className="flex w-full items-center justify-end space-x-4">
            {/* topics */}
            <div>My topics:</div>
            {/* tags */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-gray-200/50 px-4 py-3">
                  tag {i}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* articles and follow */}
        <div className="flex w-full items-center justify-between border-b border-gray-300 pb-8">
          <div>Articles</div>
          <div>
            <button className="flex items-center space-x-2 rounded-3xl border border-gray-800 px-4 py-1.5 font-semibold">
              <div>Follow</div>
              <div>
                <HiChevronDown className="text-xl" />
              </div>
            </button>
          </div>
        </div>
      </div>
      {/* blog articles */}
      <div className="flex w-full flex-col justify-center space-y-8">
        {/* Loading */}
        {getPosts.isLoading && (
          <div className="flex h-full w-full items-center justify-center space-x-4">
            <div>
              <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
            <div> Loading...</div>
          </div>
        )}
        {/* Posts */}
        {getPosts.isSuccess &&
          getPosts.data.map((post) => <Post {...post} key={post.id} />)}
      </div>
    </main>
  )
}

export default MainSection
