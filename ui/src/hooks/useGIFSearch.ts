import { useQuery } from "@tanstack/react-query";
import { searchGIFs } from "../api/gif";
import { GIF } from "../types";

const useGIFSearch = (searchTerm: string) => {
  const query = useQuery<GIF[], Error>({
    queryKey: ["GIFs", searchTerm],
    queryFn: () => searchGIFs(searchTerm),
    enabled: Boolean(searchTerm),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return query;
};

export default useGIFSearch;
