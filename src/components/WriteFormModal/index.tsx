import React, { useContext, useState } from 'react'
import { GlobalContext } from '../../contexts/GlobalContextProvider'
import Modal from '../Modal'
import classNames from 'classnames'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '../../utils/trpc'
import { toast } from 'react-hot-toast'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import TagsAutoCompletion from '../TagsAutoCompletion'
import TagForm from '../TagForm'
import { FaTimes } from 'react-icons/fa'

export type TAG = { id: string; name: string }

type WriteFormType = {
  title: string
  description: string
  text: string
  slug: string
}

export const writeFormSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  text: z.string().min(20),
  slug: z.string().min(5),
})

const inputFormStyle =
  'h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600'
const defaultButtonStyle =
  'flex items-center space-x-3 rounded border border-gray-200 px-4 py-2.5 transition hover:border-gray-900'

const WriteFormModal = () => {
  const { isWriteModalOpen, setIsWriteModalOpen } = useContext(GlobalContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WriteFormType>({
    resolver: zodResolver(writeFormSchema),
  })

  const postRoute = trpc.useContext().post

  const createPost = trpc.post.createPost.useMutation({
    onSuccess: () => {
      toast.success('Post created successfully !')
      setIsWriteModalOpen(false)
      reset()
      postRoute.getPosts.invalidate()
    },
  })

  const [selectedTags, setSelectedTags] = useState<TAG[]>([])

  // publish button
  const onSubmit = (data: WriteFormType) => {
    createPost.mutate(
      selectedTags.length > 0 ? { ...data, tagsIds: selectedTags } : data
    )
  }

  const [isTagCreateModalOpen, setIsTagCreateModalOpen] = useState(false)

  const getTags = trpc.tag.getTags.useQuery()

  return (
    <>
      {/* Create Tag button */}

      <Modal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
      >
        {getTags.isSuccess && (
          <>
            <TagForm
              isOpen={isTagCreateModalOpen}
              onClose={() => setIsTagCreateModalOpen(false)}
            />
            {/* Combo Box */}
            <div className="my-4 flex w-full items-center space-x-4">
              <div className="z-10 w-4/5">
                <TagsAutoCompletion
                  tags={getTags.data}
                  setSelectedTags={setSelectedTags}
                  selectedTags={selectedTags}
                />
              </div>
              <button
                onClick={() => setIsTagCreateModalOpen(true)}
                className={classNames(
                  defaultButtonStyle,
                  'whitespace-nowrap rounded-lg pb-2 pt-2'
                )}
              >
                Create Tag
              </button>
            </div>
            <div className="my-4 flex w-full flex-wrap items-center">
              {selectedTags.map((tag) => (
                <div
                  key={tag.id}
                  className="m-2 flex items-center justify-center space-x-2 whitespace-nowrap rounded-2xl bg-gray-200/50 px-5 py-3"
                >
                  <div>{tag.name}</div>
                  <div
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.filter((currTag) => currTag.id !== tag.id)
                      )
                    }
                    className="cursor-pointer"
                  >
                    <FaTimes />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <form
          onSubmit={handleSubmit((data) => {
            console.log(data)
            onSubmit(data)
          })}
          className="relative flex flex-col items-center justify-center space-y-4"
        >
          {createPost.isLoading && (
            <div className="absolute flex h-full w-full items-center justify-center">
              <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
          )}
          <input
            type="text"
            id="title"
            // className="h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600"
            className={classNames(inputFormStyle, '')}
            placeholder="Title"
            {...register('title')}
          />
          <p className="w-full pb-2 text-left text-sm text-red-500">
            {errors.title?.message}
          </p>
          <input
            type="text"
            id="slug"
            className={classNames(inputFormStyle, '')}
            placeholder="Slug"
            {...register('slug')}
          />
          <p className="w-full pb-2 text-left text-sm text-red-500">
            {errors.slug?.message}
          </p>
          <input
            type="text"
            {...register('description')}
            id="shortDescription"
            className={classNames(inputFormStyle, '')}
            placeholder="Description"
          />
          <p className="w-full pb-2 text-left text-sm text-red-500">
            {errors.description?.message}
          </p>

          <textarea
            {...register('text')}
            id="mainBody"
            cols={10}
            rows={10}
            className={classNames(inputFormStyle, '')}
            placeholder="Content"
          />
          <p className="w-full pb-2 text-left text-sm text-red-500">
            {errors.text?.message}
          </p>
          <div className="flex w-full justify-end">
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className={classNames(defaultButtonStyle, '')}
            >
              Publish
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default WriteFormModal
