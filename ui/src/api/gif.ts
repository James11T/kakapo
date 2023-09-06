import { GIF, GIFResponse } from "../types";
import APIFetch from "./base";

const { VITE_GIF_API_URL } = import.meta.env;

const GIFResponseResultToGIF = (gif: GIFResponse[number]): GIF => ({
  id: gif.id,
  name: gif.title,
  MP4: gif.media_formats.mp4.url,
  GIF: gif.media_formats.gif.url,
  previewMP4: gif.media_formats.tinymp4.url,
  previewGIF: gif.media_formats.gifpreview.url,
  width: gif.media_formats.mp4.dims[0],
  height: gif.media_formats.mp4.dims[1],
});

const searchGIFs = (query: string) =>
  APIFetch.get<GIFResponse>(`${VITE_GIF_API_URL}/${query}`, {
    credentials: undefined,
  }).then((data) => data.map(GIFResponseResultToGIF));

export { searchGIFs, GIFResponseResultToGIF };
