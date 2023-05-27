import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

import { createApi } from 'unsplash-js'
import { env } from '../../../env/server.mjs'
import { TRPCError } from '@trpc/server'

const unsplash = createApi({
  accessKey: env.UNSPLASH_API_ACCESS_KEY,
})

export const unsplashSearchRouteSchema = z.object({
  searchQuery: z.string().min(2),
})

export const unsplashRouter = router({
  getImages: protectedProcedure
    .input(unsplashSearchRouteSchema)
    .query(async ({ input: { searchQuery } }) => {
      try {
        const imagesData = await unsplash.search.getPhotos({
          query: searchQuery,
          // landspace⇒風景
          orientation: 'landscape',
          orderBy: 'relevant',
        })

        return imagesData.response
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unsplash api not working',
        })
      }
    }),
})
