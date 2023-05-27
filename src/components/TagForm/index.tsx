import React from 'react'
import Modal from '../Modal'
import { toast } from 'react-hot-toast'
import { trpc } from '../../utils/trpc'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import classNames from 'classnames'
import { z } from 'zod'

export const tagCreateSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
})

type TagFormProps = {
  isOpen: boolean
  onClose: () => void
}

const inputFormStyle =
  'h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600'
const defaultButtonStyle =
  'flex items-center space-x-3 rounded border border-gray-200 px-4 py-2.5 transition hover:border-gray-900'

const TagForm = ({ isOpen, onClose }: TagFormProps) => {
  // TagForm関係
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    name: string
    description: string
  }>({
    resolver: zodResolver(tagCreateSchema),
  })

  const tagRouter = trpc.useContext().tag

  const createTag = trpc.tag.createTag.useMutation({
    onSuccess: () => {
      toast.success('Tag successfully created')
      reset()
      onClose()
      tagRouter.getTags.invalidate()
    },
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a tag">
      {/* Create Tag Form */}
      <form
        onSubmit={handleSubmit((data) => createTag.mutate(data))}
        className="relative flex flex-col items-center justify-center space-y-4"
      >
        <input
          type="text"
          id="name"
          className={classNames(inputFormStyle, '')}
          placeholder="Name of the tag"
          {...register('name')}
        />
        <p className="w-full pb-2 text-left text-sm text-red-500">
          {errors.name?.message}
        </p>
        <input
          type="text"
          id="description"
          className={classNames(inputFormStyle, '')}
          placeholder="Description"
          {...register('description')}
        />
        <p className="w-full pb-2 text-left text-sm text-red-500">
          {errors.description?.message}
        </p>
        <div className="flex w-full justify-end">
          <button className={classNames(defaultButtonStyle, '')} type="submit">
            Create
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default TagForm
