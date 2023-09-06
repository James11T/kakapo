interface User {
  uuid: string;
  username: string;
  displayName: string;
  avatar: string;
  about: string;
  registeredAt: Date;
}

interface Media {
  uuid: string;
  url: string;
  type: string;
  index: number;
  restricted: boolean;
  blocked: boolean;
}

interface Post {
  uuid: string;
  caption: string;
  postedAt: Date;
  processed: boolean;
  edited: boolean;
  liked: boolean;
  saved: boolean;

  author: User;
  media: Media[];
  likeCount: number;
  commentCount: number;
}

interface UserPreference {
  accountPrivacy: "PRIVATE" | "PUBLIC";
  messagePrivacy: "MUTUALS" | "FOLLOWED" | "FOLLOWERS" | "OPEN";
  dateOfBirth: number;
  sex: "MALE" | "FEMALE" | "OTHER";
  theme: "light" | "dark" | "luxury" | "automatic";
}

type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type PickKeysOfType<T, U> = {
  [K in KeysOfType<T, U>]: T[K];
};

export type { User, Media, Post, UserPreference, KeysOfType, PickKeysOfType };
