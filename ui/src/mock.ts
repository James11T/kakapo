import { Post, User } from "./types";

const users: Record<string, User> = {
  james: {
    uuid: "cdc9741f-14e9-4772-b6ac-0cd50df9de7b",
    username: "james",
    displayName: "James",
    avatar: "logo_grey.svg",
    about: "Im james",
    registeredAt: new Date(1688419564000),
  },
  will: {
    uuid: "cdc9741f-14e9-4772-b6ac-0cd50df9de7c",
    username: "will",
    displayName: "William",
    avatar: "test/claudette.png",
    about: "Im will",
    registeredAt: new Date(1688419564000),
  },
} as const;

const posts: Post[] = [
  {
    uuid: "cdc9741f-14e9-4772-b6ac-0cd50df9de7j",
    caption:
      "check out this S.W.A.G #selfie i just took, dont i just look the best. #slay #bestie #morelife #blackqueen",
    postedAt: new Date(1688619564000),
    processed: true,
    edited: true,
    author: users.will,
    liked: true,
    saved: false,
    media: [
      {
        uuid: "cdc9741f-14e9-4772-b6ac-0cd50df9de7d",
        url: "test/claudette.png",
        type: "image",
        index: 1,
        restricted: false,
        blocked: false,
      },
    ],
    likeCount: 6,
    commentCount: 1,
  },
  {
    uuid: "cdc9741f-14e9-4772-b6ac-0cd50df9de7h",
    caption: "big up @lily and @toffee #cats",
    postedAt: new Date(1688619564000),
    processed: true,
    edited: true,
    author: users.james,
    liked: true,
    saved: true,
    media: [
      {
        uuid: "cdc9741f-14e9-4772-b6ac-0cd50df9de7x",
        url: "test/lily.jpg",
        type: "image",
        index: 1,
        restricted: false,
        blocked: false,
      },
      {
        uuid: "cdc9741f-14e9-4772-b6ac-0cd50df9de7z",
        url: "test/toffee.png",
        type: "image",
        index: 1,
        restricted: false,
        blocked: false,
      },
    ],
    likeCount: 60,
    commentCount: 11,
  },
];

export { users, posts };
