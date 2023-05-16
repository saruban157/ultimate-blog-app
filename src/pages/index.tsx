import React from 'react'
import { IoReorderThreeOutline } from 'react-icons/io5'
import { BsBell } from 'react-icons/bs'
import { FiEdit } from 'react-icons/fi'
import { CiSearch } from 'react-icons/ci'
import { HiChevronDown } from 'react-icons/hi'

const HomePage = () => {
  return (
    <div className="flex h-screen w-full flex-col">
      {/* header */}
      <header className="flex h-20 w-full flex-row items-center justify-around border-b-[1px] border-gray-200 bg-white">
        {/* header left */}
        <div>
          <IoReorderThreeOutline className="text-2xl text-gray-600" />
        </div>
        {/* header center */}
        <div className="text-xl font-thin">Ultimate Blog App</div>
        {/* header right */}
        <div className="flex items-center space-x-4">
          <div>
            <BsBell className="text-2xl" />
          </div>
          {/* account */}
          <div>
            <div className="h-5 w-5 rounded-full bg-gray-600" />
          </div>
          {/* new post button */}
          <div>
            <button className="flex items-center space-x-3 rounded border border-gray-200 px-4 py-2.5 transition hover:border-gray-900">
              <div>Wtite</div>
              <div>
                <FiEdit className="text-gray-600" />
              </div>
            </button>
          </div>
        </div>
      </header>
      {/* main section */}
      <section className="grid h-full w-full grid-cols-12 place-items-center">
        {/* main part */}
        <main className="col-span-8 h-full w-full border border-r border-gray-300">
          {/* search part */}
          <div className="flex w-full flex-col space-y-4 px-24 py-10">
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
                  className="w-full rounded-3xl px-4 py-1 pl-7 outline-none placeholder:text-xs placeholder:text-gray-300"
                  placeholder="Search..."
                />
              </label>
              <div className="flex w-full items-center space-x-4">
                {/* topics */}
                <div>My tpocs:</div>
                {/* tags */}
                <div className="flex items-center space-x-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-3xl bg-gray-200/50 px-4 py-3"
                    >
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
          <div>main part</div>
        </main>
        {/* sidebar section */}
        <aside className="col-span-4">side bar</aside>
      </section>
    </div>
  )
}

export default HomePage
