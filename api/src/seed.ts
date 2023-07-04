import prisma from "./database.js";
import { uuid } from "./utils/strings.js";

const user = (id: number) => ({
  uuid: uuid(),
  username: `test_user_${id}`,
  displayName: `TestUser${id}`,
  email: `testuser${id}@kakaposocial.com`,
  registeredAt: new Date(),
});

const now = () => new Date();

for (let i = 1; i < 100; i++) {
  console.log(`Creating user ${i}`);
  await prisma.user.create({ data: user(i) });
}

await prisma.friendship.create({
  data: {
    user1Id: 1,
    user2Id: 2,
    becameFriendsAt: now(),
  },
});

await prisma.friendRequest.create({
  data: {
    uuid: uuid(),
    userFromId: 1,
    userToId: 3,
    sentAt: now(),
  },
});

await prisma.post.create({
  data: {
    uuid: uuid(),
    caption: "Hello world! Post 1",
    postedAt: now(),
    authorId: 1,
  },
});

await prisma.post.create({
  data: {
    uuid: uuid(),
    caption: "Hello world! Post 2",
    postedAt: now(),
    authorId: 2,
  },
});

await prisma.comment.create({
  data: {
    uuid: uuid(),
    postId: 1,
    authorId: 1,
    text: "Hello World!",
    postedAt: now(),
  },
});

for (let i = 1; i < 20; i++) {
  await prisma.postLike.create({
    data: {
      postId: 1,
      userId: i,
      likedAt: now(),
    },
  });

  if (i < 10) {
    await prisma.postLike.create({
      data: {
        postId: 2,
        userId: i,
        likedAt: now(),
      },
    });
  }
}
