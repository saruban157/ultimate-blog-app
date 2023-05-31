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
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { username } }) => {
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
              followedBy: true,
              followings: true,
            },
          },
          followedBy: session?.user?.id
            ? {
                where: {
                  id: session.user.id,
                },
              }
            : false,
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
              featuredImage: true,
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

  getSuggestions: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      // const likes = await prisma.like.findMany({
      //   where: {
      //     userId: session.user.id,
      //   },
      //   select: {
      //     post: {
      //       select: {
      //         tags: {
      //           select: {
      //             name: true,
      //           },
      //         },
      //       },
      //     },
      //   },
      //   take: 10,
      // })

      const tagsQuery = {
        where: {
          userId: session.user.id,
        },
        select: {
          post: {
            select: {
              tags: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        take: 10,
      }

      const likedPostTags = await prisma.like.findMany(tagsQuery)
      const bookmarkedPostTags = await prisma.bookmark.findMany(tagsQuery)

      const interestedTags: string[] = []

      likedPostTags.forEach((like) => {
        interestedTags.push(...like.post.tags.map((tag) => tag.name))
      })

      bookmarkedPostTags.forEach((bookmark) => {
        interestedTags.push(...bookmark.post.tags.map((tag) => tag.name))
      })

      const suggestions = await prisma.user.findMany({
        where: {
          OR: [
            {
              likes: {
                some: {
                  post: {
                    tags: {
                      some: {
                        name: {
                          in: interestedTags,
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              bookmarks: {
                some: {
                  post: {
                    tags: {
                      some: {
                        name: {
                          in: interestedTags,
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
          NOT: {
            id: session.user.id,
          },
        },
        select: {
          name: true,
          image: true,
          username: true,
          id: true,
        },
        take: 4,
      })

      return suggestions
    }
  ),

  followUser: protectedProcedure
    .input(
      z.object({
        followingUserId: z.string(),
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { followingUserId } }) => {
        if (followingUserId === session.user.id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "You can't follow yourself",
          })
        }

        await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            followings: {
              connect: {
                id: followingUserId,
              },
            },
          },
        })
      }
    ),

  unfollowUser: protectedProcedure
    .input(
      z.object({
        followingUserId: z.string(),
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { followingUserId } }) => {
        await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            followings: {
              disconnect: {
                id: followingUserId,
              },
            },
          },
        })
      }
    ),
  getAllFollowers: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { userId } }) => {
      return await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          followedBy: {
            select: {
              name: true,
              username: true,
              id: true,
              image: true,
              followedBy: {
                where: {
                  id: session.user.id,
                },
              },
            },
          },
        },
      })
    }),
  getAllFollowing: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx: { prisma }, input: { userId } }) => {
      return await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          followings: {
            select: {
              name: true,
              username: true,
              id: true,
              image: true,
            },
          },
        },
      })
    }),
})
