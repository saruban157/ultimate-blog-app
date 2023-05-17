import React from 'react'
import { IoReorderThreeOutline } from 'react-icons/io5'
import { BsBell } from 'react-icons/bs'
import { FiEdit } from 'react-icons/fi'
import { CiSearch } from 'react-icons/ci'
import { HiChevronDown } from 'react-icons/hi'
import classNames from 'classnames'

const HomePage = () => {
  const defaultButtonStyle =
    'flex items-center space-x-3 rounded border border-gray-200 px-4 py-2.5 transition hover:border-gray-900'
  return (
    <div className="flex h-full w-full flex-col">
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
            <button className={classNames(defaultButtonStyle, '')}>
              <div>Wtite</div>
              <div>
                <FiEdit className="text-gray-600" />
              </div>
            </button>
          </div>
        </div>
      </header>
      {/* main section */}
      <section className="grid grid-cols-12">
        {/* main part */}
        <main className="col-span-8 border-gray-300 px-24 lg:border-r">
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
                  className="w-full rounded-3xl px-4 py-1 pl-7 outline-none placeholder:text-xs placeholder:text-gray-300"
                  placeholder="Search..."
                />
              </label>
              <div className="flex w-full items-center space-x-4">
                {/* topics */}
                <div>My topics:</div>
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
          {/* blog articles */}
          <div className="flex w-full flex-col justify-center space-y-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col space-y-4 border-b border-gray-300 pb-8 last:border-none"
              >
                {/* Author and Created at */}
                <div className="flex w-full items-center space-x-2">
                  {/* Author icon */}
                  <div className="h-10 w-10 rounded-full bg-gray-400"></div>
                  <div>
                    <p className="font-semibold">
                      Saruban157 &#x2022; 17 May. 2023
                    </p>
                    <p className="text-sm">The founder & teacher</p>
                  </div>
                </div>
                <div className="grid w-full grid-cols-12 gap-4">
                  {/* Content */}
                  <div className="col-span-8 flex flex-col space-y-4">
                    <div className="text-3xl font-bold text-gray-800 decoration-black hover:underline">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Odio, ab!
                    </div>
                    <div className="break-words text-sm text-gray-500">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Deleniti ex iste saepe iure officiis dolores reiciendis
                      architecto illum error, quis beatae optio esse, itaque
                      iusto, vitae odio cupiditate eos laudantium sed quisquam
                      recusandae aperiam eligendi. Laborum praesentium ab
                      recusandae deleniti cumque est libero repudiandae eveniet
                      ipsum ratione cupiditate dignissimos obcaecati placeat
                      dolore suscipit, quasi accusamus nesciunt ex quidem neque?
                      Ipsam?
                    </div>
                  </div>
                  {/* Image */}
                  <div className="col-span-4">
                    <div className="h-full w-full transform rounded-xl bg-gray-300 transition duration-300 hover:scale-105 hover:shadow-xl"></div>
                  </div>
                </div>
                {/* tags */}
                <div>
                  <div className="flex items-center justify-start space-x-4">
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="rounded-2xl bg-gray-200/50 px-5 py-3"
                        >
                          tag {i}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
        {/* sidebar section */}
        <aside className="col-span-4 flex-col space-y-4 p-6 lg:flex">
          {/* Reccomendation list */}
          <div>
            <h3 className="my-6 text-lg font-semibold">
              People you might be interested
            </h3>
            <div className="flex flex-col space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-row items-center space-x-5">
                  {/* icon */}
                  <div className="h-10 w-10 flex-none rounded-full bg-gray-300"></div>
                  <div>
                    {/* title and description */}
                    <div className="text-sm font-bold text-gray-900">
                      Lorem ipsum
                    </div>
                    <div className="break-words text-xs">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Repudiandae quam consequatur non eum nam. Repellendus
                      aliquid distinctio molestias totam, nemo velit minima,
                      quas doloribus unde tempora numquam temporibus veritatis
                      libero!
                    </div>
                  </div>
                  <div>
                    <button
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
          {/* stickyで固定 */}
          {/* <div className="sticky top-10"> */}
          <div>
            <h3 className="my-6 text-lg font-semibold">Your reading list</h3>
            <div className="flex flex-col space-y-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="group flex items-center space-x-6">
                  {/* Thumnail */}
                  <div className="aspect-square h-full w-2/5 rounded-xl bg-gray-300"></div>
                  {/* Title and description */}
                  <div className="flex w-3/5 flex-col space-y-2">
                    <div className="text-lg font-semibold decoration-black group-hover:underline">
                      Lorem ipsum dolor sit amet consectetur.
                    </div>
                    <div>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Itaque officiis quidem laborum vitae provident?
                    </div>
                    {/* Author */}
                    <div className="flex w-full items-center space-x-4">
                      {/* icon */}
                      <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                      <div>Saruban157 &#x2022;</div>
                      <div> 17 May. 2023</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default HomePage
