interface MediaFormat {
  url: string;
  duration: number;
  preview: string;
  dims: [number, number];
  size: number;
}

interface TenorResponse {
  next: string;
  results: {
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
}

export type { MediaFormat, TenorResponse };
