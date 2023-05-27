import React, { useState } from 'react'
import MainLayout from '../../layouts/MainLayout'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'
import { BiEdit } from 'react-icons/bi'
import { SlShareAlt } from 'react-icons/sl'
import { toast } from 'react-hot-toast'
import classNames from 'classnames'
import Post from '../../components/Post'
import { useSession } from 'next-auth/react'

const UserProfilePage = () => {
  const router = useRouter()

  const currentUser = useSession()

  const userProfile = trpc.user.getUserProfile.useQuery(
    {
      username: router.query.username as string,
    },
    {
      enabled: !!router.query.username,
    }
  )

  const userPosts = trpc.user.getUserPosts.useQuery(
    {
      username: router.query.username as string,
    },
    {
      enabled: !!router.query.username,
    }
  )

  const [objectImage, setObjectImage] = useState('')
  // const [file, setFile] = useState<File | null>(null)

  const userRoute = trpc.useContext().user

  const uploadAvatar = trpc.user.uploadAvatar.useMutation({
    onSuccess: () => {
      if (userProfile.data?.username) {
        userRoute.getUserProfile.invalidate({
          username: userProfile.data?.username as string,
        })
        toast.success('Avatar updated!')
      }
    },
  })

  const defaultButtonStyle =
    'flex items-center space-x-3 rounded border border-gray-200 px-4 py-2.5 transition hover:border-gray-900'

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && userProfile.data?.username) {
      const file = e.target.files[0]

      if (file.size > 1.5 * 1000000) {
        return toast.error('Images size should not be greater than 1MB')
      }

      setObjectImage(URL.createObjectURL(file))

      const fileReader = new FileReader()

      fileReader.readAsDataURL(file)

      fileReader.onloadend = () => {
        if (fileReader.result && userProfile.data?.username) {
          uploadAvatar.mutate({
            imageAsDataUrl: fileReader.result as string,
            username: userProfile.data?.username,
          })
        }
      }
    }
  }

  return (
    <MainLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="my-10 flex h-full w-full flex-col items-center justify-center lg:max-w-screen-md xl:max-w-screen-lg">
          {/* Head part */}
          <div className="flex w-full flex-col rounded-3xl bg-white shadow-md">
            <div className="relative h-44 w-full rounded-t-3xl bg-gradient-to-r from-rose-100 to-teal-100">
              {/* Avatar icon */}
              <div className="absolute -bottom-10 left-12">
                {/* animation mouse hover*/}
                <div className="group relative h-28 w-28 cursor-pointer rounded-full border-2 border-white bg-gray-100">
                  {/* Select file button */}
                  {currentUser.data?.user?.id === userProfile.data?.id && (
                    <label
                      htmlFor="avatarFile"
                      className="absolute z-10 flex h-full w-full items-center justify-center rounded-full transition duration-500 group-hover:bg-black/20"
                    >
                      <BiEdit className="hidden text-3xl text-white group-hover:block" />
                      <input
                        type="file"
                        name="avatarFile"
                        id="avatarFile"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleChangeImage}
                        multiple={false}
                      />
                    </label>
                  )}
                  {/* <Avatar src={''} alt={''} /> */}
                  {!objectImage && userProfile.data?.image && (
                    <Image
                      src={userProfile.data?.image}
                      alt={userProfile.data?.name ?? ''}
                      fill
                      className="rounded-full"
                    />
                  )}
                  {objectImage && (
                    <Image
                      src={objectImage}
                      alt={userProfile.data?.name ?? ''}
                      fill
                      className="rounded-full"
                    />
                  )}
                </div>
              </div>
            </div>
            {/* Under part */}
            <div className="ml-12 mt-10 flex flex-col space-y-0.5 rounded-b-3xl py-4">
              <div className="text-2xl font-semibold text-gray-800">
                {userProfile.data?.name}
              </div>
              <div>@{userProfile.data?.username}</div>
              <div>{userProfile.data?._count.posts ?? 0} Posts</div>
              {/* Share button */}
              <div>
                <button
                  onClick={() => {
                    // navigator.clipboard⇒クリップボードにコピー
                    navigator.clipboard.writeText(window.location.href)
                    toast.success('URL copied to clipboard')
                  }}
                  className={classNames(
                    defaultButtonStyle,
                    'mt-2 transform rounded pb-2 pt-2 active:scale-95'
                  )}
                >
                  <div>Share</div>
                  <SlShareAlt />
                </button>
              </div>
            </div>
          </div>
          <div className="my-10 w-full">
            {userPosts.isSuccess &&
              userPosts.data?.posts.map((user) => (
                <Post {...user} key={user.id} />
              ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default UserProfilePage
