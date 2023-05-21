import React from 'react'
import classNames from 'classnames'

const SideSection = () => {
  const defaultButtonStyle =
    'flex items-center space-x-3 rounded border border-gray-200 px-4 py-2.5 transition hover:border-gray-900'

  return (
    <aside className="hidden flex-col space-y-4 p-6 lg:col-span-4 lg:flex ">
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
                  Repudiandae quam consequatur non eum nam. Repellendus aliquid
                  distinctio molestias totam, nemo velit minima, quas doloribus
                  unde tempora numquam temporibus veritatis libero!
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
  )
}

export default SideSection
