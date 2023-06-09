import React, { useContext } from 'react'
import { IoReorderThreeOutline } from 'react-icons/io5'
import { BsBell } from 'react-icons/bs'
import { FiEdit, FiLogOut } from 'react-icons/fi'
import classNames from 'classnames'
import { signIn, useSession, signOut } from 'next-auth/react'
import { GlobalContext } from '../../contexts/GlobalContextProvider'
import Link from 'next/link'
import Image from 'next/image'

const Header = () => {
  const defaultButtonStyle =
    'flex items-center space-x-3 rounded border border-gray-200 px-4 py-2.5 transition hover:border-gray-900'

  const currentUser = useSession()

  const { setIsWriteModalOpen } = useContext(GlobalContext)

  return (
    <header className="flex h-20 w-full flex-row items-center justify-around border-b-[1px] border-gray-200 bg-white">
      {/* header left */}
      <div>
        <IoReorderThreeOutline className="text-2xl text-gray-600" />
      </div>
      {/* header center */}
      <Link href={'/'} className="cursor-pointer select-none text-xl font-thin">
        Ultimate Blog App
      </Link>
      {/* header right */}
      {currentUser.status === 'authenticated' ? (
        <div className="flex items-center space-x-4">
          <div>
            <BsBell className="text-2xl" />
          </div>
          {/* account */}
          <div>
            <div className="group relative h-5 w-5 rounded-full border-2 border-white bg-gray-100">
              {currentUser.data?.user?.image ? (
                <Image
                  src={currentUser.data?.user?.image}
                  alt={currentUser.data?.user.name ?? ''}
                  className="h-full w-full rounded-full"
                  fill
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-gray-600" />
              )}
            </div>
          </div>
          {/* new post button */}
          <div>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className={classNames(defaultButtonStyle, '')}
            >
              <div>Wtite</div>
              <FiEdit className="text-gray-600" />
            </button>
          </div>
          {/* Logout button */}
          <div>
            <button
              onClick={() => signOut()}
              className={classNames(defaultButtonStyle, '')}
            >
              <div>Logout</div>
              <div>
                <FiLogOut className="text-gray-600" />
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => signIn()}
            className={classNames(defaultButtonStyle, '')}
          >
            Signin
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
