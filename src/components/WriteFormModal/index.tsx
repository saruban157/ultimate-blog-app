import React, { useContext } from 'react'
import { GlobalContext } from '../../contexts/GlobalContextProvider'
import Modal from '../Modal'
import classNames from 'classnames'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type WriteFormType = {
  title: string
  description: string
  body: string
}

const writeFormSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  body: z.string().min(20),
})

const WriteFormModal = () => {
  const inputFormStyle =
    'h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600'
  const defaultButtonStyle =
    'flex items-center space-x-3 rounded border border-gray-200 px-4 py-2.5 transition hover:border-gray-900'

  const { isWriteModalOpen, setIsWriteModalOpen } = useContext(GlobalContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WriteFormType>({
    resolver: zodResolver(writeFormSchema),
  })

  // publish button component
  const onSubmit = (data: WriteFormType) => console.log(data)

  return (
    <Modal isOpen={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center space-y-4"
      >
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
          {...register('description')}
          id="shortDescription"
          className={classNames(inputFormStyle, '')}
          placeholder="Description"
        />
        <p className="w-full pb-2 text-left text-sm text-red-500">
          {errors.description?.message}
        </p>

        <textarea
          {...register('body')}
          id="mainBody"
          cols={10}
          rows={10}
          className={classNames(inputFormStyle, '')}
          placeholder="Content"
        />
        <p className="w-full pb-2 text-left text-sm text-red-500">
          {errors.body?.message}
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
  )
}

export default WriteFormModal
