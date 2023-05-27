import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useDebounce from '../../hooks/useDebounce'
import { trpc } from '../../utils/trpc'
import Modal from '../../components/Modal'
import Image from 'next/image'
import { BiLoaderAlt } from 'react-icons/bi'
import { toast } from 'react-hot-toast'
import classNames from 'classnames'

export const unsplashSearchRouteSchema = z.object({
  searchQuery: z.string().min(2),
})

type UnsplashGalleryProps = {
  isUnsplashModalOpen: boolean
  setIsUnsplashModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  postId: string
  slug: string
}

const UnsplashGallery = ({
  isUnsplashModalOpen,
  setIsUnsplashModalOpen,
  postId,
  slug,
}: UnsplashGalleryProps) => {
  const { register, watch, reset } = useForm<{ searchQuery: string }>({
    resolver: zodResolver(unsplashSearchRouteSchema),
  })

  const watchSearchQuery = watch('searchQuery')
  const debouncedSearchQuery = useDebounce(watchSearchQuery, 3000)

  const [selectedImage, setSelectedImage] = useState('')

  const fetchUnsplashImages = trpc.unsplash.getImages.useQuery(
    {
      searchQuery: debouncedSearchQuery,
    },
    {
      enabled: Boolean(debouncedSearchQuery),
    }
  )

  const utils = trpc.useContext()

  const updateFeaturedImage = trpc.post.updatePostFeatureImage.useMutation({
    onSuccess: () => {
      utils.post.getPost.invalidate({ slug })
      reset()
      setIsUnsplashModalOpen(false)
      toast.success('Featured image updated')
    },
  })

  const inputFormStyle =
    'h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600'
  const defaultButtonStyle =
    'flex items-center space-x-3 rounded border border-gray-200 px-4 py-2.5 transition hover:border-gray-900'

  return (
    <Modal
      isOpen={isUnsplashModalOpen}
      onClose={() => setIsUnsplashModalOpen(false)}
    >
      {/* Unsplash search form */}
      <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
        <input
          type="text"
          id="search"
          {...register('searchQuery')}
          className={classNames(inputFormStyle, '')}
        />
        {/* Loading */}
        {debouncedSearchQuery && fetchUnsplashImages.isLoading && (
          <div className="flex h-full w-full items-center justify-center">
            <BiLoaderAlt className="animate-spin" />
          </div>
        )}
        <div className="relative grid h-96 w-full grid-cols-3 place-items-center gap-4 overflow-y-scroll">
          {/* Gallery */}
          {fetchUnsplashImages.isSuccess &&
            fetchUnsplashImages.data?.results.map((imageData) => (
              <div
                key={imageData.id}
                className="group relative aspect-video h-full w-full cursor-pointer"
                onClick={() => setSelectedImage(imageData.urls.full)}
              >
                <div
                  className={`absolute group-hover:bg-black/40 ${
                    selectedImage === imageData.urls.full && 'bg-black/40'
                  } inset-0 z-10 h-full w-full`}
                />
                <Image
                  src={imageData.urls.thumb}
                  alt={imageData.alt_description ?? ''}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
        </div>
        {selectedImage && (
          <button
            type="submit"
            className={classNames(defaultButtonStyle, '')}
            onClick={() => {
              updateFeaturedImage.mutate({
                imageUrl: selectedImage,
                postId,
              })
            }}
            disabled={updateFeaturedImage.isLoading}
          >
            {updateFeaturedImage.isLoading ? 'Loading...' : 'Confirm'}
          </button>
        )}
      </div>
    </Modal>
  )
}

export default UnsplashGallery
