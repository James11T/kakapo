import {
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
} from "aws-lambda";
import { getAssertiveEnv } from "../utils/get-env";
import fetch from "node-fetch";

const { TENOR_API_KEY, TENOR_CLIENT_KEY } = getAssertiveEnv(
  "TENOR_API_KEY",
  "TENOR_CLIENT_KEY"
);

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

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters || !event.pathParameters["q"]) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing query parameter" }),
    };
  }

  const searchTerm = encodeURIComponent(event.pathParameters["q"]);

  const response = await fetch(
    `https://tenor.googleapis.com/v2/search?q=${searchTerm}&key=${TENOR_API_KEY}&client_key=${TENOR_CLIENT_KEY}&limit=30`
  );

  if (response.status !== 200) {
    console.error(await response.text());
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to search GIFs" }),
    };
  }

  const data = (await response.json()) as TenorResponse;

  return { statusCode: response.status, body: JSON.stringify(data.results) };
};
