import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'
import isDataURI from 'validator/lib/isDataURI'

import { decode } from 'base64-arraybuffer'
import { createClient } from '@supabase/supabase-js'
import { env } from '../../../env/server.mjs'
import { TRPCError } from '@trpc/server'

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY
)

export const userRouter = router({
  // Get User Profile
  getUserProfile: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx: { prisma }, input: { username } }) => {
      return await prisma.user.findUnique({
        where: {
          username: username,
        },
        select: {
          name: true,
          image: true,
          id: true,
          username: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
      })
    }),
  // Get User Posts
  getUserPosts: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { username } }) => {
      return await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          posts: {
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              createdAt: true,
              author: {
                select: {
                  name: true,
                  image: true,
                  username: true,
                },
              },
              bookmarks: session?.user?.id
                ? {
                    where: {
                      userId: session?.user?.id,
                    },
                  }
                : false,
              tags: {
                select: {
                  name: true,
                  id: true,
                  slug: true,
                },
              },
            },
          },
        },
      })
    }),

  uploadAvatar: protectedProcedure
    .input(
      z.object({
        imageAsDataUrl: z.string().refine((val) => isDataURI(val)),
        username: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      const imageBase64Str = input.imageAsDataUrl.replace(/^.+,/, '')

      const { data, error } = await supabase.storage
        .from('public')
        .upload(`avatars/${input.username}.png`, decode(imageBase64Str), {
          contentType: 'image/png',
          // upsert⇒insert + update
          upsert: true,
        })
      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Upload failed to supabase',
        })
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from('public').getPublicUrl(data?.path)

      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          image: publicUrl,
        },
      })
    }),
})
