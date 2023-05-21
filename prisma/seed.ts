import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // create fake users
  const fakeArray = Array.from({ length: 50 }).map((_, idx) => idx)
  console.log('seeding the db!')

  for await (const i of fakeArray) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        image: faker.internet.avatar(),
      },
    })

    const postsFakeArray = Array.from({
      length: faker.number.int({ max: 20, min: 5 }),
    }).map((_, idx) => idx)

    for await (const iterator of postsFakeArray) {
      await prisma.post.create({
        data: {
          title: faker.lorem.words(10),
          description: faker.lorem.lines(4),
          text: faker.lorem.paragraphs(5),
          html: faker.lorem.paragraphs(5),
          slug: faker.lorem.slug(),
          author: {
            connect: {
              id: user.id,
            },
          },
          featuredImage: faker.image.url(),
          tags: {
            connectOrCreate: {
              create: {
                name: faker.lorem.words() + faker.word.sample(),
                description: faker.lorem.paragraph(1),
                slug: faker.lorem.slug(),
              },
              where: {
                id: faker.string.uuid(),
              },
            },
          },
        },
      })
    }
  }

  console.log('seed completed!')
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
