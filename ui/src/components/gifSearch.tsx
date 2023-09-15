import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/outline";
import { GIF } from "../types";
import { Virtuoso } from "react-virtuoso";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { addFavorite, removeFavorite } from "../reducers/gifReducer";
import useDebounce from "../hooks/useDebounce";
import cn from "../utils/cn";
import useGIFSearch from "../hooks/useGIFSearch";

interface VirtualGIFListProps {
  gifs: GIF[];
  onGIFClick: (gif: GIF) => void;
}

const VirtualGIFList = ({ gifs, onGIFClick }: VirtualGIFListProps) => {
  const favoriteGIFs = useAppSelector((state) => state.gifs.favorites);
  const dispatch = useAppDispatch();

  return (
    <Virtuoso
      className="!h-96"
      data={gifs}
      computeItemKey={(_, gif) => gif.id}
      itemContent={(_, gif) => {
        const isFavorite = Boolean(
          favoriteGIFs.find((favGif) => favGif.id === gif.id)
        );

        return (
          <div
            className="relative mb-2 after:opacity-0 hover:after:opacity-90 active:after:opacity-100"
            role="button"
          >
            <video
              loop
              muted
              autoPlay
              className="block w-full cursor-pointer rounded-md"
              onClick={() => onGIFClick(gif)}
            >
              <source src={gif.MP4} type="video/mp4" />
            </video>
            <button
              className="absolute left-2 top-2"
              onClick={() =>
                dispatch(isFavorite ? removeFavorite(gif.id) : addFavorite(gif))
              }
            >
              <StarIcon
                className={cn(
                  "text-base-200 h-8 w-8 drop-shadow hover:fill-amber-500 hover:text-amber-500",
                  isFavorite && "fill-amber-500 text-amber-500"
                )}
              />
            </button>
          </div>
        );
      }}
    />
  );
};

interface GIFSearchProps {
  searchTerm: string;
  onGIFClick: (gif: GIF) => void;
}

const GIFSearch = ({ searchTerm, onGIFClick }: GIFSearchProps) => {
  const keySearchTerm = searchTerm.replace(/ /g, "+");

  const query = useGIFSearch(keySearchTerm);

  return (
    <>
      {query.isError && (
        <div className="alert alert-error">
          <ExclamationTriangleIcon className="h-5 w-5" />
          {query.error.message}
        </div>
      )}
      {query.isFetching && (
        <div className="flex items-center gap-2">
          <div className="loading loading-spinner"></div>Loading
        </div>
      )}
      {!query.isSuccess && !query.isError && !query.isFetching && (
        <div>Start typing to search for GIFs</div>
      )}
      {query.isSuccess && (
        <VirtualGIFList gifs={query.data} onGIFClick={onGIFClick} />
      )}
    </>
  );
};

interface GIFDialogProps {
  onSelect: (gif: GIF) => void;
}

const GIFDialog = ({ onSelect }: GIFDialogProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showingFavorites, setShowingFavorites] = React.useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const favoriteGIFs = useAppSelector((state) => state.gifs.favorites);

  return (
    <div className="card card-bordered card-compact bg-base-100 w-80 shadow-xl">
      <div className="card-body">
        <div className="flex gap-2">
          <input
            type="text"
            className="input input-bordered mb-2 flex-grow"
            value={searchTerm}
            disabled={showingFavorites}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
          />
          <button
            className="btn btn-square p-0"
            onClick={() => setShowingFavorites((old) => !old)}
          >
            <StarIcon
              className={cn(
                "h-6 w-6 text-amber-400",
                showingFavorites && "fill-amber-500 text-amber-500"
              )}
            />
          </button>
        </div>
        {showingFavorites ? (
          <VirtualGIFList gifs={favoriteGIFs} onGIFClick={onSelect} />
        ) : (
          <GIFSearch searchTerm={debouncedSearchTerm} onGIFClick={onSelect} />
        )}
      </div>
    </div>
  );
};

export default GIFDialog;
