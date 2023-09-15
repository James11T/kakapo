interface User {
  uuid: string;
  username: string;
  displayName: string;
  avatar?: string;
  about: string;
  registeredAt: Date;
}

interface Message {
  author: User;
  content: string;
  sentAt: Date;
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

type KeysOfType<TObject, TType> = {
  [TKey in keyof TObject]: TObject[TKey] extends TType ? TKey : never;
}[keyof TObject];

type PickKeysOfType<TObject, TType> = {
  [TKey in KeysOfType<TObject, TType>]: TObject[TKey];
};

interface MediaFormat {
  url: string;
  duration: number;
  preview: string;
  dims: [number, number];
  size: number;
}

type GIFResponse = {
  id: string;
  title: string;
  media_formats: {
    gif: MediaFormat;
    tinygifpreview: MediaFormat;
    gifpreview: MediaFormat;
    nanogifpreview: MediaFormat;
    tinygif: MediaFormat;
    nanaomp4: MediaFormat;
    tinywebm: MediaFormat;
    tinymp4: MediaFormat;
    mediumgif: MediaFormat;
    nanogif: MediaFormat;
    webm: MediaFormat;
    mp4: MediaFormat;
    nanowebm: MediaFormat;
    loopedmp4: MediaFormat;
  };
  created: number;
  content_description: string;
  itemurl: string;
  url: string;
  tags: string[];
  flags: string[];
  hasaudio: boolean;
}[];

interface GIF {
  id: string;
  MP4: string;
  GIF: string;
  previewMP4: string;
  previewGIF: string;
  name: string;
  width: number;
  height: number;
}

type Size = "sm" | "md" | "lg" | "xl";

export type {
  User,
  Message,
  Media,
  Post,
  UserPreference,
  KeysOfType,
  PickKeysOfType,
  GIFResponse,
  GIF,
  Size,
};
