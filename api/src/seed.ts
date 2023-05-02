import prisma from "./database";
import { v4 as uuid } from "uuid";

const user = (id: number) => ({
  uuid: uuid(),
  username: `test_user_${id}`,
  displayName: `TestUser${id}`,
  email: `testuser${id}@kakaposocial.com`,
  registeredAt: new Date(),
  passwordHash:
    "$argon2id$v=19$m=65536,t=3,p=4$1sn97CY19hV9ftWoitt9tA$buBbxSxOgjdORrwp8zRM2IDJ4GZt1JjHhfB+rdcHY3Y",
});

const now = () => new Date();

for (let i = 1; i < 5; i++) {
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
    userFromId: 1,
    userToId: 3,
    sentAt: now(),
  },
});

await prisma.post.create({
  data: {
    uuid: uuid(),
    caption: "Hello world!",
    postedAt: now(),
    authorId: 1,
  },
});
