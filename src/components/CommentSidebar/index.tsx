import React, { Fragment } from 'react'
import { HiX } from 'react-icons/hi'
import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '../../utils/trpc'
import { toast } from 'react-hot-toast'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(RelativeTime)

type CommentSidebarProps = {
  showCommentSidebar: boolean
  setShowCommentSidebar: React.Dispatch<React.SetStateAction<boolean>>
  postId: string
}

type CommentFormType = { text: string }

export const commentFormSchema = z.object({
  text: z.string().min(3),
})

const CommentSidebar = ({
  showCommentSidebar,
  setShowCommentSidebar,
  postId,
}: CommentSidebarProps) => {
  const inputFormStyle =
    'h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600'
  const defaultButtonStyle =
    'flex items-center space-x-3 rounded border border-gray-200 px-4 py-2.5 transition hover:border-gray-900'

  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<CommentFormType>({
    resolver: zodResolver(commentFormSchema),
  })

  const postRoute = trpc.useContext().post

  const submitComment = trpc.post.submitComment.useMutation({
    onSuccess: () => {
      toast.success('OK!')
      postRoute.getComments.invalidate({
        postId,
      })
      reset()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const getComments = trpc.post.getComments.useQuery({ postId })

  return (
    <Transition.Root show={showCommentSidebar} as={Fragment}>
      <Dialog as="div" onClose={() => setShowCommentSidebar(false)}>
        <div className="fixed right-0 top-0">
          <Transition.Child
            enter="transition duration-1000"
            leave="transition duration-500"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative h-screen w-[200px] bg-white shadow-md sm:w-[400px]">
              <div className="flex h-full w-full flex-col overflow-scroll px-6">
                {/* Dialog header */}
                <div className="mb-5 mt-10 flex items-center justify-between space-y-6 px-6 text-xl">
                  <h2 className="font-medium">Responses (4)</h2>
                  <div>
                    <HiX
                      className="cursor-pointer"
                      onClick={() => setShowCommentSidebar(false)}
                    />
                  </div>
                </div>
                {/* Comment form */}
                <div>
                  <form
                    onSubmit={handleSubmit((data) => {
                      submitComment.mutate({
                        ...data,
                        postId,
                      })
                    })}
                    className="my-6 flex flex-col items-end space-y-5"
                  >
                    <textarea
                      id="comment"
                      rows={3}
                      className={classNames(inputFormStyle, 'shadow-lg')}
                      placeholder="Comment"
                      {...register('text')}
                    />
                    {/* <p className="w-full pb-2 text-left text-sm text-red-500">
                    {errors.text?.message}
                  </p> */}
                    {isValid && (
                      <button
                        type="submit"
                        className={classNames(defaultButtonStyle, '')}
                      >
                        Comment
                      </button>
                    )}
                  </form>
                  {/* Comment posts */}
                  <div className="flex flex-col items-center justify-center space-y-4">
                    {getComments.isSuccess &&
                      getComments.data?.map((comment) => (
                        <div
                          className="flex h-full w-full flex-col space-y-2 border-b border-b-gray-500 pb-4 last:border-none"
                          key={comment.id}
                        >
                          <div className="flex w-full items-center space-x-2 text-xs">
                            {/* comment post icon */}
                            <div className="relative h-8 w-8 rounded-full bg-gray-400">
                              {/* {postRoute.author.image && (
                            <Image
                              src={postRoute.author.image}
                              fill
                              alt={postRoute.author.name ?? ''}
                              className="rounded-full"
                            />
                          )} */}
                            </div>
                            <div>
                              <p className="font-semibold">
                                {comment.user.name}
                              </p>
                              <p>{dayjs(comment.createdAt).fromNow()}</p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {comment.text}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default CommentSidebar
